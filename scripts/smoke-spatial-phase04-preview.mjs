import assert from 'node:assert/strict';
import {RENDER_BUDGET} from '../src/lib/renderBudget.js';
const budget=RENDER_BUDGET.phase03;
import sharp from 'sharp';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const browser=await chromium.launch({headless:true,channel:'chromium'}),base=process.env.PHASE04_PREVIEW_URL||'http://127.0.0.1:5197';
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto(base);await page.waitForSelector('.narrative-live');await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(calls=>document.querySelector('canvas').__vogelSpatial.getState().calls===calls,budget.calls);
 const edge=await page.locator('.landscape-hero .data-landscape').evaluate(e=>Math.round(e.getBoundingClientRect().top));
 const intro=await page.screenshot({path:'docs/capturas/spatial-phase-04/production-intro.png'}),pixels=await sharp(intro).extract({left:32,top:edge-2,width:96,height:4}).removeAlpha().raw().toBuffer();
 for(let c=0;c<3;c++){let delta=0;for(let x=0;x<96;x++)delta+=pixels[x*3+c]-pixels[(3*96+x)*3+c];assert(Math.abs(delta)/96<2,'Hero seam regression');}
 await page.evaluate(()=>scrollTo({top:document.querySelector('.narrative-arc').offsetHeight/10.8*9.75,behavior:'instant'}));await page.waitForTimeout(300);
 const s=await page.evaluate(()=>document.querySelector('canvas').__vogelSpatial.getState());assert.equal(s.phase,4);assert.equal(s.evidenceStep,2);assert.equal(s.running,false);assert.equal(s.calls,budget.calls);
 assert.equal(await page.locator('canvas').count(),1);assert.equal(await page.locator('#casos').count(),1);assert.equal(await page.locator('.home-forest').count(),0);
 assert.equal(await page.evaluate(()=>typeof document.querySelector('canvas').__vogelSpatial.snapshot),'undefined');
 await page.evaluate(()=>Promise.all([...document.querySelectorAll('.forest-evidence img')].map(i=>{i.loading='eager';return i.decode();})));
 assert(await page.locator('.forest-evidence img').evaluateAll(es=>es.every(e=>e.naturalWidth&&e.alt)));
 await page.screenshot({path:'docs/capturas/spatial-phase-04/production-dashboard.png'});await page.close();
 const mobile=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});await mobile.goto(base);await mobile.waitForTimeout(300);assert.equal(await mobile.locator('canvas').count(),0);assert.equal(await mobile.locator('.evidence-step').count(),3);assert(!await mobile.evaluate(()=>performance.getEntriesByType('resource').some(e=>/three.*\.js/.test(e.name))));await mobile.close();
 console.log('ok - production Phase 4 precedence, one case/canvas, renderer pause, images, no capture API and mobile without Three');
}finally{await browser.close();}
