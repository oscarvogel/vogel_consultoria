// Photographs the public sites shown in the portfolio, desktop and phone, for scripts/prepare-project-captures.mjs.
//   node scripts/capture-project-sources.mjs [id ...]          (no ids = every project below)
// Pages that reveal their sections on scroll are scrolled end to end first, otherwise everything below the first
// screen is photographed empty (what happened to AN Asociados). Read-only: no clicks, no forms.
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }

// Order matters: prepare-project-captures.mjs pairs measurements.json with urls.json by position.
export const projects = [
  ['an-asociados', 'https://anasociados.com.ar/'],
  ['indufor', 'https://indufor.com.ar/'],
  ['forestal-paraguay', 'https://forestalparaguay.com/'],
  ['forestal-garuhape', 'https://forestalgaruhape.com.ar/'],
  ['servin-lgsm', 'https://servinlgsm.com.ar/'],
  ['h21', 'https://h21.ar/'],
  ['amitrac', 'https://amitrac.ar/'],
  ['municipalidad-garuhape', 'https://garuhape.gob.ar/'],
  ['femag', 'https://femag.com.ar/'], // fecula.com.ar redirige acá
];
const wanted = process.argv.slice(2);
const list = wanted.length ? projects.filter(([id]) => wanted.includes(id)) : projects;
const date = new Date().toISOString().slice(0, 10);
const out = path.resolve('docs/capturas', `project-sources-${date}`);
await fs.mkdir(out, { recursive: true });

// Installed Chrome decodes H.264 (hero videos, e.g. AN Asociados); Playwright's own Chromium shows an empty frame.
let browser;
try { browser = await playwright.chromium.launch({ headless: true, channel: 'chrome' }); }
catch { console.log('Chrome no está instalado: se usa Chromium (los videos de fondo pueden salir vacíos).'); browser = await playwright.chromium.launch({ headless: true }); }
const measurements = [];
for (const [id, url] of list) {
  const entry = { id };
  for (const [variant, viewport, mobile] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
    await context.addInitScript(() => { try { localStorage.setItem('vogel_analytics_consent', 'denied'); } catch { /* optional */ } });
    const page = await context.newPage();
    // 'load' can hang on a stuck third-party resource: DOM ready plus a pause is enough to photograph.
    // Some public sites answer slowly or hang once: one retry before giving up.
    for (let attempt = 1; ; attempt++) {
      try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); break; }
      catch (error) { if (attempt === 2) throw error; console.log(`  · ${id} ${variant}: reintento (${error.name})`); }
    }
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(4500);
    // Libraries such as AOS park sections off-screen and hide them again when you scroll back up. Reveal only what they
    // left hidden (opacity/transform), and never touch carousels, whose slides are positioned with transforms.
    const reveal = () => page.evaluate(() => {
      const carousel = '.swiper,.slick-slider,.owl-carousel,.splide,.flickity-enabled,[class*="carousel"]';
      for (const el of document.querySelectorAll('[data-aos],.aos-init,[data-sal]')) {
        if (el.closest(carousel)) continue;
        el.style.setProperty('opacity', '1', 'important'); el.style.setProperty('transform', 'none', 'important');
        el.style.setProperty('transition', 'none', 'important');
      }
    });
    await reveal();
    // Scroll in steps shorter than a screen so every IntersectionObserver fires, then wait for lazy images.
    await page.evaluate(async () => {
      const step = Math.round(innerHeight * 0.5);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise(r => setTimeout(r, 220)); }
      scrollTo(0, document.documentElement.scrollHeight); await new Promise(r => setTimeout(r, 900));
      // CSS background images (hero photos) are not in document.images: preload every url() in use.
      const urls = new Set();
      for (const el of document.querySelectorAll('*')) { const m = getComputedStyle(el).backgroundImage.match(/url\("?([^")]+)"?\)/g); if (m) m.forEach(u => urls.add(u.replace(/^url\("?|"?\)$/g, ''))); }
      await Promise.all([...urls].slice(0, 60).map(u => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = u; setTimeout(r, 4000); })));
      await Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 4000); })));
      scrollTo(0, 0); await new Promise(r => setTimeout(r, 900));
    });
    await reveal();
    // Background videos: play one second in, then freeze on that frame so the photograph shows real footage.
    await page.evaluate(async () => {
      for (const v of document.querySelectorAll('video')) {
        v.muted = true; v.preload = 'auto';
        try { v.load(); await Promise.race([new Promise(r => v.addEventListener('loadeddata', r, { once: true })), new Promise(r => setTimeout(r, 8000))]); v.currentTime = Math.min(1.5, (v.duration || 2) / 2); await new Promise(r => setTimeout(r, 900)); v.pause(); } catch { /* keep going */ }
      }
    });
    // Promotional pop-ups (e.g. Servin's World Cup banner) appear after a few seconds and darken the whole page.
    const removed = await page.evaluate(() => {
      const gone = [];
      for (const el of document.querySelectorAll('body *')) {
        const s = getComputedStyle(el), r = el.getBoundingClientRect();
        const covers = s.position === 'fixed' && r.width * r.height > innerWidth * innerHeight * 0.25 && r.width > innerWidth * 0.4;
        if (covers || el.matches('[role="dialog"],[aria-modal="true"],dialog[open]')) { gone.push(el.tagName + '.' + String(el.className).slice(0, 30)); el.remove(); }
      }
      document.documentElement.style.overflow = ''; document.body.style.overflow = '';
      return gone;
    });
    if (removed.length) console.log(`  · ${id} ${variant}: oculté ${removed.join(', ')}`);
    await page.waitForTimeout(500);
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const file = path.join(out, `${id}-${variant}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 86, fullPage: true });
    // Full-page screenshots leave <video> layers empty. If the first screen has one, photograph that screen on its own
    // (video frames do render there) and lay it over the top of the long capture.
    if (await page.evaluate(() => [...document.querySelectorAll('video')].some(v => v.getBoundingClientRect().top < innerHeight && v.getBoundingClientRect().height > 100))) {
      await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(700);
      const top = await page.screenshot({ type: 'jpeg', quality: 90 });
      const long = await fs.readFile(file);
      await sharp(long).composite([{ input: top, left: 0, top: 0 }]).jpeg({ quality: 86 }).toFile(file + '.tmp');
      await fs.rename(file + '.tmp', file);
      console.log(`  · ${id} ${variant}: primera pantalla con video compuesta`);
    }
    entry[variant] = { dpr: 1, height: viewport.height, scrollHeight, width: viewport.width };
    await context.close();
  }
  measurements.push(entry);
  console.log(`${id.padEnd(24)} escritorio ${entry.desktop.scrollHeight}px · móvil ${entry.mobile.scrollHeight}px`);
}
await browser.close();
// A partial run (a few ids) must not wipe the rest: merge into what the folder already has, in the canonical order.
const readJson = async (file, fallback) => { try { return JSON.parse(await fs.readFile(path.join(out, file), 'utf8')); } catch { return fallback; } };
const byId = new Map((await readJson('measurements.json', [])).map(item => [item.id, item]));
for (const item of measurements) byId.set(item.id, item);
const all = projects.filter(([id]) => byId.has(id));
await fs.writeFile(path.join(out, 'measurements.json'), JSON.stringify(all.map(([id]) => byId.get(id)), null, 2) + '\n');
await fs.writeFile(path.join(out, 'urls.json'), JSON.stringify(all.map(([, url]) => url), null, 2) + '\n');
console.log(`\nCapturas en ${path.relative(process.cwd(), out)}`);
