// Samples every animation frame while the portfolio changes view and fails on abrupt cuts:
//  - a view that vanishes (or appears) in one or two frames instead of fading,
//  - Oscar's portrait leaving the viewport or jumping vertically while it enters,
//  - fixed controls shifting sideways when the page gains a scrollbar.
//   PORTFOLIO_TEST_URL=http://127.0.0.1:5205 node scripts/test-transitions.mjs
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const playwright=require('playwright');
const base=process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:5198';
// Real scrollbars (Playwright hides them by default) so a layout shift on Windows is visible to the test.
const browser=await playwright.chromium.launch({headless:true,ignoreDefaultArgs:['--hide-scrollbars']});
const ok=label=>console.log('ok - '+label);

async function open(options={}){
  const context=await browser.newContext({viewport:{width:1440,height:900},...options});
  await context.addInitScript(()=>{sessionStorage.setItem('vogel-intro','1');localStorage.setItem('vogel_analytics_consent','denied');});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  return {context,page,errors};
}
// Starts a per-frame recorder in the page. Effective opacity = product along the ancestor chain (0 when hidden).
const startRecorder=page=>page.evaluate(()=>{
  const effective=el=>{let value=1;for(let n=el;n&&n!==document.documentElement;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden')return 0;value*=Number(s.opacity);}return value;};
  window.__frames=[];window.__recording=true;const t0=performance.now();
  const tick=()=>{const stage=document.querySelector('.home-stage'),dest=document.querySelector('.portfolio-destination'),fig=document.querySelector('.studio-portrait img'),btn=document.querySelector('.site-header .info-button');
    const box=fig&&fig.getBoundingClientRect(),b=btn&&btn.getBoundingClientRect();
    window.__frames.push({t:performance.now()-t0,stage:stage?effective(stage):0,dest:dest?effective(dest):null,fig:box&&{top:box.top,bottom:box.bottom,right:box.right,opacity:effective(fig)},btn:b&&b.left,innerHeight,innerWidth});
    if(window.__recording)requestAnimationFrame(tick);};requestAnimationFrame(tick);
});
const stopRecorder=page=>page.evaluate(()=>{window.__recording=false;return window.__frames;});

// A view must fade: its effective opacity may not jump by more than this between two consecutive frames.
const MAX_STEP=0.45;
function assertSmooth(frames,label,{figure=false}={}){
  assert(frames.length>20,`${label}: too few frames recorded (${frames.length})`);
  for(let i=1;i<frames.length;i++){
    const a=frames[i-1],b=frames[i];
    assert(Math.abs(b.stage-a.stage)<=MAX_STEP,`${label}: Home stage cut from ${a.stage.toFixed(2)} to ${b.stage.toFixed(2)} in one frame at ${Math.round(b.t)}ms`);
    if(a.dest!==null&&b.dest!==null)assert(Math.abs(b.dest-a.dest)<=MAX_STEP,`${label}: destination cut from ${a.dest.toFixed(2)} to ${b.dest.toFixed(2)} in one frame at ${Math.round(b.t)}ms`);
    if(a.btn!==null&&b.btn!==null)assert(Math.abs(b.btn-a.btn)<=1,`${label}: header control moved ${Math.round(Math.abs(b.btn-a.btn))}px sideways at ${Math.round(b.t)}ms`);
  }
  if(figure){
    const seen=frames.filter(f=>f.fig&&f.fig.opacity>0.02);
    assert(seen.length>3,`${label}: the portrait never became visible`);
    for(const f of frames.filter(f=>f.fig)){assert(f.fig.bottom<=f.innerHeight+1,`${label}: portrait bottom at ${Math.round(f.fig.bottom)}px, below the ${f.innerHeight}px viewport (frame ${Math.round(f.t)}ms)`);assert(f.fig.right<=f.innerWidth+60,`${label}: portrait far outside the viewport`);}
    for(let i=1;i<frames.length;i++){const a=frames[i-1].fig,b=frames[i].fig;if(a&&b)assert(Math.abs(b.top-a.top)<=2,`${label}: portrait jumped ${Math.round(Math.abs(b.top-a.top))}px vertically at ${Math.round(frames[i].t)}ms`);}
  }
}
const clickRail=(page,name)=>page.locator('.rail-link').filter({hasText:name}).click();
const settle=page=>page.waitForTimeout(1500);

try{
  {const {context,page,errors}=await open();await page.goto(base);await page.waitForTimeout(1500);
   await startRecorder(page);await clickRail(page,'Estudio');await settle(page);
   assertSmooth(await stopRecorder(page),'Proyectos → Estudio',{figure:true});assert.deepEqual(errors,[]);
   ok('Proyectos → Estudio fades as a whole view and the portrait never leaves the viewport');
   await startRecorder(page);await clickRail(page,'Soluciones');await settle(page);
   assertSmooth(await stopRecorder(page),'Estudio → Soluciones');ok('Estudio → Soluciones fades without a cut');
   await startRecorder(page);await clickRail(page,'Estudio');await settle(page);
   assertSmooth(await stopRecorder(page),'Soluciones → Estudio',{figure:true});ok('Soluciones → Estudio keeps the portrait inside the viewport');
   await startRecorder(page);await clickRail(page,'Proyectos');await settle(page);
   assertSmooth(await stopRecorder(page),'Estudio → Proyectos');ok('Estudio → Proyectos fades back to the stage');
   await context.close();}
  {const {context,page}=await open();await startRecorder(page).catch(()=>{});
   await page.addInitScript(()=>{});await page.goto(base+'/estudio/');await startRecorder(page);await page.waitForTimeout(2200);
   assertSmooth(await stopRecorder(page),'direct /estudio/',{figure:true});ok('direct load of /estudio/ shows the portrait in place');await context.close();}
  {const {context,page,errors}=await open({reducedMotion:'reduce'});await page.goto(base);await page.waitForTimeout(1500);
   await startRecorder(page);await clickRail(page,'Estudio');await page.waitForTimeout(600);const frames=await stopRecorder(page);
   assert(frames.at(-1).dest>=0.99,'reduced motion: destination fully visible after 600ms');assert.deepEqual(errors,[]);
   ok('reduced motion: the view changes immediately without errors');await context.close();}
}finally{await browser.close();}
