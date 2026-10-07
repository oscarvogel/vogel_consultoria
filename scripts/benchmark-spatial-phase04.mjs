import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.PHASE04_URL||'http://127.0.0.1:5196',out='docs/capturas/spatial-phase-04';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium'}),results=[];
try{
 for(const variant of ['navy-sticky','light-sticky','navy-pin']){
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.addInitScript(()=>{window.__cls=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
  await page.goto(base);await page.waitForSelector('.narrative-live');await page.evaluate(()=>document.fonts.ready);
  if(variant==='light-sticky')await page.addStyleTag({content:'.narrative-live .evidence-stage{background:rgb(var(--vogel-gray)/var(--evidence-surface,0))}.evidence-copy h2,.evidence-copy h3{color:var(--color-background)}.evidence-copy>p:not(.narrative-marker),.evidence-footer{color:var(--color-panel)}.evidence-stage .narrative-marker,.evidence-stage .text-link{color:var(--color-panel)}'});
  if(variant==='navy-pin')await page.evaluate(async()=>{const {ScrollTrigger}=await import('/src/composables/useSiteMotion.js').then(m=>m.loadSiteMotion());const stage=document.querySelector('.evidence-stage');stage.style.position='relative';window.__pin=ScrollTrigger.create({trigger:document.querySelector('.forest-evidence'),start:'top top',end:()=>'+='+innerHeight*2.6,pin:stage,pinSpacing:false});ScrollTrigger.refresh();});
  const decode=await page.evaluate(()=>Promise.all([...document.querySelectorAll('.forest-evidence img')].map(async img=>{img.loading='eager';const begin=performance.now();await img.decode();return {src:img.currentSrc,loadAndDecodeMs:performance.now()-begin};})));
  const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');await cdp.send('HeapProfiler.collectGarbage');const before=await cdp.send('Performance.getMetrics');
  const frameSamples=await page.evaluate(async()=>{const samples=[];for(let i=0;i<=90;i++){const offset=7.2+i/90*3.5;scrollTo({top:document.querySelector('.narrative-arc').offsetHeight/10.8*offset,behavior:'instant'});const t=performance.now();await new Promise(r=>requestAnimationFrame(r));samples.push(performance.now()-t);}return samples;});
  await page.evaluate(()=>scrollTo({top:document.querySelector('.narrative-arc').offsetHeight/10.8*9.75,behavior:'instant'}));await page.waitForTimeout(300);await page.screenshot({path:`${out}/comparison-${variant}.png`});
  await cdp.send('HeapProfiler.collectGarbage');const after=await cdp.send('Performance.getMetrics');
  const get=(m,k)=>m.metrics.find(x=>x.name===k)?.value;
  frameSamples.sort((a,b)=>a-b);
  results.push({variant,decode,rafMedianMs:frameSamples[45],rafP95Ms:frameSamples[85],layoutSeconds:get(after,'LayoutDuration')-get(before,'LayoutDuration'),scriptSeconds:get(after,'ScriptDuration')-get(before,'ScriptDuration'),heapBefore:get(before,'JSHeapUsedSize'),heapAfter:get(after,'JSHeapUsedSize'),...await page.evaluate(()=>({cls:window.__cls,renderer:document.querySelector('canvas').__vogelSpatial.getState(),images:performance.getEntriesByType('resource').filter(e=>/forestal-/.test(e.name)).map(e=>({url:e.name,duration:e.duration,transfer:e.transferSize}))}))});
  await page.close();
 }
 await writeFile(`${out}/benchmark.json`,JSON.stringify({environment:'Chromium headless; scroll sampling is not physical FPS certification',results},null,2));console.log(JSON.stringify(results.map(({variant,rafMedianMs,rafP95Ms,layoutSeconds,scriptSeconds,heapBefore,heapAfter,cls})=>({variant,rafMedianMs,rafP95Ms,layoutSeconds,scriptSeconds,heapBefore,heapAfter,cls})),null,2));
}finally{await browser.close();}
