import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.SPATIAL_URL||'http://127.0.0.1:5191';
const out=join(tmpdir(),'vogel-spatial-core-phase-01');await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium'}), errors=[],report={checks:[],samples:[]};
async function ready(page){page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.evaluate(()=>document.fonts.ready);}
const state=page=>page.evaluate(()=>document.querySelector('.spatial-canvas').__vogelSpatial.getState());
const triggers=page=>page.evaluate(async()=>{const {ScrollTrigger}=await import('/src/composables/useSiteMotion.js').then(m=>m.loadSiteMotion());return ScrollTrigger.getAll().map(t=>t.vars.id).filter(Boolean);});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});await ready(page);await page.waitForSelector('.spatial-live');
 assert.equal(await page.locator('canvas').count(),1);assert.equal(await page.locator('.landscape-canvas,.site-waves-host,.pin-spacer').count(),0);
 assert.equal((await triggers(page)).filter(id=>id==='vogel-spatial-core').length,1);
 await page.evaluate(async()=>{
  const url=performance.getEntriesByType('resource').find(e=>/\/lenis\.js\?/.test(e.name))?.name;
  if(!url) throw new Error('Lenis module not observed');
  const {default:Lenis}=await import(url), original=Lenis.prototype.emit;
  window.__lenisInstances=new Set();
  Lenis.prototype.emit=function(...args){window.__lenisInstances.add(this);return original.apply(this,args);};
 });
 await page.evaluate(()=>scrollTo({top:100,behavior:'instant'}));
 await page.waitForFunction(()=>window.__lenisInstances.size>0);assert.equal(await page.evaluate(()=>window.__lenisInstances.size),1);
 await page.locator('.hero-copy .action-button').focus();await page.keyboard.press('Enter');await page.waitForTimeout(300);
 assert.equal(new URL(page.url()).hash,'#soluciones');
 assert.equal(await page.locator('.hero-copy .action-button').getAttribute('href'),'#soluciones');
 await page.evaluate(()=>{history.replaceState(null,'',location.pathname);scrollTo({top:0,behavior:'instant'});});
 await page.evaluate(()=>{window.__spatialCanvas=document.querySelector('canvas');});
 for(const p of [0,.5,1,.5,0]) {
  await page.evaluate(p=>scrollTo({top:(document.querySelector('main').offsetHeight-innerHeight)*p,behavior:'instant'}),p);
  await page.waitForTimeout(500);const s=await state(page);report.samples.push(s);
  assert(Math.abs(s.progress-p)<.015);assert.equal(s.calls,2);assert.equal(s.geometries,2);
  assert(await page.evaluate(()=>document.querySelector('canvas')===window.__spatialCanvas));
  await page.screenshot({path:join(out,`desktop-${p}-${report.samples.length}.png`)});
 }
 assert.deepEqual(report.samples[1].position,report.samples[3].position);
 await page.setViewportSize({width:1440,height:700});await page.waitForTimeout(400);
 const baseline=await browser.newPage({viewport:{width:1440,height:700}});
 await baseline.goto(process.env.BASELINE_URL||'http://127.0.0.1:5190');await baseline.waitForSelector('.landscape-live');
 const reference=await baseline.locator('.terrain-label').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y};}));
 const actual=await page.locator('.terrain-label').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y};}));
 reference.forEach((r,i)=>{assert(Math.abs(actual[i].x-r.x)<4);assert(Math.abs(actual[i].y-r.y)<4);});
 await baseline.close();
 assert(await page.evaluate(()=>document.querySelector('canvas')===window.__spatialCanvas));
 await page.screenshot({path:join(out,'desktop-short-hero.png')});
 await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(300);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.mouse.move(1100,700);await page.waitForTimeout(300);assert((await state(page)).position[0]>.01);
 await page.waitForTimeout(2200);assert(Math.abs((await state(page)).position[0])<.02);
 // Real resource metrics across repeated forward/back traversals.
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');
 const before=await cdp.send('Performance.getMetrics');
 for(let i=0;i<10;i++){await page.evaluate(i=>scrollTo(0,i%2?0:document.querySelector('main').offsetHeight-innerHeight),i);await page.waitForTimeout(100);}
 const after=await cdp.send('Performance.getMetrics');report.performance={before:before.metrics,after:after.metrics};
 const heaps=[];
 for(let round=0;round<3;round++){
  for(let i=0;i<6;i++){await page.evaluate(i=>scrollTo(0,i%2?0:document.querySelector('main').offsetHeight-innerHeight),i);await page.waitForTimeout(80);}
  await cdp.send('HeapProfiler.collectGarbage');
  heaps.push((await cdp.send('Performance.getMetrics')).metrics.find(m=>m.name==='JSHeapUsedSize').value);
 }
 report.performance.heapAfterGC=heaps;
 assert.equal((await state(page)).geometries,2);assert.equal(await page.locator('canvas').count(),1);
 await page.evaluate(()=>{const canvas=document.querySelector('canvas');window.__loss=canvas.getContext('webgl2').getExtension('WEBGL_lose_context');window.__loss.loseContext();});
 await page.waitForTimeout(200);assert.equal(await page.locator('.spatial-live').count(),0);assert.equal((await state(page)).running,false);
 await page.evaluate(()=>window.__loss.restoreContext());await page.waitForSelector('.spatial-live');
 assert(await page.evaluate(()=>document.querySelector('canvas')===window.__spatialCanvas));
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForSelector('canvas',{state:'detached'});assert.equal((await triggers(page)).includes('vogel-spatial-core'),false);
 assert.equal(await page.locator('.landscape-poster').first().evaluate(e=>getComputedStyle(e).opacity),'1');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForSelector('.spatial-live');
 await page.setViewportSize({width:390,height:844});await page.waitForSelector('canvas',{state:'detached'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:join(out,'mobile-fallback.png'),fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.waitForSelector('.spatial-live');
 await page.evaluate(()=>document.querySelector('#app').__vue_app__.unmount());assert.equal(await page.locator('canvas').count(),0);assert.deepEqual(await triggers(page),[]);
 await page.close();
 const fallback=await browser.newPage({viewport:{width:1440,height:1000}});
 await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:original.call(this,type,...args);};});
 await ready(fallback);await fallback.waitForTimeout(700);assert.equal(await fallback.locator('canvas').count(),0);assert.equal(await fallback.locator('.spatial-live').count(),0);
 assert(await fallback.locator('.landscape-poster').first().evaluate(e=>e.naturalWidth>0));await fallback.screenshot({path:join(out,'no-webgl.png')});await fallback.close();
 const loading=await browser.newPage({viewport:{width:1440,height:1000}});
 await loading.route(/\/node_modules\/\.vite\/deps\/three/,async route=>{await new Promise(r=>setTimeout(r,600));await route.continue();});
 await ready(loading);await loading.evaluate(()=>document.querySelector('#app').__vue_app__.unmount());await loading.waitForTimeout(1000);assert.equal(await loading.locator('canvas').count(),0);await loading.close();
 const source=await readFile(new URL('../src/components/SpatialExperience.vue',import.meta.url),'utf8');assert(!source.includes('new Lenis'));
 assert.deepEqual(errors,[]);
 report.checks=['persistent canvas','two draw calls and stable geometries','reversible camera','pointer neutral return','one spatial trigger','one runtime Lenis instance','keyboard CTA anchor','context recovery same canvas','dynamic reduced motion','mobile fallback','no WebGL','async/unmount cleanup'];
 await writeFile(join(out,'validation.json'),JSON.stringify({...report,errors},null,2));console.log('ok - spatial browser; evidence '+out);
} finally {await browser.close();}
