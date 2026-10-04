import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const require=createRequire(import.meta.url);
let chromium;
try {({chromium}=require('playwright'));}
catch {({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const browser=await chromium.launch({headless:true,channel:'chromium'});
const base=process.env.NARRATIVE_URL||'http://127.0.0.1:5177';
const checks=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},hasTouch:true});
 await page.goto(base+'/#servicios');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1800);
 const anchor=await page.locator('#servicios').evaluate(el=>el.getBoundingClientRect().top);
 assert(anchor>=0 && anchor<1000,'initial anchor restored after pins');
 await page.reload();await page.waitForTimeout(1300);
 assert((await page.locator('#servicios').evaluate(el=>el.getBoundingClientRect().top))<1000,'reload at chapter anchor');
 await page.keyboard.press('Tab');
 assert(await page.evaluate(()=>document.activeElement.matches(':focus-visible')),'keyboard focus visible');
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(600);
 const toggle=page.getByRole('button',{name:/menú/i});await toggle.tap();
 assert.equal(await toggle.getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
 await toggle.tap();await page.touchscreen.tap(5,180);assert.equal(await toggle.getAttribute('aria-expanded'),'false');
 checks.push('anchors/reload, keyboard focus, tactile menu, Escape and outside close');
 // End state and form remain task-oriented, with local interception only.
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/#contacto');await page.waitForTimeout(700);
 const form=page.locator('#contacto form');
 assert.equal(await form.count(),1);assert.equal(await form.evaluate(el=>el.checkValidity()),false);
 await form.locator('#contacto-nombre').fill('Demo narrativa');
 await form.locator('[name="email"]').fill('correo-invalido');
 assert.equal(await form.evaluate(el=>el.checkValidity()),false);
 await form.locator('[name="email"]').fill('demo@example.com');
 await form.locator('#contacto-mensaje').fill('Datos de prueba locales para verificar estados del formulario.');
 assert.equal(await form.evaluate(el=>el.checkValidity()),true);
 let release;
 await page.route('https://api.web3forms.com/submit',async route=>{
  await new Promise(resolve=>release=resolve);
  await route.fulfill({status:200,headers:{'access-control-allow-origin':'*'},contentType:'application/json',body:JSON.stringify({success:true})});
 });
 await form.locator('[type="submit"]').click();await page.waitForTimeout(200);
 assert(await form.locator('[type="submit"]').isDisabled(),'loading state prevents duplicate submissions');
 release();await page.locator('#contacto [role="status"]').waitFor();
 await page.getByRole('button',{name:'Enviar otra consulta'}).click();
 await form.locator('#contacto-nombre').fill('Demo narrativa');await form.locator('[name="email"]').fill('demo@example.com');
 await page.unroute('https://api.web3forms.com/submit');
 await page.route('https://api.web3forms.com/submit',route=>route.fulfill({status:500,headers:{'access-control-allow-origin':'*'},contentType:'application/json',body:JSON.stringify({success:false})}));
 await form.locator('[type="submit"]').click();await page.locator('#contacto [role="alert"]').waitFor();
 checks.push('form empty/invalid/valid/loading/success/error; intercepted, no external submission');
 await page.close();
 const fallback=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await fallback.addInitScript(()=>{
  const original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:original.call(this,type,...args);};
 });
 await fallback.goto(base+'/');await fallback.waitForTimeout(700);
 assert(await fallback.locator('h1').isVisible());assert.equal(await fallback.locator('#servicios .chapter-service-links>a').count(),10);
 checks.push('WebGL unavailable: text and ten service destinations preserved');await fallback.close();
 const noGsap=await browser.newPage({viewport:{width:1440,height:1000}});
 await noGsap.route('**/node_modules/.vite/deps/gsap*',route=>route.abort());
 await noGsap.goto(base+'/');await noGsap.waitForTimeout(700);
 assert(await noGsap.locator('h1').isVisible());assert.equal(await noGsap.locator('.pin-spacer').count(),0);
 assert.equal(await noGsap.locator('#servicios .chapter-service-links>a').count(),10);
 checks.push('GSAP unavailable: ordinary flow and service destinations preserved');await noGsap.close();
 await writeFile('docs/capturas/coreografia-2026-10-03/after/behavior.json',JSON.stringify({checks,status:'pass'},null,2));
 console.log('ok - '+checks.join('; '));
}finally{await browser.close();}
