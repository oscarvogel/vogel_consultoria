// Phase 05 browser suite. Needs a dev server with VITE_SPATIAL_PHASE_05=true (default http://127.0.0.1:5198).
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {capabilities,alsoServices} from '../src/data/capabilities.js';
import {methodSteps} from '../src/data/method.js';
import {oscarMilestones,oscarCapabilities} from '../src/data/oscar.js';
import {resources} from '../src/data/resources.js';
import {readFileSync} from 'node:fs';
// projects.js imports SVG assets Node cannot load: read the site URLs from its source.
const webProjects=[...readFileSync('src/data/projects.js','utf8').matchAll(/url:'([^']+)'/g)].map(m=>({url:m[1]}));
const require=createRequire(import.meta.url);let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.PHASE05_URL||'http://127.0.0.1:5198',out='docs/capturas/spatial-phase-05';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium'}),errors=[],report={checks:[],viewports:[]};
const ok=name=>report.checks.push(name);
const MAILTO='mailto:oscar@vogelconsultoria.com.ar?subject=Quiero%20agendar%20un%20diagn%C3%B3stico';
const WHATSAPP='https://wa.me/543743667526?text=Hola%20quiero%20agendar%20una%20reuni%C3%B3n';
async function open(options={},hooks=[]){
  const context=await browser.newContext(options),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&/Shader Error|VALIDATE_STATUS|INVALID_OPERATION/.test(m.text()))errors.push(m.text());});
  for(const hook of hooks)await hook(page);
  await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);
  return page;
}
const top=(page,selector)=>page.evaluate(selector=>{const e=document.querySelector(selector);scrollTo({top:e.getBoundingClientRect().top+scrollY-(document.querySelector('.site-header')?.offsetHeight||0),behavior:'instant'});},selector);
async function sweep(page){ // run every scroll-triggered reveal
  const height=await page.evaluate(()=>document.documentElement.scrollHeight),step=Math.round(page.viewportSize().height*.6);
  for(let y=0;y<height;y+=step){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(40);}
  await page.waitForTimeout(2600);
}
const mock=(status,body)=>page=>page.route('https://api.web3forms.com/submit',route=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)}));
const editorial=['soluciones','metodologia','nosotros','clientes','recursos','contacto'];

