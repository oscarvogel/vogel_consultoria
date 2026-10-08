import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const output = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../docs/capturas/navbar-liquid-glass-2026-10-03');
const origin = 'http://127.0.0.1:5177';
const report = { capturedAt: new Date().toISOString(), origin, captures: [], checks: [], errors: [] };

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
const page = await context.newPage();
page.on('pageerror', (error) => report.errors.push(error.message));

async function open(pathname = '/') {
  const response = await page.goto(`${origin}${pathname}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  assert.equal(response?.status(), 200, `${pathname} should respond successfully`);
  await page.locator('.site-header').waitFor({ state: 'visible' });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(600);
  return response.status();
}

async function capture(name, viewport) {
  await page.setViewportSize(viewport);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(350);
  const state = await page.evaluate(() => {
    const header = document.querySelector('.site-header');
    const canvas = document.querySelector('.site-waves-host canvas');
    const style = getComputedStyle(header);
    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentWidth: document.documentElement.scrollWidth,
      headerWidth: Math.round(header.getBoundingClientRect().width),
      headerHeight: Math.round(header.getBoundingClientRect().height),
      backdropFilter: style.backdropFilter || style.webkitBackdropFilter,
      backgroundImage: style.backgroundImage,
      canvasCount: document.querySelectorAll('.site-waves-host canvas').length,
      canvasReady: Boolean(canvas && canvas.width > 0 && canvas.height > 0),
      reducedTransparency: matchMedia('(prefers-reduced-transparency: reduce)').matches,
    };
  });
  assert.equal(state.documentWidth, viewport.width, `${name} should not overflow horizontally`);
  assert.equal(state.canvasCount, 1, `${name} should retain one global shader canvas`);
  assert.equal(state.canvasReady, true, `${name} should retain the rendered shader`);
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: false });
  report.captures.push({ name, ...state });
}

await open('/');
await capture('desktop-default', { width: 1440, height: 1000 });

const casesLink = page.locator('.desktop-nav a[href="/#casos"]');
await casesLink.hover();
await page.waitForFunction(() => {
  const icon = document.querySelector('.desktop-nav a[href="/#casos"] .nav-icon');
  return icon && getComputedStyle(icon).color === 'rgb(255, 255, 255)';
}, null, { timeout: 5000 });
const hoverState = await casesLink.evaluate((node) => ({
  hovered: node.matches(':hover'),
  iconColor: getComputedStyle(node.querySelector('.nav-icon')).color,
}));
assert.equal(hoverState.hovered, true, 'Cases link should receive pointer hover');
assert.equal(hoverState.iconColor, 'rgb(255, 255, 255)', 'hover should brighten the icon');
report.checks.push({ name: 'desktop hover state', result: hoverState });
await page.screenshot({ path: path.join(output, 'desktop-hover-casos.png'), fullPage: false });

await page.evaluate(() => document.getElementById('casos').scrollIntoView({ block: 'start', behavior: 'instant' }));
await page.mouse.move(20, 95);
await page.waitForFunction(() => {
  const link = document.querySelector('.desktop-nav a[href="/#casos"]');
  const icon = link?.querySelector('.nav-icon');
  return link?.getAttribute('aria-current') === 'location' && icon && getComputedStyle(icon).color === 'rgb(139, 197, 255)';
}, null, { timeout: 5000 });
const activeState = await casesLink.evaluate((node) => ({
  current: node.getAttribute('aria-current'),
  iconColor: getComputedStyle(node.querySelector('.nav-icon')).color,
}));
assert.notEqual(activeState.iconColor, hoverState.iconColor, 'active section should have its own persistent icon treatment');
report.checks.push({ name: 'active home section', result: activeState });
await page.screenshot({ path: path.join(output, 'desktop-active-casos.png'), fullPage: false });

await open('/recursos/');
const resourcesLink = page.locator('.desktop-nav a[href="/recursos/"]');
assert.equal(await resourcesLink.getAttribute('aria-current'), 'page', 'resources route should be marked current');
report.checks.push({ name: 'active resources route', result: await resourcesLink.getAttribute('aria-current') });
await capture('desktop-active-recursos', { width: 1440, height: 1000 });

await open('/sistemas-a-medida/');
const servicesSummary = page.locator('.services-menu > summary');
assert.equal(await servicesSummary.getAttribute('aria-current'), 'page', 'service route should mark services current');
await servicesSummary.click();
const activeServiceLink = page.locator('.services-dropdown a[aria-current="page"]');
assert.equal(await activeServiceLink.count(), 1, 'service submenu should identify exactly one current service');
report.checks.push({ name: 'active service route', result: await activeServiceLink.innerText() });
await page.screenshot({ path: path.join(output, 'desktop-active-servicio.png'), fullPage: false });

await servicesSummary.focus();
await page.keyboard.press('Escape');
assert.equal(await page.locator('.services-menu').getAttribute('open'), null, 'Escape should close the services menu');
assert.equal(await servicesSummary.evaluate((node) => document.activeElement === node), true, 'Escape should restore focus to the services trigger');
report.checks.push({ name: 'services menu Escape and focus return', result: 'passed' });

await open('/');
await capture('tablet-1199-cerrado', { width: 1199, height: 900 });
const menuButton = page.getByRole('button', { name: 'Abrir menú' });
await menuButton.focus();
await page.keyboard.press('Enter');
assert.equal(await page.getByRole('navigation', { name: 'Navegación móvil' }).count(), 1, 'tablet menu should open from keyboard');
assert.equal(await page.getByRole('button', { name: 'Cerrar menú' }).getAttribute('aria-expanded'), 'true');
await page.screenshot({ path: path.join(output, 'tablet-1199-menu-abierto.png'), fullPage: false });
await page.keyboard.press('Escape');
assert.equal(await page.getByRole('navigation', { name: 'Navegación móvil' }).count(), 0, 'Escape should close the mobile menu');
assert.equal(await page.getByRole('button', { name: 'Abrir menú' }).evaluate((node) => document.activeElement === node), true, 'Escape should restore focus to the menu button');
report.checks.push({ name: 'tablet menu keyboard open and close', result: 'passed' });

await capture('movil-390-cerrado', { width: 390, height: 844 });
await page.getByRole('button', { name: 'Abrir menú' }).click();
assert.equal(await page.getByRole('navigation', { name: 'Navegación móvil' }).count(), 1, 'touch menu should open');
await page.screenshot({ path: path.join(output, 'movil-390-menu-abierto.png'), fullPage: false });
await page.locator('h1').click({ position: { x: 8, y: 8 } });
assert.equal(await page.getByRole('navigation', { name: 'Navegación móvil' }).count(), 0, 'pointer outside the header should close the mobile menu');
report.checks.push({ name: 'mobile menu pointer outside close', result: 'passed' });

const cdp = await context.newCDPSession(page);
await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
const reducedTransparency = await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches);
if (reducedTransparency) {
  const fallback = await page.locator('.site-header').evaluate((node) => {
    const style = getComputedStyle(node);
    return { backgroundColor: style.backgroundColor, backdropFilter: style.backdropFilter || style.webkitBackdropFilter };
  });
  assert.match(fallback.backgroundColor, /rgba?\(/, 'reduced transparency should retain an opaque navy surface');
  assert.equal(fallback.backdropFilter, 'none', 'reduced transparency should disable backdrop filtering');
  report.checks.push({ name: 'reduced transparency fallback', result: 'passed' });
  await capture('desktop-reduced-transparency', { width: 1440, height: 1000 });
} else {
  report.checks.push({ name: 'reduced transparency emulation', result: 'not supported by Chromium media emulation' });
}

assert.deepEqual(report.errors, [], 'browser should not report page errors');
report.checks.push({ name: 'browser page errors', result: 'none' });
await context.close();
await browser.close();
await writeFile(path.join(output, 'capture-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log(JSON.stringify({ output, captures: report.captures.length, checks: report.checks, errors: report.errors }, null, 2));
