import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const phase = process.argv[2] || 'before';
const output = path.resolve(`docs/capturas/segunda-pasada-2026-10-03/${phase}`);
await mkdir(output, {recursive:true});
const browser = await chromium.launch({headless:true});
const report = {phase, date:new Date().toISOString(), captures:[], errors:[]};
async function settleHeadings(page) {
  // Capture the authored final state deterministically, even with software WebGL.
  await page.evaluate(async()=>{
    const {gsap}=await import('/src/composables/useSiteMotion.js').then(m=>m.loadSiteMotion());
    const targets=[...document.querySelectorAll('.is-text-split')].flatMap(h=>[...h.querySelectorAll('*')]);
    gsap.getTweensOf(targets).forEach(tween=>tween.progress(1));
  });
}
try {
for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
  const page = await browser.newPage({viewport,deviceScaleFactor:1});
  page.on('pageerror', e=>report.errors.push(e.message));
  await page.goto('http://127.0.0.1:5177/', {waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1600);
  if (phase !== 'before') await settleHeadings(page);
  for (const id of ['inicio','soluciones','casos','servicios','recursos','nosotros']) {
    await page.locator(`#${id}`).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    await page.waitForTimeout(1000);
    if (phase !== 'before') await settleHeadings(page);
    const name = `${viewport.width}-${id}`;
    await page.screenshot({path:path.join(output,`${name}.png`)});
    report.captures.push({name, overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth), nav:await page.locator('.site-header').evaluate(el=>({background:getComputedStyle(el).backgroundColor,filter:getComputedStyle(el).backdropFilter})), canvasCount:await page.locator('.site-waves-host canvas').count()});
    console.log(`captured ${name}`);
  }
  await page.close();
}
await writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
} finally { await browser.close(); }
