import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir, rename, writeFile } from 'node:fs/promises';
const require=createRequire(import.meta.url);
let chromium;
try { ({chromium}=require('playwright')); }
catch { ({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const out='docs/capturas/coreografia-2026-10-03';
await mkdir(out+'/video',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium'});
const context=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:out+'/video',size:{width:1440,height:1000}}});
const page=await context.newPage();
const samples=[];
await page.addInitScript(()=>{
 window.__shaderProbe={count:0};
 const create=WebGLRenderingContext.prototype.createProgram;
 WebGLRenderingContext.prototype.createProgram=function(...args){
  const program=create.apply(this,args);Object.assign(window.__shaderProbe,{gl:this,program,count:window.__shaderProbe.count+1});return program;
 };
});
try {
 await page.goto(process.env.NARRATIVE_URL||'http://127.0.0.1:5177/',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1800);
 await page.evaluate(async()=>{const {gsap}=await (await import('/src/composables/useSiteMotion.js')).loadSiteMotion();gsap.ticker.lagSmoothing(0);});
 const waypoints=await page.evaluate(async()=>{
  const {ScrollTrigger}=await (await import('/src/composables/useSiteMotion.js')).loadSiteMotion();
  const result=[0];
  for(const id of ['hero-chapter','problems','services']){
   const t=ScrollTrigger.getById(id);
   if(t)for(const progress of [.20,.46,.72,.98])result.push(t.start+(t.end-t.start)*progress);
  }
  const forest=ScrollTrigger.getAll().find(t=>t.vars.pin instanceof Element && t.vars.pin.classList.contains('case-visual'));
  if(forest)for(const progress of [.08,.50,.95])result.push(forest.start+(forest.end-forest.start)*progress);
  for(const id of ['casos','clientes','metodologia','charla-ia-2026','recursos','nosotros','contacto']){
   const el=document.getElementById(id);if(el)result.push(el.getBoundingClientRect().top+scrollY-180);
  }
  return [...new Set(result.map(y=>Math.max(0,Math.round(y))))].sort((a,b)=>a-b);
 });
 const start=Date.now();
 for(const target of waypoints){
  await page.evaluate(target=>window.scrollTo({top:target,behavior:'smooth'}),target);
  await page.waitForTimeout(2000);
  const frame=await page.evaluate(()=>{
   const {gl,program,count}=window.__shaderProbe;
   const uniform=name=>Array.from(gl.getUniform(program,gl.getUniformLocation(program,name)));
   const extension=gl.getExtension('WEBGL_debug_renderer_info');
   return {scrollY,canvas:document.querySelectorAll('canvas').length,count,renderer:extension?gl.getParameter(extension.UNMASKED_RENDERER_WEBGL):null,shape:uniform('u_shape'),space:uniform('u_space'),surface:uniform('u_surface'),finish:uniform('u_finish'),transform:uniform('u_transform')};
  });
  assert.equal(frame.canvas,1);assert.equal(frame.count,1,'one WebGL program across chapters');
  assert(Math.abs(frame.shape[1]-.540)<=.020001);
  assert(Math.abs(frame.space[0]-.110)<=.015001 && Math.abs(frame.space[1]+.190)<=.015001);
  assert(Math.abs(frame.surface[1]-1.158)<.000001 && frame.surface[2]===0,'contrast and brightness unchanged');
  assert(Math.abs(frame.finish[3]-.101)<.000001 && frame.transform[0]===4012,'grain and seed unchanged');
  samples.push({elapsedMs:Date.now()-start,...frame});
 }
 // Reverse through a chapter, retaining native scrolling.
 const reverse=await page.evaluate(async()=>{
  const {ScrollTrigger}=await (await import('/src/composables/useSiteMotion.js')).loadSiteMotion();const t=ScrollTrigger.getById('services');return t.start+(t.end-t.start)*.5;
 });
 await page.evaluate(y=>scrollTo({top:y,behavior:'smooth'}),reverse);await page.waitForTimeout(2200);
 await page.screenshot({path:out+'/after/1440-video-service.png'});
 const video=page.video();await context.close();
 await rename(await video.path(),out+'/video/recorrido-escritorio.webm');
 await writeFile(out+'/video/recorrido.json',JSON.stringify({viewport:{width:1440,height:1000},samples,notes:'Recorrido controlado en Chromium completo, modo headless, con lag smoothing del ticker desactivado en este contexto de captura. Se verifican programa único, límites y uniforms invariantes. Pausas abreviadas; no mide FPS en todos los dispositivos ni cambia la configuración del sitio.'},null,2));
 console.log(out+'/video/recorrido-escritorio.webm');
}finally{await browser.close();}
