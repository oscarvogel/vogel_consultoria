// Production-build metrics for the Phase 05 home: LCP, CLS, long tasks, listeners, ScrollTriggers, renderer lifetime.
//   npm run build (with VITE_SPATIAL_PHASE_05=true) · npx vite preview --port 5199 · node scripts/perf-phase05.mjs
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.PERF_URL||'http://127.0.0.1:5199',out='docs/capturas/spatial-phase-05';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium',args:['--use-angle=d3d11','--enable-gpu','--ignore-gpu-blocklist']});
const result={};
for(const [name,options] of [['desktop 1440x900',{viewport:{width:1440,height:900}}],['mobile 390x844',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
  const context=await browser.newContext(options),page=await context.newPage(),cdp=await context.newCDPSession(page);
  await page.addInitScript(()=>{
    window.__perf={cls:0,lcp:0,long:0,longMax:0,requests:0};
    new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__perf.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(l=>{for(const e of l.getEntries())window.__perf.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__perf.long+=e.duration;window.__perf.longMax=Math.max(window.__perf.longMax,e.duration);}}).observe({type:'longtask',buffered:true});
  });
  const requests=[];page.on('requestfinished',r=>requests.push(r.url()));
  await page.goto(base);await page.waitForLoadState('networkidle');await page.waitForTimeout(1500);
  const atLoad=requests.length,threeAtLoad=requests.some(u=>/three/.test(u));
  const step=Math.round(options.viewport.height*.5),height=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<height;y+=step){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(60);}
  await page.waitForTimeout(1500);
  await page.evaluate(()=>scrollTo({top:document.querySelector('#nosotros').offsetTop,behavior:'instant'}));await page.waitForTimeout(600);
  const frames=await page.evaluate(()=>document.querySelector('canvas')?.__vogelSpatial?.getState?.().frames??null);await page.waitForTimeout(700);
  const frames2=await page.evaluate(()=>document.querySelector('canvas')?.__vogelSpatial?.getState?.().frames??null);
  const counters=await cdp.send('Memory.getDOMCounters');
  const perf=await page.evaluate(()=>window.__perf);
  const heap=(await cdp.send('Performance.getMetrics').catch(()=>({metrics:[]}))).metrics?.find(m=>m.name==='JSHeapUsedSize')?.value;
  result[name]={lcpMs:Math.round(perf.lcp),cls:+perf.cls.toFixed(4),longTaskTotalMs:Math.round(perf.long),longTaskMaxMs:Math.round(perf.longMax),
    requestsAtLoad:atLoad,threeLoadedAtFirstPaint:threeAtLoad,threeLoadedAfterScroll:requests.some(u=>/three/.test(u)),
    canvases:await page.locator('canvas').count(),rendererPausedInSecondHalf:frames===frames2,
    domNodes:counters.nodes,jsEventListeners:counters.jsEventListeners,jsHeapMB:heap?+(heap/1048576).toFixed(1):null};
  await context.close();
}
await browser.close();
await writeFile(`${out}/performance.json`,JSON.stringify({base,measuredAt:new Date().toISOString(),note:'Chromium headless on a dedicated GPU; indicative, not a field measurement.',result},null,2));
console.log(JSON.stringify(result,null,2));
