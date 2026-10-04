import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url);
let chromium;
try {({chromium}=require('playwright'));} catch {({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const output=path.resolve('docs/capturas/segunda-pasada-2026-10-03/estados');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const report={date:new Date().toISOString(),checks:[],errors:[]};
page.on('pageerror',e=>report.errors.push(e.message));
const check=(name,data)=>{report.checks.push({name,...data});console.log('ok - '+name);};
try {
 await page.goto('http://127.0.0.1:5177/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('#casos.case-motion'));
 for(const progress of [.04,.5,.96,.5,.04]){
  await page.evaluate(async progress=>{const {ScrollTrigger}=await import('/src/composables/useSiteMotion.js').then(m=>m.loadSiteMotion());const trigger=ScrollTrigger.getAll().find(t=>t.vars.pin?.classList?.contains('case-visual'));window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*progress,behavior:'instant'});ScrollTrigger.update();},progress);
  await page.waitForFunction(()=>{const screen=document.querySelector('.case-screen[aria-hidden="false"]');return screen&&Number(getComputedStyle(screen).opacity)>.99;});
  const state=await page.locator('#casos').evaluate(el=>({active:[...el.querySelectorAll('.case-screen')].findIndex(screen=>screen.getAttribute('aria-hidden')==='false'), visible:[...el.querySelectorAll('.case-screen')].filter(screen=>Number(getComputedStyle(screen).opacity)>.99).length,progress:el.querySelector('.case-progress')?.textContent.trim()}));
  const expected=progress<.1?0:progress>.9?2:1;
  assert.equal(state.active,expected);assert.equal(state.visible,1);
  check(`case ${progress} forward/back`,state);
  if(progress>.9)await page.screenshot({path:path.join(output,'desktop-dashboard.png')});
 }
 await page.setViewportSize({width:1199,height:900});
 await page.locator('#servicios').evaluate(el=>el.scrollIntoView({behavior:'instant'}));
 await page.waitForTimeout(700);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:path.join(output,'tablet-servicios.png')});
 await page.locator('.menu-toggle').click();
 assert.equal(await page.locator('.mobile-nav').isVisible(),true);
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('.mobile-nav').isVisible(),false);
 check('tablet menu Escape',{width:1199});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('#casos').evaluate(el=>el.scrollIntoView({behavior:'instant'}));
 await page.waitForTimeout(500);
 const reduced=await page.locator('#casos').evaluate(el=>({pinned:el.classList.contains('case-motion'),screens:[...el.querySelectorAll('.case-screen')].map(s=>({opacity:getComputedStyle(s).opacity,visibility:getComputedStyle(s).visibility,hidden:s.getAttribute('aria-hidden')}))}));
 assert.equal(reduced.pinned,false);assert(reduced.screens.every(s=>s.opacity==='1'&&s.visibility==='visible'&&s.hidden===null));
 assert.equal(await page.locator('.is-text-split').count(),0);
 check('reduced motion restores all screens and headings',reduced);
 await page.screenshot({path:path.join(output,'desktop-movimiento-reducido.png')});
 for(const route of ['/recursos/','/sistemas-a-medida/','/inteligencia-artificial/','/automatizaciones/','/encuesta-contadores/']){
  const response=await page.goto(`http://127.0.0.1:5177${route}`,{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200);
  await page.locator('main').waitFor();
  assert.equal(await page.locator('.site-waves-host canvas').count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const plane=await page.locator('main').evaluate(el=>getComputedStyle(el,'::before').backgroundColor);
  check('route '+route,{plane});
 }
 assert.equal(report.errors.length,0,report.errors.join('\n'));
}finally{
 await writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
 await browser.close();
}
