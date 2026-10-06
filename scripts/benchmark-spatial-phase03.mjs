import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.PHASE03_URL||'http://127.0.0.1:5194';
const browser=await chromium.launch({headless:true,channel:'chromium'}),samples=[];
try{
 for(let round=0;round<3;round++)for(const preference of ['low-power','high-performance']){
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  // Empty same-origin surface: benchmark owns exactly one renderer and no app.
  await page.route('**/__spatial_benchmark',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));
  await page.goto(`${base}/__spatial_benchmark`);
  const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');
  const before=(await cdp.send('Performance.getMetrics')).metrics;
  const result=await page.evaluate(async({preference,base})=>{
   const {createSpatialEngine}=await import(`${base}/src/lib/spatialEngine.js`),{createCameraRig}=await import(`${base}/src/lib/cameraRig.js`),
    {createSpatialSceneController}=await import(`${base}/src/lib/sceneController.js`),{phase03Config,samplePhase03}=await import(`${base}/src/lib/narrativeScenes.js`);
   // Resolve Three through Vite, exactly as the engine's application consumer.
   const source=await fetch(`${base}/src/components/SpatialExperience.vue`).then(r=>r.text());
   const threeUrl=source.match(/import\(["']([^"']*\/three\.js[^"']*)["']\)/)?.[1];
   if(!threeUrl)throw Error('Vite Three import not found');const T=await import(threeUrl);
   const engine=createSpatialEngine(T,{narrative:true,phase03:true,powerPreference:preference});
   document.body.append(engine.renderer.domElement);engine.resize(1440,900);
   const rig=createCameraRig(T,engine.camera),controller=createSpatialSceneController(phase03Config.scenes,phase03Config.ranges),gl=engine.renderer.getContext();
   const debug=gl.getExtension('WEBGL_debug_renderer_info'),adapter=debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);
   const ext=gl.getExtension('EXT_disjoint_timer_query_webgl2'),queries=[],cpu=[],gpu=[];
   const render=engine.renderer.render.bind(engine.renderer);let count=0,updateStart=0;
   engine.renderer.render=(...args)=>{
    const query=ext?gl.createQuery():null;if(query)gl.beginQuery(ext.TIME_ELAPSED_EXT,query);
    render(...args);if(query){gl.endQuery(ext.TIME_ELAPSED_EXT);queries.push(query);}
    if(count>20)cpu.push(performance.now()-updateStart);
   };
   await new Promise(resolve=>engine.start((now,dt)=>{
    updateStart=performance.now();samplePhase03(controller,3+((count%120)/120)*4.2);const state=controller.getState();
    rig.setTransition(state.from,state.to,state.blend);rig.update(dt);engine.world.update(0,state);
    count++;if(count===181){engine.pause();resolve();}
   }));
   // Paused engine; bounded RAF polling collects available timer-query results.
   if(ext)for(let poll=0;poll<30;poll++){
    if(queries.every(q=>gl.getQueryParameter(q,gl.QUERY_RESULT_AVAILABLE)))break;
    await new Promise(resolve=>requestAnimationFrame(resolve));
   }
   const disjoint=ext?gl.getParameter(ext.GPU_DISJOINT_EXT):null;
   if(ext&&!disjoint)for(const q of queries)if(gl.getQueryParameter(q,gl.QUERY_RESULT_AVAILABLE))gpu.push(gl.getQueryParameter(q,gl.QUERY_RESULT)/1e6);
   for(const q of queries)gl.deleteQuery(q);
   const state=engine.getState(),actual=gl.getContextAttributes().powerPreference;
   engine.dispose();return {adapter,actual,timerQuery:!!ext,disjoint,cpuFrameMs:cpu,gpuFrameMs:gpu,...state};
  },{preference,base});
  await cdp.send('HeapProfiler.collectGarbage');const after=(await cdp.send('Performance.getMetrics')).metrics;
  samples.push({round,preference,result,before,after});console.log(`${preference} sample ${round+1}: ${result.adapter}`);await page.close();
 }
 await mkdir('docs/capturas/spatial-phase-03',{recursive:true});
 await writeFile('docs/capturas/spatial-phase-03/benchmark.json',JSON.stringify({viewport:{width:1440,height:900},samples,decision:'Retain low-power unless representative hardware establishes a repeatable GPU improvement >=10%. Headless/software rendering is not hardware evidence.'},null,2));
}finally{await browser.close();}
