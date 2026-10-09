import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const playwright=require('playwright');
const base=process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:5198';
const browser=await playwright.chromium.launch({headless:true});
const open=async()=>{const context=await browser.newContext({viewport:{width:1440,height:900}});await context.addInitScript(()=>{sessionStorage.setItem('vogel-intro','1');localStorage.setItem('vogel-home-view','carousel')});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));return {context,page,errors};};
const leftovers=page=>page.evaluate(()=>({bridges:document.querySelectorAll('.portfolio-image-bridge').length,inline:[...document.querySelectorAll('.project-card')].filter(card=>/transform|position|width|height|left|top/.test((card.getAttribute('style')||'').replace(/--card-shift:[^;]*;?/g,''))).map(card=>card.dataset.projectId)}));
const ok=label=>console.log('ok - '+label);
try{
 {const {context,page,errors}=await open();await context.route(/gsap|\/Flip[-.]/,route=>route.abort());
  await page.goto(base);await page.waitForTimeout(1500);
  await page.locator('[data-project-id="caso-forestal"]').click();await page.waitForSelector('.project-reader');await page.keyboard.press('Escape');await page.waitForSelector('.home-stage:visible');
  await page.getByRole('button',{name:'Vista de grilla'}).click();await page.waitForTimeout(600);
  assert.equal(await page.locator('.project-card').count(),13);assert.deepEqual(errors,[]);assert.deepEqual(await leftovers(page),{bridges:0,inline:[]});
  ok('GSAP blocked: open, close and view change work without uncaught errors');await context.close();}
 {const {context,page,errors}=await open();await page.goto(base);await page.waitForTimeout(2500);
  for(let i=0;i<10;i++){await page.getByRole('button',{name:i%2?'Vista de carrusel':'Vista de grilla'}).click({noWaitAfter:true});await page.waitForTimeout(40);}
  await page.waitForTimeout(1500);assert.deepEqual(await leftovers(page),{bridges:0,inline:[]});ok('rapid carousel/grid toggling leaves no Flip residue');
  for(let i=0;i<5;i++){await page.locator('.project-card').nth(i%3).click({noWaitAfter:true});await page.waitForTimeout(120);await page.keyboard.press('Escape');await page.waitForTimeout(90);}
  await page.waitForTimeout(2000);assert.deepEqual(await leftovers(page),{bridges:0,inline:[]});assert.equal(new URL(page.url()).pathname,'/');assert(await page.locator('.home-stage').isVisible());assert.deepEqual(errors,[]);
  ok('rapid open/close leaves no image bridge and returns to Home');await context.close();}
 {const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await context.addInitScript(()=>sessionStorage.setItem('vogel-intro','1'));const page=await context.newPage();
  await page.goto(base);await page.waitForTimeout(1500);await page.locator('.project-card').nth(1).click();await page.waitForSelector('.project-reader');
  assert.equal(await page.locator('.portfolio-image-bridge').count(),0);ok('reduced motion: no image bridge on open');await context.close();}
 {const {context,page}=await open();await page.goto(base);await page.waitForTimeout(1500);
  await page.evaluate(()=>{window.__bridge=[];const tick=()=>{const bridge=document.querySelector('.portfolio-image-bridge');if(bridge){const rect=bridge.getBoundingClientRect();window.__bridge.push([rect.x,rect.y,rect.width,rect.height]);}requestAnimationFrame(tick);};tick();});
  await page.locator('[data-project-id="an-asociados"]').click();await page.waitForSelector('.project-reader');await page.waitForTimeout(1500);
  const hero=await page.locator('.project-hero img').boundingBox();const samples=await page.evaluate(()=>window.__bridge.splice(0));const last=samples.at(-1);
  assert(samples.length>10,'bridge animated across frames');assert(last.every((value,index)=>Math.abs(value-[hero.x,hero.y,hero.width,hero.height][index])<=2),'bridge lands on the reader hero');
  await page.keyboard.press('Escape');await page.waitForSelector('.home-stage:visible');await page.waitForTimeout(1500);
  const card=await page.locator('[data-project-id="an-asociados"] img').boundingBox();const back=await page.evaluate(()=>window.__bridge.splice(0).at(-1));
  assert(back.every((value,index)=>Math.abs(value-[card.x,card.y,card.width,card.height][index])<=3),'bridge lands on the Home card (parallax included)');
  ok('shared image bridge lands on its target both ways within 3px');await context.close();}
 {const {context,page,errors}=await open();await page.goto(base);await page.waitForTimeout(1500);
  const centre=()=>page.evaluate(()=>{const rail=document.querySelector('.portfolio-rail').getBoundingClientRect();const mid=rail.top+rail.height/2;
   return [...document.querySelectorAll('.rail-link')].map(link=>{const box=link.getBoundingClientRect();return {label:link.textContent.trim(),d:Math.abs(box.top+box.height/2-mid),visible:getComputedStyle(link).visibility!=='hidden'&&Number(getComputedStyle(link).opacity)>.5}}).sort((a,b)=>a.d-b.d)[0];});
  assert.equal((await centre()).label,'Proyectos');
  await page.locator('.rail-link').filter({hasText:'Estudio'}).click();await page.waitForTimeout(1300);
  const studio=await centre();assert.equal(studio.label,'Estudio');assert(studio.d<4,'active item sits in the centre slot');
  await page.locator('.rail-link').filter({hasText:'Soluciones'}).click();await page.waitForTimeout(1300);assert.equal((await centre()).label,'Soluciones');
  ok('wheel rotates the active destination into the centre slot');
  await page.goto(base);await page.waitForTimeout(1500);await page.mouse.move(1300,450);
  const visibleLinks=()=>page.evaluate(()=>[...document.querySelectorAll('.rail-link')].filter(link=>getComputedStyle(link).visibility!=='hidden'&&Number(getComputedStyle(link).opacity)>.5).map(link=>link.textContent.trim()));
  assert.equal((await visibleLinks()).length,5);
  await page.locator('.stage-track').focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(1400);
  assert.deepEqual(await visibleLinks(),['Proyectos'],'wheel collapses to the active label while browsing projects');
  await page.locator('.rail-link').filter({hasText:'Proyectos'}).focus();await page.waitForTimeout(900);
  assert.equal((await visibleLinks()).length,5,'keyboard focus expands the wheel');
  ok('wheel collapses while browsing projects and expands on focus');
  const colors=JSON.parse(await (await import('node:fs/promises')).readFile('src/data/projectColors.json','utf8'));
  const toRgb=hex=>`rgb(${[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(', ')})`;
  await page.locator('.stage-track').focus();await page.keyboard.press('Home');await page.waitForTimeout(1400);
  // Neighbouring projects must read as different backdrops: the hue of consecutive cards differs by at least 30 degrees.
  const hueOf=hex=>{const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255),max=Math.max(r,g,b),d=max-Math.min(r,g,b);if(!d)return 0;const x=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;return (x*60+360)%360;};
  const cardIds=await page.locator('.project-card').evaluateAll(cards=>cards.map(card=>card.dataset.projectId));
  for(let i=1;i<cardIds.length;i++){const gap=Math.abs(hueOf(colors[cardIds[i-1]])-hueOf(colors[cardIds[i]]));assert(Math.min(gap,360-gap)>=30,`${cardIds[i-1]} and ${cardIds[i]} are neighbours with almost the same colour (${Math.round(Math.min(gap,360-gap))} degrees)`);}
  const accentOf=()=>page.evaluate(()=>getComputedStyle(document.querySelector('.stage-backdrop')).getPropertyValue('--accent').trim());
  const ids=await page.locator('.project-card').evaluateAll(cards=>cards.map(card=>card.dataset.projectId));
  // Cream text over the brightest backdrop pixel behind the clock, per project colour (text hidden while sampling).
  const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
  const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  for(const [index,id] of ids.entries()){
   if(index)await page.keyboard.press('ArrowRight');await page.waitForTimeout(1300);
   assert.equal(await accentOf(),toRgb(colors[id]),`backdrop follows ${id}`);
   const clock=page.locator('.portfolio-clock');const box=await clock.boundingBox();const color=(await clock.evaluate(el=>getComputedStyle(el.querySelector('time')).color)).match(/\d+/g).slice(0,3).map(Number);
   await clock.evaluate(el=>el.style.visibility='hidden');const shot=await page.screenshot({clip:box});await clock.evaluate(el=>el.style.visibility='');
   const worst=await page.evaluate(async b64=>{const img=new Image();img.src='data:image/png;base64,'+b64;await img.decode();const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);const d=ctx.getImageData(0,0,img.width,img.height).data;let best=[0,0,0],l=-1;for(let i=0;i<d.length;i+=4){const s=d[i]+d[i+1]+d[i+2];if(s>l){l=s;best=[d[i],d[i+1],d[i+2]]}}return best;},shot.toString('base64'));
   assert(ratio(color,worst)>=4.5,`clock text contrast ${ratio(color,worst).toFixed(2)} over ${id} backdrop`);
  }
  assert.deepEqual(errors,[]);ok(`backdrop colour follows each of ${ids.length} projects and the clock keeps 4.5:1`);await context.close();}
 {const {context,page,errors}=await open();await page.goto(base);await page.waitForTimeout(1500);
  const visibleLinks=()=>page.evaluate(()=>[...document.querySelectorAll('.rail-link')].filter(link=>getComputedStyle(link).visibility!=='hidden'&&Number(getComputedStyle(link).opacity)>.5).map(link=>link.textContent.trim()));
  // Hitbox: only the wheel itself is interactive, never the empty column around it.
  const wheel=await page.locator('.rail-wheel').boundingBox();
  assert(wheel.width<=300&&wheel.height<=320,`wheel hit area is ${Math.round(wheel.width)}x${Math.round(wheel.height)}`);
  for(const [x,y] of [[400,120],[420,450],[300,820],[470,300]])assert(await page.evaluate(([px,py])=>!document.elementFromPoint(px,py)?.closest('.rail-wheel'),[x,y]),`empty rail column at ${x},${y} must not hit the wheel`);
  await page.mouse.move(380,300);await page.mouse.move(420,320);await page.locator('.stage-track').focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(1500);
  assert.deepEqual(await visibleLinks(),['Proyectos']);
  const small=await page.locator('.rail-wheel').boundingBox();assert(small.height<=100,`collapsed wheel is ${Math.round(small.height)}px tall`);
  await page.mouse.move(420,320);await page.mouse.move(430,325);await page.waitForTimeout(1000);
  assert.deepEqual(await visibleLinks(),['Proyectos'],'moving over empty space beside the collapsed wheel does not open it');
  ok('wheel hit area hugs the wheel and shrinks when collapsed');
  // Returning to Projects from another view collapses the wheel again, even with the pointer parked on the link.
  await page.locator('.rail-link').filter({hasText:'Proyectos'}).hover();await page.mouse.move(180,452);await page.mouse.move(185,450);await page.waitForTimeout(900);
  await page.locator('.rail-link').filter({hasText:'Estudio'}).click();await page.waitForTimeout(1400);
  assert.equal((await visibleLinks()).length,5,'wheel is open on destinations');
  await page.locator('.rail-link').filter({hasText:'Proyectos'}).click();await page.waitForTimeout(2000);
  assert.deepEqual(await visibleLinks(),['Proyectos'],'wheel collapses again after returning to Projects');
  assert.deepEqual(errors,[]);ok('wheel collapses again when returning to Projects from another view');await context.close();}
 {const {context,page,errors}=await open();
  const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
  const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  // Worst backdrop pixel behind each rendered line of text (Range rects, not the element box), with all text hidden while sampling.
  async function worstContrast(selector){
   const items=await page.evaluate(sel=>[...document.querySelectorAll(sel)].flatMap(el=>{const range=document.createRange();range.selectNodeContents(el);const color=getComputedStyle(el).color,t=el.textContent.trim().slice(0,22);return [...range.getClientRects()].map(r=>({x:r.left,y:r.top,w:r.width,h:r.height,color,t}))}).filter(i=>i.w>4&&i.h>4&&i.y>=0&&i.y+i.h<=innerHeight&&i.x>=0&&i.x+i.w<=innerWidth),selector);
   if(!items.length)return [];
   await page.addStyleTag({content:'*{color:transparent!important;text-shadow:none!important}'}).then(h=>h.evaluate(el=>{el.id='hide-text'}));
   const results=[];
   for(const item of items){const shot=await page.screenshot({clip:{x:item.x,y:item.y,width:item.w,height:item.h}});
    const worst=await page.evaluate(async b64=>{const img=new Image();img.src='data:image/png;base64,'+b64;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);const d=x.getImageData(0,0,c.width,c.height).data;let best=[0,0,0],l=-1;for(let i=0;i<d.length;i+=4){const s=d[i]+d[i+1]+d[i+2];if(s>l){l=s;best=[d[i],d[i+1],d[i+2]]}}return best},shot.toString('base64'));
    results.push({text:item.t,ratio:ratio(item.color.match(/\d+/g).slice(0,3).map(Number),worst)});}
   await page.evaluate(()=>document.getElementById('hide-text')?.remove());
   return results;}
  const targets={'/soluciones/':'.destination-header p, .destination-service-item p, .destination-contact-note','/recursos/':'.destination-header p, .destination-resource-meta, .destination-resource-link p','/estudio/':'.destination-header p, .destination-method-list p, .destination-person p','/contacto/':'.destination-header p, .destination-form label, .destination-contact-note'};
  for(const [route,selector] of Object.entries(targets)){
   await page.goto(base+route);await page.waitForTimeout(1600);
   for(const y of [0,500]){await page.evaluate(top=>scrollTo(0,top),y);await page.waitForTimeout(900);
    for(const r of await worstContrast(selector))assert(r.ratio>=4.5,`${route} scroll ${y}: "${r.text}" has ${r.ratio.toFixed(2)}:1 over the amber backdrop`);}
  }
  assert.deepEqual(errors,[]);ok('muted text keeps 4.5:1 over the amber backdrop on all four destinations');await context.close();}
}finally{await browser.close();}
