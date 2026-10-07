import assert from 'node:assert/strict';
import {RENDER_BUDGET} from '../src/lib/renderBudget.js';
const budget=RENDER_BUDGET.narrative;
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import sharp from 'sharp';
const require=createRequire(import.meta.url);let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.NARRATIVE_URL||'http://127.0.0.1:5192',out=resolve('docs/capturas/spatial-phase-02');
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium'}),errors=[],report={checks:[],viewports:[],samples:[]};
const state=page=>page.evaluate(()=>document.querySelector('canvas').__vogelSpatial.getState());
const triggers=page=>page.evaluate(async()=>{const {ScrollTrigger}=await import('/src/composables/useSiteMotion.js').then(m=>m.loadSiteMotion());return ScrollTrigger.getAll().map(t=>t.vars.id).filter(Boolean);});
async function ready(page){page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/Shader Error|VALIDATE_STATUS|INVALID_OPERATION/i.test(m.text()))errors.push(m.text());});await page.goto(base);await page.evaluate(()=>document.fonts.ready);}
async function seek(page,p){await page.evaluate(p=>scrollTo({top:(document.querySelector('.narrative-arc').offsetHeight-innerHeight)*p,behavior:'instant'}),p);await page.waitForTimeout(180);}
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});await ready(page);await page.waitForSelector('.narrative-live');
 // Regression: the legacy surface's opaque mask must not create a horizontal
 // navy-to-black step above the terrain. Compare quiet pixels across its edge.
 const legacyEdge=await page.locator('.landscape-hero .data-landscape').evaluate(el=>Math.round(el.getBoundingClientRect().top));
 const edgeImage=await sharp(await page.screenshot()).extract({left:32,top:legacyEdge-2,width:96,height:4}).removeAlpha().raw().toBuffer();
 for(let channel=0;channel<3;channel++){
  let above=0,below=0;
  for(let x=0;x<96;x++){above+=edgeImage[x*3+channel];below+=edgeImage[(3*96+x)*3+channel];}
  assert(Math.abs(above-below)/96<2,'Hero has a horizontal color seam at the legacy landscape edge');
 }
 report.checks.push('Hero background continuity across legacy surface edge');
 assert.equal(await page.locator('canvas').count(),1);assert.equal(await page.locator('.landscape-canvas,.pin-spacer,.site-waves-host').count(),0);
 assert.equal((await triggers(page)).filter(id=>id==='vogel-spatial-narrative').length,1);assert(!(await triggers(page)).includes('vogel-spatial-core'));
 await page.evaluate(async()=>{window.__canvas=document.querySelector('canvas');
  const url=performance.getEntriesByType('resource').find(e=>/\/lenis\.js\?/.test(e.name))?.name;
  if(!url)throw Error('Lenis resource not found');const {default:Lenis}=await import(url),emit=Lenis.prototype.emit;
  window.__lenisInstances=new Set();Lenis.prototype.emit=function(...args){window.__lenisInstances.add(this);return emit.apply(this,args);};});
 const identity=await state(page);
 for(const [name,p] of [['intro',0],['entry',.3],['complexity',.5],['mid-transform',.735],['systems',.95],['services',1.2],['systems-reverse',.95],['complexity-reverse',.5],['intro-reverse',0]]){
  await seek(page,p);const s=await state(page);report.samples.push({name,...s});
  assert(Math.abs(s.progress-Math.min(1,p))<.002);assert.equal(s.calls,budget.calls);assert.equal(s.geometries,budget.geometries);assert.equal(s.textures,budget.textures);
  assert.deepEqual(s.geometryIds,identity.geometryIds);assert.deepEqual(s.bufferIds,identity.bufferIds);
  assert(await page.evaluate(()=>document.querySelector('canvas')===window.__canvas));
  if(!name.includes('reverse'))await page.screenshot({path:resolve(out,`${name}.png`)});
 }
 for(const [a,b] of [[0,8],[2,7],[4,6]]){assert.deepEqual(report.samples[a].position,report.samples[b].position);assert.deepEqual(report.samples[a].quaternion,report.samples[b].quaternion);}
 assert.equal(await page.evaluate(()=>window.__lenisInstances.size),1);
 // Projection must follow actual 3D anchors; only collision offsets in y are permitted.
 await seek(page,.735);
 const labels=await page.evaluate(async()=>{
  const T=await import(performance.getEntriesByType('resource').find(e=>/\/three\.js\?/.test(e.name)).name),{clusterDefinitions}=await import('/src/lib/narrativeScenes.js');
  const s=document.querySelector('canvas').__vogelSpatial.getState(),camera=new T.PerspectiveCamera(49,innerWidth/innerHeight,.1,110);
  camera.fov=51+(47-51)*s.order;camera.updateProjectionMatrix();camera.position.fromArray(s.position);camera.quaternion.fromArray(s.quaternion);camera.updateMatrixWorld();
  return [...document.querySelectorAll('.spatial-cluster-labels li')].map((label,i)=>{
   const c=clusterDefinitions[i],v=new T.Vector3().fromArray(c.scattered).lerp(new T.Vector3().fromArray(c.ordered),s.order);
   v.y+=.08*Math.exp(-Math.hypot(v.x,v.z+20)*.25);v.project(camera);const r=label.getBoundingClientRect();
   return {text:label.textContent,visible:Number(getComputedStyle(label).opacity)>.1,x:r.x,y:r.y,width:r.width,height:r.height,expectedX:(v.x+1)*innerWidth*.5+14,expectedY:(1-v.y)*innerHeight*.5-28};
  });
 });
 assert(labels.filter(l=>l.visible).length>=2);for(const label of labels.filter(l=>l.visible)){assert(Math.abs(label.x-label.expectedX)<1);assert(label.y>=label.expectedY-1&&label.y<label.expectedY+100);}
 report.labels=labels;
 for(const p of [.38,.5,.65,.735,.9,.95]){
  await seek(page,p);
  const boxes=await page.locator('.spatial-cluster-labels li').evaluateAll(es=>es.filter(e=>Number(getComputedStyle(e).opacity)>.1).map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};}));
  for(let i=0;i<boxes.length;i++){const a=boxes[i];assert(a.left>24&&a.right<1440-130&&a.top>120&&a.bottom<900-40);for(let j=0;j<i;j++){const b=boxes[j];assert(!(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top),'cluster label overlap');}}
 }

 // Required desktop heights and live resize, while retaining the same canvas and GPU resources.
 for(const viewport of [{width:1440,height:700},{width:1920,height:1080},{width:1440,height:900}]){
  await page.setViewportSize(viewport);await seek(page,.735);const s=await state(page);assert(s.running);assert.equal(s.geometries,budget.geometries);
  assert(await page.evaluate(()=>document.querySelector('canvas')===window.__canvas));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await seek(page,0);
  const overlap=await page.evaluate(()=>{const a=document.querySelector('.hero-copy .action-button').getBoundingClientRect();return [...document.querySelectorAll('.terrain-label')].some(e=>{const b=e.getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;});});assert.equal(overlap,false);
  report.viewports.push(viewport);await page.screenshot({path:resolve(out,`intro-${viewport.width}x${viewport.height}.png`)});
 }
 // Hash navigation and keyboard work without a pinned stage or invisible focus destinations.
 await page.locator('.hero-copy .action-button').focus();await page.keyboard.press('Enter');await page.waitForTimeout(700);assert.equal(new URL(page.url()).hash,'#soluciones');
 await page.waitForFunction(()=>{const e=document.querySelector('#soluciones'),offset=parseFloat(getComputedStyle(e).scrollMarginTop)+parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);return Math.abs(e.getBoundingClientRect().top-offset)<3;});
 await seek(page,1.4);assert.equal((await state(page)).running,false);
 await seek(page,.95);await page.locator('.narrative-destinations a').first().focus();assert(await page.locator('.narrative-destinations a').first().evaluate(e=>{const r=e.getBoundingClientRect();return r.top>76&&r.bottom<innerHeight;}));
 assert.deepEqual(await page.locator('.narrative-destinations a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))),['/sistemas-a-medida/','/mantenimiento-de-equipos/','/desarrollo-web/']);
 // Pointer response is small and returns to neutral.
 await seek(page,.5);const beforePointer=await state(page);await page.mouse.move(1100,500);await page.waitForTimeout(300);assert((await state(page)).position[0]>beforePointer.position[0]);await page.waitForTimeout(2300);assert(Math.abs((await state(page)).position[0])<.02);
 // Frame intervals and CPU/heap are observations of this headless machine, not a 60fps guarantee.
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');
 const before=(await cdp.send('Performance.getMetrics')).metrics;const intervals=await page.evaluate(()=>new Promise(resolve=>{const values=[];let last;function frame(t){if(last)values.push(t-last);last=t;if(values.length<120)requestAnimationFrame(frame);else resolve(values);}requestAnimationFrame(frame);}));
 const after=(await cdp.send('Performance.getMetrics')).metrics;const heaps=[];
 for(let round=0;round<3;round++){for(let i=0;i<6;i++)await seek(page,i%2?0:.95);await cdp.send('HeapProfiler.collectGarbage');heaps.push((await cdp.send('Performance.getMetrics')).metrics.find(m=>m.name==='JSHeapUsedSize').value);}
 report.performance={before,after,frameIntervals:intervals,heapAfterGC:heaps,powerPreference:await page.evaluate(()=>document.querySelector('canvas').getContext('webgl2').getContextAttributes().powerPreference)};
 // Capture and pause in one browser task: RAF may run between separate evaluate calls.
 const elapsedBefore=await page.evaluate(()=>{const elapsed=document.querySelector('canvas').__vogelSpatial.getState().elapsed;window.__originalHidden=Object.getOwnPropertyDescriptor(Document.prototype,'hidden');Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));return elapsed;});await page.waitForTimeout(100);assert.equal((await state(page)).running,false);assert.equal((await state(page)).elapsed,elapsedBefore);
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(100);assert((await state(page)).running);
 await page.evaluate(()=>{window.__loss=document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context');window.__loss.loseContext();});await page.waitForTimeout(150);assert.equal(await page.locator('.narrative-live').count(),0);assert.equal((await state(page)).running,false);
 await page.evaluate(()=>window.__loss.restoreContext());await page.waitForSelector('.narrative-live');assert(await page.evaluate(()=>document.querySelector('canvas')===window.__canvas));
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForSelector('canvas',{state:'detached'});assert(!(await triggers(page)).includes('vogel-spatial-narrative'));assert(await page.locator('.landscape-hero .landscape-poster').isVisible());assert(await page.locator('.narrative-poster').first().evaluate(e=>e.naturalWidth>0));
 await page.locator('#complejidad').evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-112,behavior:'instant'}));await page.screenshot({path:resolve(out,'reduced-motion.png')});
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForSelector('.narrative-live');
 await page.evaluate(()=>document.querySelector('#app').__vue_app__.unmount());assert.equal(await page.locator('canvas').count(),0);assert.deepEqual(await triggers(page),[]);assert.equal(await page.locator('html.lenis').count(),0);await page.close();
 for(const viewport of [{width:390,height:844},{width:360,height:800}]){
  const mobile=await browser.newPage({viewport,isMobile:true,hasTouch:true});await ready(mobile);await mobile.waitForTimeout(200);
  assert.equal(await mobile.locator('canvas').count(),0);assert.equal(await mobile.evaluate(()=>performance.getEntriesByType('resource').some(e=>/\/three/.test(e.name))),false);
  assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.equal(await mobile.locator('.narrative-destinations a').count(),3);
  for(const [name,selector] of [['hero','.landscape-hero'],['complexity','#complejidad'],['systems','#sistemas']]){await mobile.locator(selector).scrollIntoViewIfNeeded();await mobile.screenshot({path:resolve(out,`mobile-${viewport.width}-${name}.png`)});}
  report.viewports.push(viewport);await mobile.close();
 }
 const fallback=await browser.newPage({viewport:{width:1440,height:900}});await fallback.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:get.call(this,type,...args);};});await ready(fallback);await fallback.waitForSelector('.narrative-unavailable');assert.equal(await fallback.locator('canvas').count(),0);assert(!(await triggers(fallback)).includes('vogel-spatial-narrative'));
 assert(await fallback.locator('.narrative-poster').first().evaluate(e=>e.naturalWidth>0));await fallback.locator('#complejidad').evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-112,behavior:'instant'}));await fallback.screenshot({path:resolve(out,'no-webgl.png')});await fallback.close();
 const reduced=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});await ready(reduced);await reduced.waitForTimeout(200);assert.equal(await reduced.locator('canvas').count(),0);assert.equal(await reduced.evaluate(()=>performance.getEntriesByType('resource').some(e=>/\/three/.test(e.name))),false);await reduced.close();
 const loading=await browser.newPage({viewport:{width:1440,height:900}});await loading.route(/\/node_modules\/\.vite\/deps\/three/,async route=>{await new Promise(r=>setTimeout(r,600));await route.continue();});await ready(loading);await loading.evaluate(()=>document.querySelector('#app').__vue_app__.unmount());await loading.waitForTimeout(1000);assert.equal(await loading.locator('canvas').count(),0);await loading.close();
 assert.deepEqual(errors,[]);
 report.checks=['Hero background continuity across legacy surface edge','intro → complexity → systems','exact reverse poses','one persistent canvas/renderer','four stable geometries and draw calls','stable GPU buffers','HTML anchor projection','one runtime Lenis','single arc ScrollTrigger','resize during morph','no Hero CTA overlap','keyboard destinations','hash navigation','pause after handoff','pointer neutral return','document visibility pause','same canvas context recovery','dynamic reduced motion','two mobile viewports without Three','no WebGL','initial reduced motion without Three','async unmount cleanup'];
 await writeFile(resolve(out,'validation.json'),JSON.stringify({...report,errors},null,2));console.log('ok - Phase 2 browser; evidence '+out);
}finally{await browser.close();}
