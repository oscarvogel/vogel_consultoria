import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setScene, getScene, resetScene, SCENE_LIMITS } from '../src/lib/sceneController.js';
const require=createRequire(import.meta.url);
let chromium;
try { ({chromium}=require('playwright')); }
catch { ({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const url=process.env.NARRATIVE_URL || 'http://127.0.0.1:5177';
const out=process.env.NARRATIVE_OUTPUT || join(tmpdir(),'vogel-capitulos-2026-10-04','narrative');
await mkdir(out,{recursive:true});
setScene({intensityDelta:99,offsetXDelta:-99,offsetYDelta:NaN});
assert.deepEqual(getScene(),{intensityDelta:SCENE_LIMITS.intensityDelta,offsetXDelta:-SCENE_LIMITS.offsetXDelta,offsetYDelta:0});
resetScene();assert.equal(getScene().intensityDelta,0);
const browser=await chromium.launch({headless:true,channel:'chromium'});
const results=[];
const errors=[];
async function ready(page,path='/') {
 await page.goto(url+path,{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(async()=>{
  const {gsap}=await (await import('/src/composables/useSiteMotion.js')).loadSiteMotion();
  // Headless software WebGL can stall a frame. Keep QA tied to elapsed time.
  // This only changes this browser context; application ticker defaults stay intact.
  gsap.ticker.lagSmoothing(0);
 });
 await page.waitForTimeout(1200);
}
async function triggers(page) {
 return page.evaluate(async()=>{
  const {ScrollTrigger}=await (await import('/src/composables/useSiteMotion.js')).loadSiteMotion();
  return ScrollTrigger.getAll().filter(t=>t.vars.pin).map(t=>({id:t.vars.id,start:t.start,end:t.end}));
 });
}
async function jump(page,y) {
 await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);
 await page.waitForTimeout(700);
 await page.evaluate(async()=>{window.__narrativeTriggers=(await (await import('/src/composables/useSiteMotion.js')).loadSiteMotion()).ScrollTrigger;});
 await page.waitForFunction(()=>window.__narrativeTriggers.getAll().every(t=>!t.vars.scrub || !t.animation || Math.abs(t.animation.progress()-t.progress)<.005),null,{timeout:30000});
}
async function jumpProgress(page,id,progress) {
 for(let attempt=0;attempt<3;attempt++){
  const t=(await triggers(page)).find(t=>t.id===id);
  await jump(page,t.start+(t.end-t.start)*progress);
  const actual=await page.evaluate(async id=>{const {ScrollTrigger}=await (await import('/src/composables/useSiteMotion.js')).loadSiteMotion();return ScrollTrigger.getById(id).progress;},id);
  if(Math.abs(actual-progress)<.01)return;
 }
 throw new Error('Chapter geometry did not settle: '+id);
}
try {
 for(const viewport of [{width:1440,height:1000},{width:1199,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  page.on('pageerror',error=>errors.push(error.message));
  await ready(page);
  assert.equal((await triggers(page)).length,0,'initial reduced motion: no pins');
  for(const id of ['inicio','soluciones','casos','servicios','metodologia','nosotros','contacto']){
   await page.locator('#'+id).evaluate(el=>el.scrollIntoView({behavior:'instant'}));
   await page.waitForTimeout(100);
   await page.screenshot({path:out+'/'+viewport.width+'-'+id+'.png'});
  }
  assert.equal(await page.locator('#servicios [data-home-capability]').count(),4);
  assert.equal(await page.locator('#servicios .chapter-service-links>a').count(),10);
  assert.equal(await page.locator('canvas').count(),1);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');
  if(viewport.width>=1024){
   await page.emulateMedia({reducedMotion:'no-preference'});await jump(page,0);
   const pinList=await triggers(page);
   assert.deepEqual(pinList.map(t=>t.id),['home-forest'],'only the forest case pins on home');
   const states=[];
   for(const progress of [.08,.46,.85,.46,.08]){
    await jumpProgress(page,'home-forest',progress);
    const state=Number(await page.locator('#casos').getAttribute('data-home-state'));states.push(state);
    const screen=page.locator('.case-screen').nth(state);
    assert.equal(await screen.getAttribute('aria-hidden'),'false');
    assert.equal(await page.locator('.case-screen[inert]').count(),2,'inactive links cannot receive focus');
    const bounds=await page.locator('.forest-stage').boundingBox();
    const clearance=await page.evaluate(()=>(document.querySelector('.site-header')?.getBoundingClientRect().bottom||24)+80);
    assert(bounds.y>=clearance-2 && bounds.y+bounds.height<=viewport.height,'forest stage fits beneath navbar');
    if(progress===.46 || progress===.85)await page.screenshot({path:out+'/'+viewport.width+'-forest-'+state+'.png'});
   }
   assert.deepEqual(states,[0,1,2,1,0],'three reversible forest states');
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(300);
   assert.equal((await triggers(page)).length,0,'runtime reduced motion cleans pins');
   assert.equal(await page.locator('.case-screen[inert],.case-screen[aria-hidden]').count(),0,'all screenshots accessible after cleanup');
   assert.deepEqual(await page.evaluate(async()=> (await import('/src/lib/sceneController.js')).getScene()),{intensityDelta:0,offsetXDelta:0,offsetYDelta:0});
   await page.emulateMedia({reducedMotion:'no-preference'});await jump(page,0);
   await page.setViewportSize({width:viewport.width,height:720});await page.waitForTimeout(500);
   assert.equal((await triggers(page)).length,0,'short viewport cleans pins');
   await page.setViewportSize(viewport);await page.waitForTimeout(600);
   assert.deepEqual((await triggers(page)).map(t=>t.id),['home-forest'],'forest pin restored on resize');
  }
  results.push({viewport,status:'pass'});console.log('ok - viewport '+viewport.width);await page.close();
 }
 // All institutional entrypoints: preserve content, one canvas and reachable links.
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',error=>errors.push(error.message));
 const services=['sistemas-a-medida','dashboards-ejecutivos','automatizacion-de-procesos','contaflow-api-facturacion-electronica','desarrollo-web','talleres-ia','mantenimiento-de-equipos','integraciones-whatsapp'];
 for(const id of services){
  await ready(page,'/'+id+'/');
  assert.equal(await page.locator('[data-narrative-step]').count(),3);
  assert((await triggers(page)).some(t=>t.id==='connect'),id+' central narrative');
  assert.equal(await page.locator('canvas').count(),1);
  if(id==='sistemas-a-medida'||id==='contaflow-api-facturacion-electronica'){
   const t=(await triggers(page)).find(t=>t.id==='connect');await jump(page,t.start+(t.end-t.start)*.5);
   await page.screenshot({path:out+'/1440-'+id+'.png'});
  }
  if(id.includes('contaflow'))assert.equal(await page.locator('#documentacion-tecnica pre').count(),2);
  results.push({route:'/'+id+'/',status:'pass'});console.log('ok - '+id);
 }
 for(const path of ['/inteligencia-artificial/','/automatizaciones/','/recursos/','/recursos/cuando-conviene-sistema-a-medida/','/recursos/dashboards-ejecutivos-pymes/','/recursos/automatizacion-procesos-administrativos/','/encuesta-contadores/']){
  await ready(page,path);assert.equal(await page.locator('canvas').count(),1);
  assert.equal(await page.locator('h1').count(),1);
  if(path.includes('inteligencia')||path.includes('automatizaciones')){
   assert.equal(await page.locator('[data-narrative-step]').count(),4);
   const t=(await triggers(page)).find(t=>t.id=== (path.includes('inteligencia')?'connect':'automate'));assert(t,'four moments pin');await jump(page,t.start+(t.end-t.start)*.36);
  }else assert.equal((await triggers(page)).length,0,'editorial/form content never pinned');
  await page.screenshot({path:out+'/1440-'+path.split('/').filter(Boolean).at(-1)+'.png'});
  results.push({route:path,status:'pass'});
 }
 // Explicit disposal of a separate enhancement scope leaves no pins or styles.
 await ready(page);
 const disposal=await page.evaluate(async()=>{
  const {gsap,ScrollTrigger}=await (await import('/src/composables/useSiteMotion.js')).loadSiteMotion();
  const {initNarrative}=await import('/src/lib/narrativeMotion.js');
  const fixture=document.createElement('div');fixture.innerHTML='<section data-narrative-hero="100"><div data-hero-stage><h1>Fixture</h1></div></section>';document.body.append(fixture);
  const before=ScrollTrigger.getAll().length;const dispose=initNarrative(fixture,{gsap,ScrollTrigger});const during=ScrollTrigger.getAll().length;dispose();const after=ScrollTrigger.getAll().length;
  const clean=!fixture.querySelector('.pin-spacer,[data-chapter-motion]') && ![...fixture.querySelectorAll('[style]')].some(el=>el.style.cssText.trim());fixture.remove();return {before,during,after,clean};
 });assert(disposal.during>disposal.before);assert.equal(disposal.after,disposal.before);assert(disposal.clean);
 await page.close();
 assert.deepEqual(errors,[],'no page errors');
 await writeFile(out+'/validation.json',JSON.stringify({results,disposal,errors,limitations:['Static captures do not certify temporal fluidity or contrast of every shader frame.','Headless QA disables ticker lag smoothing in its isolated browser context; it does not change application settings or measure user-device FPS.']},null,2));
 console.log('ok - narrative progression, reversibility, viewport/reduced motion, 15 internal routes, shader singleton and disposal');
}finally{await browser.close();}
