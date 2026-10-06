import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url);let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.PHASE03_URL||'http://127.0.0.1:5194',out=resolve('docs/capturas/spatial-phase-03');
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium'}),errors=[],report={samples:[],viewports:[],checks:[]};
const states=[['systems',2.85],['entering-automation',3.3],['automation',4.05],['entering-data',4.4],['data',5.15],['intelligence',6.1],['decision',7.05]];
const read=page=>page.evaluate(()=>document.querySelector('canvas').__vogelSpatial.getState());
const triggers=page=>page.evaluate(async()=>{const {ScrollTrigger}=await import('/src/composables/useSiteMotion.js').then(m=>m.loadSiteMotion());return ScrollTrigger.getAll().map(t=>t.vars.id).filter(Boolean);});
async function ready(page){page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/Shader Error|VALIDATE_STATUS|INVALID_OPERATION/.test(m.text()))errors.push(m.text());});await page.goto(base);await page.evaluate(()=>document.fonts.ready);}
async function seek(page,offset){
 await page.evaluate(offset=>scrollTo({top:document.querySelector('.narrative-arc').offsetHeight/8*offset,behavior:'instant'}),offset);
 await page.waitForTimeout(180);
 if(offset<8)await page.waitForFunction(async offset=>{
  const s=document.querySelector('canvas').__vogelSpatial.getState();
  if(!s.running||Math.abs(s.progress-Math.min(1,offset/7.2))>.001||Math.abs(s.uniformValues.uData-s.data)>1e-10||Math.abs(s.uniformValues.uConvergence-s.convergence)>1e-10)return false;
  const {phase03Config}=await import('/src/lib/narrativeScenes.js');
  const range=phase03Config.ranges.find(r=>s.progress<=r.end)||phase03Config.ranges.at(-1);
  const p=Math.max(0,Math.min(1,(s.progress-range.start)/(range.end-range.start))),blend=p*p*(3-2*p);
  const from=phase03Config.scenes.find(scene=>scene.id===range.from),to=phase03Config.scenes.find(scene=>scene.id===range.to);
  return s.position.every((v,i)=>Math.abs(v-(from.position[i]+(to.position[i]-from.position[i])*blend))<1e-8);
 },offset);
}
function narrative(s){return {position:s.position,quaternion:s.quaternion,flow:s.flow,data:s.data,intelligence:s.intelligence,clarity:s.clarity,convergence:s.convergence,pulse:s.pulsePhase,selection:s.selectionPhase,local:s.localProgress,chapter:s.chapter,uniforms:s.uniformValues};}
async function frozenPixels(page){const data=await page.evaluate(()=>document.querySelector('canvas').__vogelSpatial.snapshot());const pixels=await sharp(Buffer.from(data.split(',')[1],'base64')).raw().toBuffer();return createHash('sha256').update(pixels).digest('hex');}
async function labels(page){
 const boxes=await page.locator('.spatial-cluster-labels li').evaluateAll(es=>es.filter(e=>Number(getComputedStyle(e).opacity)>.1).map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};}));
 const copies=await page.locator('.narrative-copy').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.left+460,top:r.top,bottom:r.bottom};}));
 const viewport=page.viewportSize();
 for(let i=0;i<boxes.length;i++){const a=boxes[i];assert(a.left>24&&a.right<viewport.width-130&&a.top>120&&a.bottom<viewport.height-40);
  for(const b of [...boxes.slice(0,i),...copies])assert(!(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top),'label overlap');}
 return boxes;
}
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});await ready(page);await page.waitForSelector('.narrative-live');
 assert.equal(await page.locator('canvas').count(),1);assert.equal(await page.locator('.pin-spacer,.landscape-canvas').count(),0);
 assert.equal((await triggers(page)).filter(id=>id==='vogel-spatial-narrative').length,1);
 assert(!(await triggers(page)).includes('vogel-spatial-core'));
 assert.equal((await read(page)).phase,3);assert.equal(await page.locator('.narrative-extension').count(),4);
 await page.evaluate(async()=>{window.__canvas=document.querySelector('canvas');const url=performance.getEntriesByType('resource').find(e=>/\/lenis\.js\?/.test(e.name))?.name;
  const {default:Lenis}=await import(url),emit=Lenis.prototype.emit;window.__instances=new Set();Lenis.prototype.emit=function(...args){window.__instances.add(this);return emit.apply(this,args);};});
 // Pixel regression at the old landscape mask edge, before any scroll.
 const edge=await page.locator('.landscape-hero .data-landscape').evaluate(e=>Math.round(e.getBoundingClientRect().top));
 const pixels=await sharp(await page.screenshot()).extract({left:32,top:edge-2,width:96,height:4}).removeAlpha().raw().toBuffer();
 for(let c=0;c<3;c++){let delta=0;for(let x=0;x<96;x++)delta+=pixels[x*3+c]-pixels[(3*96+x)*3+c];assert(Math.abs(delta)/96<2);}
 const identity=await read(page),forward=new Map(),images=new Map();
 for(const [name,offset] of states){await seek(page,offset);const s=await read(page);forward.set(offset,narrative(s));report.samples.push({name,offset,...s});
  assert.equal(s.calls,5);assert.equal(s.geometries,5);assert.equal(s.textures,0);assert.deepEqual(s.attributes,identity.attributes);assert.deepEqual(s.geometryIds,identity.geometryIds);
  assert(!s.attributes.some(g=>Object.values(g).some(a=>a.id===-1)));assert(await page.evaluate(()=>document.querySelector('canvas')===window.__canvas));
  await labels(page);await page.screenshot({path:resolve(out,`${name}-1440x900.png`)});
  images.set(offset,await frozenPixels(page));
 }
 assert.equal(await page.locator('.narrative-count').textContent(),'07 / 07');assert.equal(await page.locator('.narrative-current').textContent(),'DECISIÓN');
 for(const [,offset] of [...states].reverse()){await seek(page,offset);assert.deepEqual(narrative(await read(page)),forward.get(offset));assert.equal(await frozenPixels(page),images.get(offset),'rendered pixels differ on reversal with frozen ambient time');}
 assert.equal(await page.evaluate(()=>window.__instances.size),1);
 // Scroll-owned pulses change at different offsets but do not drift while stopped.
 await seek(page,3.8);const pulse=await read(page);await page.waitForTimeout(250);assert.equal((await read(page)).pulsePhase,pulse.pulsePhase);
 await seek(page,4);assert((await read(page)).pulsePhase>pulse.pulsePhase);
 await seek(page,5.5);const branching=await read(page);await seek(page,6.1);assert((await read(page)).selectionPhase>branching.selectionPhase);await seek(page,5.5);assert.deepEqual(narrative(await read(page)),narrative(branching));
 // Resize and real loss/recovery in each new scene without changing canvas.
 for(const [name,offset] of states.filter(([name])=>['automation','data','intelligence','decision'].includes(name))){
  await seek(page,offset);await page.setViewportSize({width:1440,height:700});await seek(page,offset);await labels(page);
  assert.deepEqual((await read(page)).attributes,identity.attributes);assert.equal((await read(page)).calls,5);
  await page.evaluate(()=>{window.__loss=document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context');window.__loss.loseContext();});
  await page.waitForFunction(()=>!document.querySelector('.narrative-live'));assert.equal((await read(page)).running,false);assert(await page.locator('.landscape-hero .landscape-poster').isVisible());
  assert.equal(await page.locator('.spatial-narrative-host').evaluate(e=>getComputedStyle(e).visibility),'hidden');
  // Let Chromium release the forcibly lost context before requesting recovery.
  await page.waitForTimeout(250);
  await page.evaluate(()=>window.__loss.restoreContext());
  try{await page.waitForSelector('.narrative-live');}catch(e){console.log('context diagnostic',name,await page.evaluate(()=>({classes:document.querySelector('.home-page').className,hidden:document.hidden,canvas:document.querySelector('canvas')?.__vogelSpatial.getState(),contextLost:document.querySelector('canvas')?.getContext('webgl2')?.isContextLost()})));throw e;}
  assert(await page.evaluate(()=>document.querySelector('canvas')===window.__canvas));
  assert.equal((await read(page)).calls,5);await page.setViewportSize({width:1440,height:900});await seek(page,offset);
  assert.equal(await frozenPixels(page),images.get(offset),`rendered world changed after resize/context recovery: ${name}`);
  report.checks.push(`resize/context recovery: ${name}`);
 }
 for(const viewport of [{width:1920,height:1080},{width:1440,height:700}]){
  await page.setViewportSize(viewport);for(const [name,offset] of states.filter(([name])=>viewport.height===700?['automation','intelligence','decision'].includes(name):['automation','data','decision'].includes(name))){await seek(page,offset);await labels(page);await frozenPixels(page);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));report.samples.push({name:`${name}-${viewport.width}x${viewport.height}`,offset,...await read(page)});await page.screenshot({path:resolve(out,`${name}-${viewport.width}x${viewport.height}.png`)});}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);report.viewports.push(viewport);
 }
 await page.setViewportSize({width:1440,height:900});await seek(page,7.6);assert((await read(page)).handoff>.45);await page.screenshot({path:resolve(out,'handoff.png')});
 await seek(page,8.1);assert.equal((await read(page)).running,false);
 await seek(page,0);await page.locator('.hero-copy .action-button').focus();await page.keyboard.press('Enter');await page.waitForTimeout(700);
 assert.equal(new URL(page.url()).hash,'#soluciones');await page.waitForFunction(()=>{const e=document.querySelector('#soluciones');return Math.abs(e.getBoundingClientRect().top-parseFloat(getComputedStyle(e).scrollMarginTop)-parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop))<3;});
 await seek(page,2.85);assert.deepEqual(await page.locator('.narrative-destinations a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))),['/sistemas-a-medida/','/mantenimiento-de-equipos/','/desarrollo-web/']);
 await page.locator('.narrative-destinations a').first().focus();assert(await page.locator('.narrative-destinations a').first().evaluate(e=>{const r=e.getBoundingClientRect();return r.top>76&&r.bottom<innerHeight;}));
 // Pause and cleanup are shared core invariants.
 await seek(page,5.15);await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(100);assert.equal((await read(page)).running,false);
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(100);assert((await read(page)).running);
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');const heap=[];
 for(let round=0;round<3;round++){for(const [,offset] of [...states,...states.slice().reverse()])await seek(page,offset);await cdp.send('HeapProfiler.collectGarbage');heap.push((await cdp.send('Performance.getMetrics')).metrics.find(m=>m.name==='JSHeapUsedSize').value);}
 report.heapAfterGC=heap;assert(heap[2]-heap[0]<2_000_000,'unbounded heap growth during repeated traversal');
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForSelector('canvas',{state:'detached'});assert(!(await triggers(page)).includes('vogel-spatial-narrative'));
 await page.locator('[data-spatial-scene="intelligence"]').scrollIntoViewIfNeeded();await page.screenshot({path:resolve(out,'reduced-motion.png')});
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForSelector('.narrative-live');
 await page.evaluate(()=>document.querySelector('#app').__vue_app__.unmount());assert.equal(await page.locator('canvas').count(),0);assert.deepEqual(await triggers(page),[]);assert.equal(await page.locator('html.lenis').count(),0);await page.close();
 for(const viewport of [{width:390,height:844},{width:360,height:800}]){
  const mobile=await browser.newPage({viewport,isMobile:true,hasTouch:true});await ready(mobile);await mobile.waitForTimeout(200);
  assert.equal(await mobile.locator('canvas').count(),0);assert.equal(await mobile.evaluate(()=>performance.getEntriesByType('resource').some(e=>/\/three/.test(e.name))),false);
  for(const name of ['automation','data','intelligence','decision']){const section=mobile.locator(`[data-spatial-scene="${name}"]`);await section.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-88,behavior:'instant'}));await mobile.waitForFunction(name=>document.querySelector(`[data-spatial-scene="${name}"] img`).naturalWidth>0,name);await mobile.screenshot({path:resolve(out,`${name}-mobile-${viewport.width}.png`)});assert(await section.locator('h2').isVisible());}
  assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);report.viewports.push(viewport);await mobile.close();
 }
 const reduced=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});await ready(reduced);await reduced.waitForTimeout(200);
 assert.equal(await reduced.locator('canvas').count(),0);assert.equal(await reduced.evaluate(()=>performance.getEntriesByType('resource').some(e=>/\/three/.test(e.name))),false);assert.equal(await reduced.locator('.narrative-extension').count(),4);await reduced.close();
 const fallback=await browser.newPage({viewport:{width:1440,height:900}});await fallback.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:get.call(this,type,...args);};});await ready(fallback);await fallback.waitForSelector('.narrative-unavailable');assert.equal(await fallback.locator('canvas').count(),0);
 await fallback.locator('[data-spatial-scene="decision"]').scrollIntoViewIfNeeded();await fallback.waitForFunction(()=>document.querySelector('[data-spatial-scene="decision"] img').naturalWidth>0);await fallback.screenshot({path:resolve(out,'no-webgl.png')});assert(!(await triggers(fallback)).includes('vogel-spatial-narrative'));await fallback.close();
 const loading=await browser.newPage({viewport:{width:1440,height:900}});await loading.route(/\/node_modules\/\.vite\/deps\/three/,async route=>{await new Promise(r=>setTimeout(r,600));await route.continue();});await ready(loading);await loading.evaluate(()=>document.querySelector('#app').__vue_app__.unmount());await loading.waitForTimeout(1000);assert.equal(await loading.locator('canvas').count(),0);await loading.close();
 assert.deepEqual(errors,[]);report.checks.push('full reverse camera and shader state','all attributes and buffers stable','five draws/geometries; zero textures','one canvas/renderer/Lenis/arc trigger','pulses and branching owned by scroll','labels without overlap','Hero seam regression','handoff pause','hash and keyboard links','document hidden pause','bounded repeated-traversal heap','mobile and initial reduced motion without Three','dynamic reduced motion cleanup','no WebGL','async unmount');
 await writeFile(resolve(out,'validation.json'),JSON.stringify({...report,errors},null,2));console.log('ok - Phase 3 browser; evidence '+out);
}finally{await browser.close();}
