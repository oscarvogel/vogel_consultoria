import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const group=process.argv[2]||'all',base=process.env.LANDSCAPE_URL||'http://127.0.0.1:5190';
const out=join(tmpdir(),'vogel-paisaje-2026-10-04',group);await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium'});
const results=[],errors=[];
async function ready(page,path='/'){
 page.on('pageerror',e=>errors.push(e.message));await page.goto(base+path,{waitUntil:'domcontentloaded'});
 if(path==='/ia.html')await page.waitForURL(u=>u.pathname==='/inteligencia-artificial/',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>Promise.all([...document.images].map(img=>{img.loading='eager';return img.complete?Promise.resolve():new Promise(r=>{img.onload=img.onerror=r;});})));
 await page.waitForTimeout(250);
}
const state=page=>page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,height:document.documentElement.scrollHeight,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),pins:document.querySelectorAll('.pin-spacer,.narrative-enabled,.is-forest-motion').length,canvas:document.querySelectorAll('canvas').length}));
try{
 if(group==='ui'||group==='all'){
  for(const viewport of [{width:1672,height:940},{width:1440,height:1000},{width:1199,height:900},{width:390,height:844},{width:320,height:844}]){
   const page=await browser.newPage({viewport,reducedMotion:'reduce',hasTouch:viewport.width<=390});await ready(page);
   const s=await state(page);assert(!s.overflow);assert.deepEqual(s.broken,[]);assert.equal(s.pins,0);assert.equal(s.canvas,0);
   assert.equal(await page.locator('.hero-copy .action-button').count(),1);
   assert.equal(await page.locator('.hero-copy .action-button').getAttribute('href'),'#soluciones');
   assert.equal(await page.locator('.capability').count(),4);assert.equal(await page.locator('.chapter-service-links>a').count(),10);
   assert.equal(await page.locator('.home-chapter-label').count(),0);
   assert.equal(await page.locator('.case-screen').count(),3);assert.equal(await page.locator('.case-screen[inert],.case-screen[aria-hidden=true]').count(),0);
   assert.equal(await page.locator('.proof-list img').count(),8);
   assert.equal(await page.locator('#web-projects a').count(),8);
   assert.equal(await page.locator('.desktop-nav>a').count(),3);
   assert.equal(await page.locator('.desktop-nav').innerText().then(t=>t.includes('C\u00f3mo trabajamos')),false);
   const typography=await page.evaluate(()=>({
    heading:getComputedStyle(document.querySelector('#hero-title')).fontFamily,
    body:getComputedStyle(document.body).fontFamily,
    loaded:[...document.fonts].filter(face=>['Clash Display','Chillax'].includes(face.family.replace(/^['"]|['"]$/g,''))).map(face=>`${face.family.replace(/^['"]|['"]$/g,'')}:${face.status}`).sort(),
   }));
   assert(typography.heading.includes('Clash Display'),'Hero heading must use Clash Display');
   assert(typography.body.includes('Chillax'),'Body must use Chillax');
   assert.deepEqual(typography.loaded,['Chillax:loaded','Clash Display:loaded'],'Fontshare WOFF2 families must load locally');
   if(viewport.width<=390){
    const cta=await page.locator('.hero-copy .action-button').boundingBox();
    for(const box of await page.locator('.terrain-label').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom};})))assert(box.top>=cta.y+cta.height+20,'Terrain labels overlap hero CTA');
    assert(s.height<13000,'Mobile home exceeds compact target');
    const summary=page.locator('#nosotros summary');await summary.tap();assert(await page.locator('#nosotros details').getAttribute('open')!==null);await summary.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#nosotros details').getAttribute('open'),null);
   }
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:join(out,viewport.width+'-hero.png')});
   await page.screenshot({path:join(out,viewport.width+'-full.png'),fullPage:true});
   if(viewport.width===1440||viewport.width===390)for(const id of ['soluciones','casos','clientes','metodologia','nosotros','contacto']){
    await page.locator('#'+id).evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'}));await page.waitForTimeout(80);await page.screenshot({path:join(out,viewport.width+'-'+id+'.png')});
   }
   results.push({kind:'home',viewport,...s});await page.close();
  }
  const routes=['/sistemas-a-medida/','/dashboards-ejecutivos/','/automatizacion-de-procesos/','/contaflow-api-facturacion-electronica/','/desarrollo-web/','/talleres-ia/','/mantenimiento-de-equipos/','/integraciones-whatsapp/','/inteligencia-artificial/','/ia.html','/automatizaciones/','/encuesta-contadores/','/recursos/','/recursos/cuando-conviene-sistema-a-medida/','/recursos/dashboards-ejecutivos-pymes/','/recursos/automatizacion-procesos-administrativos/'];
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});
   for(const route of routes){
    await ready(page,route);const s=await state(page);assert(!s.overflow,route+' overflow at '+width);assert.deepEqual(s.broken,[],route);assert.equal(s.pins,0,route);assert.equal(s.canvas,0,route);assert.equal(await page.locator('h1').count(),1,route);
    await page.screenshot({path:join(out,width+'-route-'+route.replaceAll('/','_')+'.png')});results.push({route,width,...s});
   }await page.close();
  }
  const fallbackPage=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await fallbackPage.route(/\/fonts\/(?:chillax|clash-display)-variable\.woff2(?:\?.*)?$/,route=>route.abort());
  await ready(fallbackPage);
  const fallbackState=await state(fallbackPage);
  assert(!fallbackState.overflow,'Font fallback must not introduce horizontal overflow');
  assert(await fallbackPage.locator('#hero-title').isVisible(),'Hero remains visible if Fontshare WOFF2 files fail');
  assert(await fallbackPage.locator('body').innerText().then(text=>text.includes('Sistemas, automatización')),'Body copy remains available with system fallbacks');
  await fallbackPage.close();
  console.log('ok - 5 home viewports and 16 inner destinations at desktop/mobile');
 }
 if(group==='motion'||group==='all'){
  const page=await browser.newPage({viewport:{width:1440,height:1000}});await ready(page);await page.waitForSelector('.landscape-live',{timeout:45000});
  assert.equal(await page.locator('canvas').count(),1);await page.evaluate(()=>window.__landscapeCanvas=document.querySelector('canvas'));
  const start=Number(await page.locator('.landscape-live').getAttribute('data-landscape-time'));await page.waitForTimeout(700);
  assert(Number(await page.locator('.landscape-live').getAttribute('data-landscape-time'))>start);
  await page.mouse.move(900,650);await page.waitForTimeout(220);
  assert(Math.abs(await page.evaluate(()=>document.querySelector('canvas').__vogelLandscape.getState().cursor.x))>.03);
  await page.waitForTimeout(2100);assert(await page.evaluate(()=>Math.abs(document.querySelector('canvas').__vogelLandscape.getState().cursor.x)<.02));
  await page.locator('#soluciones').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>document.querySelector('canvas').__vogelLandscape.getState().running),false);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForSelector('.landscape-live');
  await page.screenshot({path:join(out,'1440-live-hero.png')});
  await page.locator('#contacto').evaluate(e=>e.scrollIntoView({behavior:'instant',block:'end'}));await page.waitForSelector('.data-landscape--closing.landscape-live',{timeout:15000});
  assert(await page.evaluate(()=>document.querySelector('canvas')===window.__landscapeCanvas));assert.equal(await page.locator('canvas').count(),1);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForSelector('.data-landscape--hero.landscape-live');
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForSelector('canvas',{state:'detached',timeout:15000});assert.equal(await page.locator('canvas').count(),0);assert.equal(await page.locator('.landscape-live').count(),0);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForSelector('.landscape-live');
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);await page.waitForSelector('.landscape-live');assert.equal(await page.locator('canvas').count(),1);
  await page.setViewportSize({width:1199,height:900});await page.waitForTimeout(500);await page.waitForSelector('.landscape-live');assert.equal(await page.locator('canvas').count(),1);
  await page.evaluate(()=>{const c=document.querySelector('canvas'),gl=c.getContext('webgl2');window.__lostGL=gl;window.__lossExtension=gl.getExtension('WEBGL_lose_context');window.__lossExtension.loseContext();});
  await page.waitForTimeout(200);assert.equal(await page.locator('.landscape-live').count(),0);
  await page.evaluate(()=>window.__lossExtension.restoreContext());await page.waitForSelector('.landscape-live',{timeout:15000});
  await page.evaluate(()=>document.querySelector('#app').__vue_app__.unmount());assert.equal(await page.locator('canvas').count(),0);
  await page.close();
  const fallback=await browser.newPage({viewport:{width:1440,height:1000}});
  await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl'||type==='webgl2')return null;return original.call(this,type,...args);};});
  await ready(fallback);await fallback.waitForTimeout(500);assert.equal(await fallback.locator('.landscape-live').count(),0);assert(await fallback.locator('.landscape-poster').first().evaluate(e=>e.naturalWidth>0));await fallback.close();
  results.push({kind:'motion',checks:['one shared renderer hero/closing','cursor follow and neutral return','offscreen suspension','resize quality','live reduced-motion change','WebGL loss/restoration','no-WebGL static fallback','Vue unmount disposal']});
  console.log('ok - shared renderer, forward/back scroll, resize, reduced motion, context loss, fallback and unmount');
 }
 if(group==='behavior'||group==='all'){
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',hasTouch:true});await ready(page);
  await page.getByRole('button',{name:'Abrir men\u00fa'}).tap();assert(await page.locator('#mobile-navigation').isVisible());await page.keyboard.press('Escape');assert.equal(await page.locator('#mobile-navigation').count(),0);assert(await page.getByRole('button',{name:'Abrir men\u00fa'}).evaluate(e=>e===document.activeElement));
  await page.getByRole('button',{name:'Abrir men\u00fa'}).tap();await page.mouse.click(8,820);assert.equal(await page.locator('#mobile-navigation').count(),0);
  await page.locator('.hero-copy .action-button').click();await page.waitForTimeout(150);assert.equal(new URL(page.url()).hash,'#soluciones');
  await page.reload();assert.equal(new URL(page.url()).hash,'#soluciones');assert.equal((await state(page)).pins,0);
  await page.locator('#contacto').evaluate(e=>e.scrollIntoView({behavior:'instant'}));const form=page.locator('#contacto form'),phone=page.locator('#contacto-telefono');
  assert.equal(await form.evaluate(f=>f.checkValidity()),false);assert.equal(await phone.getAttribute('required'),null);
  await page.locator('#contacto-nombre').fill('Prueba local');await page.locator('#contacto-email').fill('invalid');assert.equal(await form.evaluate(f=>f.checkValidity()),false);
  await page.locator('#contacto-email').fill('demo@example.com');await phone.fill('+54 9 3743 123456');assert(await form.evaluate(f=>f.checkValidity()));
  let release,payload;await page.route('https://api.web3forms.com/submit',async route=>{payload=route.request().postData();await new Promise(r=>release=r);await route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:'{"success":true}'});});
  await form.locator('[type=submit]').click();await page.waitForTimeout(100);assert(await form.locator('[type=submit]').isDisabled());assert(payload.includes('name="Telefono"'));release();
  await page.locator('#contacto [role=status]').waitFor();await page.getByRole('button',{name:'Enviar otra consulta'}).click();
  await page.locator('#contacto-nombre').fill('Prueba local');await page.locator('#contacto-email').fill('demo@example.com');
  await page.unroute('https://api.web3forms.com/submit');await page.route('https://api.web3forms.com/submit',route=>route.fulfill({status:500,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:'{"success":false}'}));
  await form.locator('[type=submit]').click();await page.locator('#contacto [role=alert]').waitFor();await page.close();
  const videoContext=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:join(out,'video'),size:{width:1440,height:1000}}});
  const videoPage=await videoContext.newPage();await ready(videoPage);await videoPage.waitForSelector('.landscape-live,.spatial-live,.narrative-live');await videoPage.waitForTimeout(1000);
  for(const id of ['soluciones','casos','clientes','metodologia','nosotros','contacto']){await videoPage.locator('#'+id).evaluate(e=>e.scrollIntoView({behavior:'smooth',block:'start'}));await videoPage.waitForTimeout(850);}
  for(const id of ['nosotros','metodologia','casos','inicio']){await videoPage.locator('#'+id).evaluate(e=>e.scrollIntoView({behavior:'smooth',block:'start'}));await videoPage.waitForTimeout(650);}
  await videoContext.close();results.push({kind:'behavior',checks:['touch menu','Escape and focus return','outside click','anchor and hash reload','form empty/invalid/loading/success/error with local responses','optional phone payload','recorded forward/back desktop traversal']});console.log('ok - menu touch/Escape/outside, anchors/reload, local form states and recorded desktop traversal');
 }
 assert.deepEqual(errors,[]);
 await writeFile(join(out,'validation.json'),JSON.stringify({group,results,errors,limits:['Local Chromium with emulated viewports and synthesized touch.','Form responses simulated; no external submission delivery verified.','No FPS certification or all-frame contrast certification.']},null,2)+'\n');
 console.log('Evidence: '+out);
}catch(error){console.error(JSON.stringify({errors,message:error.message}));throw error;}finally{await browser.close();}
