import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const require=createRequire(import.meta.url);
let chromium;
try{({chromium}=require('playwright'));}
catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.UI_REVIEW_URL||'http://127.0.0.1:5190';
const out=process.env.UI_REVIEW_OUTPUT||join(tmpdir(),'vogel-capitulos-2026-10-04','ui');
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium'});
const results=[],errors=[];
try{
 for(const viewport of [{width:1440,height:1000},{width:1199,height:900},{width:768,height:1024},{width:390,height:844},{width:320,height:844},{width:1440,height:720}]){
  const page=await browser.newPage({viewport,reducedMotion:'reduce',hasTouch:viewport.width===390});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/');await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>Promise.all([...document.images].map(img=>{img.loading='eager';return img.complete?Promise.resolve():new Promise(resolve=>{img.onload=img.onerror=resolve;});})));
  await page.evaluate(()=>Promise.all([...document.images].map(img=>img.decode().catch(()=>{}))));
  await page.waitForTimeout(300);
  const state=await page.evaluate(()=>({height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,canvases:document.querySelectorAll('canvas').length,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)}));
  console.log(`Measured ${viewport.width}: ${state.height}px`);
  assert(!state.overflow);assert.equal(state.canvases,1);assert.deepEqual(state.broken,[]);
  assert.equal(await page.locator('.hero-actions a').count(),2);
  assert.equal(await page.locator('main > section').count(),7);
  assert.equal(await page.locator('main > section .home-chapter-label').count(),7);
  assert.equal(await page.locator('#servicios .chapter-service-links>a').count(),10);
  assert.equal(await page.locator('#servicios [data-home-capability]').count(),4);
  assert((await page.locator('#servicios svg').count())>0);
  assert((await page.locator('nav svg').count())>0);
  assert.equal(await page.locator('.proof-list a').count(),8);
  assert.equal(await page.locator('.proof-list img').count(),8);
  assert(await page.locator('.proof-list img').evaluateAll(imgs=>imgs.every(img=>new URL(img.src).origin===location.origin || img.src.startsWith('data:image/svg+xml'))));
  assert.equal(await page.locator('#web-projects a').count(),8);
  if(viewport.width===390){
   assert(state.height<=17500,`mobile height ${state.height} exceeds compact target with enlarged proof logos`);
   assert.equal(await page.locator('.home-detail[open]').count(),0);
   const summary=page.locator('#nosotros summary');await summary.tap();
   assert.equal(await page.locator('#nosotros details[open]').count(),1);
   assert(await page.getByRole('heading',{name:'Experiencia profesional'}).isVisible());
   await page.keyboard.press('Tab');await summary.focus();assert(await summary.evaluate(el=>el.matches(':focus-visible')));
   await page.keyboard.press('Enter');assert.equal(await page.locator('#nosotros details[open]').count(),0);
   await page.locator('#charla-ia-2026 summary').tap();assert.equal(await page.locator('#charla-ia-2026 details[open]').count(),1);
   await page.locator('#charla-ia-2026 summary').tap();
   assert.equal(await page.locator('.case-screen a').count(),3);
   assert(await page.locator('.case-screen img').evaluateAll(imgs=>imgs.every(img=>img.getBoundingClientRect().height<=380)));
  }else assert.equal(await page.locator('.home-detail[open]').count(),0);
  for(const id of ['inicio','soluciones','casos','servicios','metodologia','nosotros','contacto']){
   await page.locator('#'+id).evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await page.waitForTimeout(150);await page.screenshot({path:join(out,`${viewport.width}${viewport.height===720?"-short":""}-${id}.png`)});
  }
  await page.locator('.home-capability--decide').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
  await page.waitForTimeout(150);
  await page.screenshot({path:join(out,`${viewport.width}${viewport.height===720?'-short':''}-decidir.png`)});
  await page.locator('#contacto').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
  await page.waitForTimeout(150);
  assert.equal(await page.locator('[data-analytics-cta="floating_whatsapp"]').isVisible(),false);
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(200);
  assert.equal(await page.locator('[data-analytics-cta="floating_whatsapp"]').isVisible(),viewport.width>400&&viewport.height>799);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(100);
  await page.screenshot({path:join(out,`${viewport.width}${viewport.height===720?'-short':''}-full.png`),fullPage:true});
  results.push({viewport,...state,status:'pass'});
  if(viewport.width===390){await page.setViewportSize({width:1199,height:900});await page.waitForTimeout(200);assert.equal(await page.locator('.home-detail[open]').count(),0);}
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.goto(base+'/#contacto');const form=page.locator('#contacto form');
 const phone=form.locator('#contacto-telefono');
 assert.equal(await phone.getAttribute('type'),'tel');assert.equal(await phone.getAttribute('autocomplete'),'tel');assert.equal(await phone.getAttribute('required'),null);
 assert.equal(await form.evaluate(f=>f.checkValidity()),false);
 await form.locator('#contacto-nombre').fill('Prueba local');await form.locator('#contacto-email').fill('invalid');
 assert.equal(await form.evaluate(f=>f.checkValidity()),false);
 await form.locator('#contacto-email').fill('demo@example.com');assert(await form.evaluate(f=>f.checkValidity()));
 let release,payload;
 await page.route('https://api.web3forms.com/submit',async route=>{payload=route.request().postData();await new Promise(r=>release=r);await route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:'{"success":true}'});});
 await form.locator('[type="submit"]').click();await page.waitForTimeout(150);assert(await form.locator('[type="submit"]').isDisabled());assert(payload.includes('name="Telefono"'));
 release();await page.locator('#contacto [role="status"]').waitFor();
 await page.getByRole('button',{name:'Enviar otra consulta'}).click();
 await form.locator('#contacto-nombre').fill('Prueba local');await form.locator('#contacto-email').fill('demo@example.com');await phone.fill('+54 9 3743 123456');assert(await form.evaluate(f=>f.checkValidity()));
 await page.unroute('https://api.web3forms.com/submit');await page.route('https://api.web3forms.com/submit',route=>{payload=route.request().postData();return route.fulfill({status:500,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:'{"success":false}'});});
 await form.locator('[type="submit"]').click();await page.locator('#contacto [role="alert"]').waitFor();assert(payload.includes('+54 9 3743 123456'));assert.equal(await phone.inputValue(),'+54 9 3743 123456');
 await phone.fill('03743 15-123456');assert(await form.evaluate(f=>f.checkValidity()));
 await page.close();
 const generator=await readFile('scripts/generate-service-card-images.mjs','utf8');assert(!generator.includes('<text'));
 const data=await readFile('src/data/servicePages.js','utf8');assert(data.includes('cards/contaflow-api.webp'));
 assert.deepEqual(errors,[]);
 await writeFile(join(out,'validation.json'),JSON.stringify({results,form:'blank/invalid/loading/success/error, optional phone and multipart payload; local mocks only',errors,limitations:['Chromium viewport and synthesized touch, no physical mobile device or Safari validation.','Solid token contrast does not certify every shader frame.']},null,2));
 console.log(JSON.stringify({results,evidence:out,form:'pass',errors},null,2));
}finally{await browser.close();}
