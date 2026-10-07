// Visual QA for the editorial half of the Home (Phase 05).
//   node scripts/capture-phase05.mjs            all viewports + states
//   WIDTHS=1440,390 node scripts/capture-phase05.mjs   (subset)   ·   STATES=0 skips special states
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.PHASE05_URL||'http://127.0.0.1:5198',out='docs/capturas/spatial-phase-05';
const widths=process.env.WIDTHS?.split(',').map(Number);
const viewports=[[1920,1080],[1440,900],[1440,700],[1024,768],[768,1024],[430,932],[390,844],[360,800]].filter(([w])=>!widths||widths.includes(w));
const sections=['soluciones','metodologia','nosotros','clientes','recursos','contacto'];
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium'}),report={viewports:[],states:[]};
const mocked=ok=>page=>page.route('https://api.web3forms.com/submit',route=>route.fulfill({status:ok?200:500,contentType:'application/json',body:JSON.stringify({success:ok})}));
async function open(options={},hooks=[]){
  const context=await browser.newContext(options),page=await context.newPage();
  page.on('pageerror',e=>console.error('pageerror',e.message));
  for(const hook of hooks)await hook(page);
  await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(600);
  return page;
}
// Scroll through the page once so every scroll-triggered reveal has run before capturing.
async function reveal(page){
  const height=await page.evaluate(()=>document.documentElement.scrollHeight),step=Math.round(page.viewportSize().height*.6);
  const start=await page.evaluate(()=>document.querySelector('#soluciones').getBoundingClientRect().top+scrollY-300);
  for(let y=Math.max(0,start);y<height;y+=step){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(70);}
  await page.waitForTimeout(1600);
}
async function editorialStrip(page,name){
  const buffers=[];
  // Fixed UI (header, skip link, floating WhatsApp) would be stamped into every element shot; hide it for the strip only.
  const hide=await page.addStyleTag({content:'.site-header,.skip-link,a[href*="wa.me"].fixed,.home-page-content>a.fixed{visibility:hidden!important}'});
  for(const id of sections){
    const el=page.locator('#'+id).first();if(!await el.count())continue;
    await el.scrollIntoViewIfNeeded();
    // The method diagram draws itself in ~2s; let it finish so the still shows the complete route.
    await page.waitForTimeout(id==='metodologia'?2600:160);
    buffers.push(await el.screenshot());
  }
  await hide.evaluate(node=>node.remove());
  const metas=await Promise.all(buffers.map(b=>sharp(b).metadata()));
  const width=Math.max(...metas.map(m=>m.width)),height=metas.reduce((s,m)=>s+m.height,0);
  let top=0;const composite=buffers.map((input,i)=>{const item={input,left:0,top};top+=metas[i].height;return item;});
  await sharp({create:{width,height,channels:3,background:'#05090f'}}).composite(composite).png().toFile(`${out}/${name}.png`);
  return {height,sections:metas.map(m=>m.height)};
}
const overflow=page=>page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
try{
  for(const [width,height] of viewports){
    const mobile=width<=430,page=await open({viewport:{width,height},...(mobile?{isMobile:true,hasTouch:true}:{})});
    await reveal(page);
    const strip=await editorialStrip(page,`fullpage-${width}x${height}`);
    report.viewports.push({width,height,...strip,horizontalOverflow:await overflow(page)});
    console.log(`${width}x${height}`,JSON.stringify(strip),'overflow',report.viewports.at(-1).horizontalOverflow);
    await page.context().close();
  }
  if(process.env.STATES!=='0'){
    const shot=async(name,page)=>{await page.screenshot({path:`${out}/${name}.png`});report.states.push(name);};
    // reduced motion: everything visible, static
    let page=await open({viewport:{width:1440,height:900},reducedMotion:'reduce'});await reveal(page);await editorialStrip(page,'state-reduced-motion');report.states.push('reduced-motion');await page.context().close();
    // no WebGL
    page=await open({viewport:{width:1440,height:900}},[p=>p.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:get.call(this,type,...args);};})]);await reveal(page);await editorialStrip(page,'state-no-webgl');report.states.push('no-webgl');await page.context().close();
    // no portrait: the image request fails, the chapter keeps working
    page=await open({viewport:{width:1440,height:900}},[p=>p.route(/oscar-vogel-\d+\.webp/,r=>r.request().resourceType()==='image'?r.abort():r.continue())]);await reveal(page);
    await page.locator('#nosotros').scrollIntoViewIfNeeded();await page.waitForTimeout(400);await page.locator('#nosotros').screenshot({path:`${out}/state-no-portrait.png`});report.states.push('no-portrait');await page.context().close();
    // form states
    for(const ok of [true,false]){
      page=await open({viewport:{width:1440,height:900}},[mocked(ok)]);await reveal(page);
      await page.locator('#contacto-nombre').fill('Ana Pérez');await page.locator('#contacto-email').fill('ana@empresa.com');await page.locator('#contacto-mensaje').fill('Necesitamos ordenar la carga de producción.');
      await page.locator('#contacto button[type=submit]').click();await page.waitForSelector(ok?'#contacto [role=status]':'#contacto [role=alert]');await page.waitForTimeout(300);
      await page.locator('#contacto').screenshot({path:`${out}/state-form-${ok?'success':'error'}.png`});report.states.push(`form-${ok?'success':'error'}`);await page.context().close();
    }
    // menus
    page=await open({viewport:{width:1440,height:900}});await page.evaluate(()=>scrollTo({top:document.querySelector('#metodologia').getBoundingClientRect().top+scrollY,behavior:'instant'}));await page.waitForTimeout(500);
    await page.locator('.services-menu summary').click();await page.waitForTimeout(250);await shot('state-menu-desktop',page);await page.context().close();
    page=await open({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await page.locator('.menu-toggle').click();await page.waitForTimeout(250);await shot('state-menu-mobile',page);await page.context().close();
  }
  await writeFile(`${out}/capture-report.json`,JSON.stringify(report,null,2));
}finally{await browser.close();}