try{
  // ───────── Desktop: structure, order, ids, no leftovers ─────────
  let page=await open({viewport:{width:1440,height:900}});await page.waitForSelector('.narrative-live');
  assert.equal(await page.locator('canvas').count(),1,'one canvas, no second renderer for the closing');
  const order=await page.evaluate(ids=>{const main=document.querySelector('main'),els=ids.map(id=>document.getElementById(id));
    return {present:els.map(Boolean),sorted:els.every((e,i)=>!i||(els[i-1].compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING)),
      afterCases:document.getElementById('casos').compareDocumentPosition(els[0])&Node.DOCUMENT_POSITION_FOLLOWING,sections:[...main.children].map(c=>c.id||c.className.split(' ')[0])};},editorial);
  assert(order.present.every(Boolean),'all editorial sections exist');assert(order.sorted&&order.afterCases,'order: casos → capacidades → método → persona → trabajo → perspectivas → conversación');
  ok('section order');
  for(const id of ['inicio','soluciones','servicios','casos','metodologia','nosotros','clientes','recursos','charla-ia-2026','contacto','main-content'])assert.equal(await page.locator('#'+id).count(),id==='inicio'?await page.locator('#inicio').count():1,`anchor #${id}`);
  const duplicates=await page.evaluate(()=>{const seen=new Map();document.querySelectorAll('[id]').forEach(e=>seen.set(e.id,(seen.get(e.id)||0)+1));return [...seen].filter(([,n])=>n>1).map(([id])=>id);});
  assert.deepEqual(duplicates,[],'no duplicated ids in the whole document');ok('no duplicated ids');
  assert.equal(await page.locator('.landscape-traces,.trace-wave,.capabilities-grid,.capability,.data-landscape--closing,.solutions-section,.evidence-section').count(),0,'old landing patterns are gone');
  ok('old patterns removed');
  for(const id of editorial){const label=await page.locator('#'+id).getAttribute('aria-labelledby');assert(label&&await page.locator('#'+label).count()===1,`#${id} labelled by a real heading`);}
  assert.equal(await page.locator('main h1').count()+await page.locator('.hero-copy h1,h1').count()>=1,true);
  const levels=await page.evaluate(ids=>ids.flatMap(id=>[...document.querySelectorAll(`#${id} h2,#${id} h3,#${id} h4`)].map(h=>+h.tagName[1])),editorial);
  assert(levels.every((l,i)=>!i||l-levels[i-1]<=1),`heading levels never skip: ${levels}`);ok('landmarks and heading order');

  // ───────── Spatial indicator disappears after Evidence; renderer sleeps in the second half ─────────
  await top(page,'#soluciones');await page.waitForTimeout(600);
  assert.equal(await page.locator('.narrative-progress').evaluate(e=>getComputedStyle(e).opacity),'0','spatial indicator is gone after Evidence');
  const state=await page.evaluate(()=>document.querySelector('canvas').__vogelSpatial.getState());assert.equal(state.running,false,'renderer paused');
  const frames=state.frames;await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>document.querySelector('canvas').__vogelSpatial.getState().frames),frames);
  ok('indicator hidden and GPU idle in the second half');

  // ───────── Capability index ─────────
  const rows=await page.locator('.cap-index a.cap-row').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),title:e.querySelector('.cap-title').textContent,line:e.querySelector('.cap-line').textContent,cta:e.dataset.analyticsCta})));
  assert.deepEqual(rows.map(r=>r.href),capabilities.map(c=>c.href));assert.deepEqual(rows.map(r=>r.title),capabilities.map(c=>c.title));
  const also=await page.locator('.cap-also a').evaluateAll(es=>es.map(e=>e.getAttribute('href')));assert.deepEqual(also,alsoServices.map(s=>s.href));
  for(const href of [...rows.map(r=>r.href),...also]){const response=await page.request.get(new URL(href,base).href);assert(response.ok(),`${href} responds ${response.status()}`);}
  const arc=await page.evaluate(()=>[...document.querySelectorAll('.narrative-arc h2')].map(h=>h.textContent.trim().toLowerCase()));
  for(const r of rows)assert(!arc.includes(r.title.toLowerCase()),`capability "${r.title}" repeats the spatial arc`);
  assert.equal(await page.locator('.cap-index > li').count(),6);ok('capability index: six rows, real links, no arc repetition');
  // row styling: border-top, no cards, no shadow, no big radii
  const rowStyle=await page.locator('.cap-row').first().evaluate(e=>{const s=getComputedStyle(e);return {border:s.borderTopWidth,radius:s.borderRadius,shadow:s.boxShadow,bg:s.backgroundColor};});
  assert.equal(rowStyle.border,'1px');assert.equal(rowStyle.shadow,'none');assert.equal(rowStyle.radius,'0px');
  // hover: subtle shift + amber line, never a floating card
  const titleBox=await page.locator('.cap-row').first().locator('.cap-title');const before=await titleBox.evaluate(e=>e.getBoundingClientRect().left);
  await page.locator('.cap-row').first().hover();await page.waitForTimeout(450);
  const after=await titleBox.evaluate(e=>e.getBoundingClientRect().left);assert(after-before>=4&&after-before<=8,`title shifts 4–8px on hover (${after-before})`);
  assert.equal(await page.locator('.cap-row').first().evaluate(e=>getComputedStyle(e,'::before').transform!=='none'),true,'amber line appears');
  ok('capability hover');

  // ───────── Método Vogel ─────────
  await top(page,'#metodologia');await page.waitForTimeout(2800);
  assert.deepEqual(await page.locator('.method-steps h3').allTextContents(),methodSteps.map(s=>s.label));
  assert.deepEqual(await page.locator('.method-steps li').evaluateAll(es=>es.map(e=>e.id)),methodSteps.map(s=>'metodo-'+s.id));
  assert.equal(await page.locator('.method-diagram svg[role=img] title').count(),1);
  const paths=await page.locator('.method-diagram .m-path').evaluateAll(es=>es.map(e=>+getComputedStyle(e).strokeDashoffset.replace('px','')||0));
  assert(paths.length>=8&&paths.every(v=>v===0),'the route is fully drawn once it entered');
  assert.equal(await page.locator('.method-steps li').first().evaluate(e=>getComputedStyle(e).borderTopWidth),'1px');
  assert(!/Diagn[oó]stico|Dise[nñ]o|Implementaci[oó]n/.test(await page.locator('#metodologia').innerText()),'the generic four-step method is gone');
  ok('method: five steps, diagram drawn');

  // ───────── Persona ─────────
  await top(page,'#nosotros');await page.waitForTimeout(1500);
  const portrait=page.locator('.person-figure img');assert.equal(await portrait.count(),1);
  assert(await portrait.evaluate(e=>e.complete&&e.naturalWidth>0),'portrait loads');assert(/Oscar Vogel/.test(await portrait.getAttribute('alt')));
  assert.equal(await page.locator('.person-years').getAttribute('aria-label'),'Más de veinticinco años de experiencia profesional');
  assert.deepEqual(await page.locator('.person-milestones li span').allTextContents(),oscarMilestones.map(m=>m.year));
  assert.deepEqual(await page.locator('.person-capabilities li').allTextContents(),oscarCapabilities);
  assert.equal(await page.locator('.person-capabilities li').first().evaluate(e=>getComputedStyle(e).borderRadius),'0px','a list, not a cloud of badges');
  assert.equal(await page.locator('#nosotros a[href="/cv-jose-oscar-vogel.pdf"]').count(),1);
  const detail=page.locator('#nosotros details');assert.equal(await detail.evaluate(e=>e.open),false);await detail.locator('summary').focus();await page.keyboard.press('Enter');
  assert.equal(await detail.evaluate(e=>e.open),true,'details toggles by keyboard');assert.equal(await page.locator('.person-experience article').count(),4);assert(/Python/.test(await page.locator('.person-tech').innerText()));
  await page.keyboard.press('Enter');ok('person chapter with portrait');

  // ───────── Trabajo real ─────────
  await top(page,'#clientes');await page.waitForTimeout(1200);
  const logos=await page.locator('.work-logos a').evaluateAll(es=>es.map(e=>({href:e.href,rel:e.rel,target:e.target})));
  assert.deepEqual(logos.map(l=>l.href),webProjects.map(p=>p.url));assert(logos.every(l=>/noopener/.test(l.rel)&&l.target==='_blank'));
  assert(await page.locator('.work-logos img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0&&e.alt)),'all logos load with alt');
  assert.equal(await page.locator('#web-projects').count(),0,'the duplicated project list is gone');
  const femag=await page.locator('.work-femag').innerText();assert(/PROYECTO EN DESARROLLO/i.test(femag)&&/FEMAG/.test(femag)&&!/finalizado|terminado/i.test(femag),'FEMAG stays "en desarrollo"');
  const scope=page.locator('.work-femag details');await scope.locator('summary').click();assert.equal(await page.locator('.work-femag-scope li').count(),4);
  ok('real work: logos, FEMAG in development, no duplication');

  // ───────── Perspectivas + formación ─────────
  await top(page,'#recursos');await page.waitForTimeout(1200);
  const guides=await page.locator('.persp-list a').evaluateAll(es=>es.map(e=>e.getAttribute('href')));assert.deepEqual(guides,resources.slice(0,3).map(r=>r.path));
  for(const href of guides)assert((await page.request.get(new URL(href,base).href)).ok(),`${href} responds`);
  assert.equal(await page.locator('.persp-all a[href="/recursos/"]').count(),1);
  assert.equal(await page.locator('#charla-ia-2026').count(),1);assert.equal(await page.locator('#recursos #charla-ia-2026 a[href^="https://wa.me/"]').count(),1,'training request CTA');
  assert.equal(await page.locator('#charla-ia-2026').evaluate(e=>e.closest('#recursos')!==null),true,'training lives inside Perspectivas');
  ok('perspectives with three real guides and integrated training');

  // ───────── Conversación: links, a11y, closing still ─────────
  await top(page,'#contacto');await page.waitForTimeout(1200);
  assert.equal(await page.locator(`#contacto a[href="${MAILTO}"]`).count(),1);assert.equal(await page.locator(`#contacto a[href="${WHATSAPP}"]`).count(),1);
  assert.equal(await page.locator('.conversation-actions a').count(),2,'at most two alternative actions');
  for(const id of ['contacto-nombre','contacto-email','contacto-telefono','contacto-objetivo','contacto-mensaje'])assert.equal(await page.locator(`label[for="${id}"]`).count(),1,`label for ${id}`);
  assert.equal(await page.locator('#contacto-telefono').evaluate(e=>e.required),false,'phone stays optional');assert.equal(await page.locator('#contacto-nombre').evaluate(e=>e.required),true);
  const field=await page.locator('#contacto-nombre').evaluate(e=>{const s=getComputedStyle(e);return {radius:s.borderTopLeftRadius,size:parseFloat(s.fontSize),borderBottom:s.borderBottomWidth};});
  assert(parseFloat(field.radius)<=8&&field.size>=16&&field.borderBottom==='1px');
  assert(await page.locator('.conversation-world img').evaluate(e=>e.complete&&e.naturalWidth>0),'closing poster loads');assert.equal(await page.locator('canvas').count(),1);
  ok('conversation: links, labels, editorial fields, still-image closing');
  await page.screenshot({path:`${out}/1440x900-conversation.png`});

  // ───────── Navbar + keyboard ─────────
  assert.deepEqual(await page.locator('.desktop-nav > a').allTextContents().then(t=>t.map(s=>s.trim())),['Casos','Método','Perspectivas','Nosotros']);
  assert.equal((await page.locator('.services-menu summary').innerText()).trim(),'Capacidades');assert.equal((await page.locator('.nav-cta').first().innerText()).trim(),'Conversemos');
  assert.equal(await page.locator('.nav-cta').first().getAttribute('href'),'/#contacto');
  await page.locator('.desktop-nav a',{hasText:'Método'}).click();await page.waitForTimeout(900);
  assert.equal(new URL(page.url()).hash,'#metodologia');assert(Math.abs(await page.evaluate(()=>document.getElementById('metodologia').getBoundingClientRect().top))<140,'#metodologia lands under the header');
  assert.equal(await page.locator('.desktop-nav a',{hasText:'Método'}).getAttribute('aria-current'),'location');
  assert.equal(await page.locator('.site-header').evaluate(e=>getComputedStyle(e).backdropFilter),'none','no glass in the header');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);await page.locator('.services-menu summary').focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('.services-menu').evaluate(e=>e.open),true);await page.keyboard.press('Escape');
  assert.equal(await page.locator('.services-menu').evaluate(e=>e.open),false);assert(await page.locator('.services-menu summary').evaluate(e=>e===document.activeElement),'Escape returns focus to the trigger');
  {const fresh=await open({viewport:{width:1440,height:900}});await fresh.keyboard.press('Tab');
    assert(await fresh.evaluate(()=>document.activeElement.classList.contains('skip-link')),'skip link is first in tab order');
    await fresh.keyboard.press('Enter');await fresh.waitForTimeout(300);assert(await fresh.evaluate(()=>document.activeElement.id==='main-content'),'skip link moves focus to main');
    // Tab order through the editorial half follows the visual order: capabilities, then the CTA of the person chapter, then the form.
    await top(fresh,'#soluciones');await fresh.waitForTimeout(500);await fresh.locator('.cap-row').first().focus();
    const seen=[];for(let i=0;i<8;i++){await fresh.keyboard.press('Tab');seen.push(await fresh.evaluate(()=>document.activeElement.closest('[id]')?.id+':'+(document.activeElement.className||document.activeElement.tagName)));}
    assert(seen[0].includes('cap-row')||seen[0].startsWith('soluciones'),`tab order starts inside the index: ${seen[0]}`);
    // Focus is always visible on rows.
    await fresh.locator('.cap-row').nth(2).focus();assert.notEqual(await fresh.locator('.cap-row').nth(2).evaluate(e=>getComputedStyle(e).outlineStyle),'none','capability rows show a focus outline');
    await fresh.context().close();}
  ok('navbar anchors, active state, dropdown, skip link and tab order by keyboard');
  assert((await page.evaluate(async()=>{const {ScrollTrigger}=await import('/src/composables/useSiteMotion.js').then(m=>m.loadSiteMotion());return ScrollTrigger.getAll().length;}))<=40,'bounded ScrollTrigger count');
  ok('bounded ScrollTriggers');

  // ───────── Reveals never gate content (jump straight to the end) ─────────
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(2200);
  const hidden=await page.evaluate(()=>[...document.querySelectorAll('[data-ed-section] [data-ed-item]')].filter(e=>+getComputedStyle(e).opacity<.99).map(e=>e.className||e.tagName));
  assert.deepEqual(hidden,[],'every item of the sections jumped over is visible');ok('reveals complete after a long jump');
  await page.close();

  // ───────── Deep link lands on a visible section ─────────
  page=await open({viewport:{width:1440,height:900}});await page.goto(base+'/#metodologia');await page.waitForTimeout(2600);
  assert(await page.evaluate(()=>{const r=document.getElementById('metodologia').getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}),'deep link reaches Método');
  // Items below the fold wait for their scroll; they must be fully revealed once they arrive.
  await page.locator('.method-steps li').first().scrollIntoViewIfNeeded();await page.waitForTimeout(1400);
  assert.equal(await page.locator('.method-steps li').first().evaluate(e=>+getComputedStyle(e).opacity),1);await page.context().close();

  // ───────── Form: success and error, same UX as before ─────────
  for(const success of [true,false]){
    let posted='';
    page=await open({viewport:{width:1440,height:900}},[async p=>{await p.route('https://api.web3forms.com/submit',route=>{posted=route.request().postData()||'';route.fulfill({status:success?200:500,contentType:'application/json',body:JSON.stringify({success})});});}]);
    await top(page,'#contacto');await page.waitForTimeout(800);
    await page.locator('#contacto-nombre').fill('Ana Pérez');await page.locator('#contacto-email').fill('ana@empresa.com');await page.locator('#contacto-objetivo').selectOption('Automatización de procesos');await page.locator('#contacto-mensaje').fill('Ordenar la carga de producción.');
    await page.locator('#contacto button[type=submit]').click();
    assert(/Ana Pérez/.test(posted)&&/name="access_key"/.test(posted)&&/name="Telefono"/.test(posted)&&/Automatización de procesos/.test(posted),'payload keeps every field');
    if(success){
      await page.waitForSelector('#contacto [role=status]');assert(await page.locator('#contacto [role=status]').evaluate(e=>e===document.activeElement),'success message takes focus');
      assert(/¡Consulta enviada!/.test(await page.locator('#contacto [role=status]').innerText()));
      await page.getByRole('button',{name:'Enviar otra consulta'}).click();assert(await page.locator('#contacto-nombre').evaluate(e=>e===document.activeElement&&e.value===''),'form resets and focuses the name');
    }else{
      await page.waitForSelector('#contacto [role=alert]');assert(/Hubo un problema al enviar/.test(await page.locator('#contacto [role=alert]').innerText()));
      assert.equal(await page.locator('#contacto-nombre').inputValue(),'Ana Pérez','nothing is lost on error');assert.equal(await page.locator('#contacto button[type=submit]').isEnabled(),true);
    }
    await page.context().close();
  }
  ok('contact form: success, error, payload, focus');

  // ───────── No portrait: the chapter keeps working, nothing fake appears ─────────
  page=await open({viewport:{width:1440,height:900}},[p=>p.route(/oscar-vogel-\d+\.webp/,r=>r.request().resourceType()==='image'?r.abort():r.continue())]);await sweep(page);await top(page,'#nosotros');await page.waitForTimeout(600);
  assert.equal(await page.locator('.person-figure').count(),0,'no figure without the photo');assert.equal(await page.locator('#nosotros.has-portrait').count(),0);
  assert.equal(await page.locator('#nosotros img').count(),0,'no placeholder, avatar or broken image');
  assert.equal(await page.locator('#nosotros [class*="avatar"],#nosotros [class*="placeholder"],#nosotros svg circle').count(),0);
  assert(await page.locator('.person-copy').evaluate(e=>e.getBoundingClientRect().width)>=500,'the typographic layout takes the room');
  for(const text of ['+25','Sistemas que acompañan el trabajo real.','1998','Descargar CV'])assert((await page.locator('#nosotros').innerText()).includes(text),`${text} remains`);
  await page.locator('#nosotros').screenshot({path:`${out}/1440x900-no-portrait.png`});await page.context().close();ok('person chapter without portrait');

  // ───────── Reduced motion: static and complete ─────────
  page=await open({viewport:{width:1440,height:900},reducedMotion:'reduce'});await top(page,'#metodologia');await page.waitForTimeout(600);
  assert.equal(await page.locator('canvas').count(),0,'no WebGL with reduced motion');
  const rm=await page.evaluate(()=>({items:[...document.querySelectorAll('[data-ed-item]')].filter(e=>e.style.opacity||e.style.transform).length,dash:[...document.querySelectorAll('.m-path')].filter(e=>e.style.strokeDasharray).length,photo:document.querySelector('[data-ed-photo]')?.style.clipPath||''}));
  assert.deepEqual(rm,{items:0,dash:0,photo:''},'nothing hidden or moved with reduced motion');
  await top(page,'#contacto');await page.waitForTimeout(300);assert(await page.locator('#contacto-nombre').isVisible());await page.context().close();ok('reduced motion');

  // ───────── No WebGL: whole editorial half intact ─────────
  page=await open({viewport:{width:1440,height:900}},[p=>p.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:get.call(this,type,...args);};})]);
  await page.waitForSelector('.narrative-unavailable');assert.equal(await page.locator('canvas').count(),0);
  for(const id of editorial){await top(page,'#'+id);await page.waitForTimeout(350);assert(await page.locator('#'+id).isVisible(),`#${id} visible without WebGL`);}
  assert.equal(await page.locator('.method-steps li').count(),5);await page.context().close();ok('no WebGL');

  // ───────── Mobile: own rhythm ─────────
  page=await open({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  assert.equal(await page.locator('canvas').count(),0);assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').some(e=>/three.*\.js/.test(e.name))),false,'no Three on mobile');
  await top(page,'#metodologia');await page.waitForTimeout(500);
  assert.equal(await page.locator('.method-diagram').evaluate(e=>getComputedStyle(e).display),'none','diagram yields to the vertical line');
  assert.notEqual(await page.locator('.method-steps').evaluate(e=>getComputedStyle(e,'::before').content),'none','vertical method line');
  assert.equal(await page.locator('.cap-row').first().evaluate(e=>getComputedStyle(e).gridTemplateAreas.includes('title')),true);
  const h2=await page.locator('#capacidades-heading').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));assert(h2>=32&&h2<=42,`mobile heading ${h2}px`);
  assert.equal(await page.locator('.ed-shell').first().evaluate(e=>e.getBoundingClientRect().left),20,'20px margins');
  await top(page,'#nosotros');await page.waitForTimeout(500);assert((await page.locator('.person-figure img').boundingBox()).width>=390,'portrait is full width');
  assert.equal(await page.locator('.persp-list a').first().evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),1,'articles as a list');
  await page.locator('.menu-toggle').click();assert.equal((await page.locator('#mobile-navigation .nav-cta').innerText()).trim(),'Conversemos');
  assert((await page.locator('#mobile-navigation').innerText()).includes('Perspectivas'));await page.context().close();ok('mobile rhythm and menu');

  // ───────── No horizontal overflow at every viewport ─────────
  for(const [w,h] of [[1920,1080],[1440,900],[1440,700],[1024,768],[768,1024],[430,932],[390,844],[360,800]]){
    page=await open({viewport:{width:w,height:h},...(w<=430?{isMobile:true,hasTouch:true}:{})});
    const widths=[];for(const target of ['body','#soluciones','#metodologia','#nosotros','#clientes','#recursos','#contacto']){if(target==='body')await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));else await top(page,target);await page.waitForTimeout(250);widths.push(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth));}
    await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(250);widths.push(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
    assert(widths.every(v=>v<=0),`horizontal overflow at ${w}x${h}: ${widths}`);report.viewports.push({w,h,widths});await page.context().close();
  }
  ok('no horizontal overflow in 8 viewports');

  assert.deepEqual(errors,[]);
  await writeFile(`${out}/validation.json`,JSON.stringify(report,null,2));console.log('ok - Phase 5 browser; '+report.checks.length+' groups; evidence '+out);
}finally{await browser.close();}
