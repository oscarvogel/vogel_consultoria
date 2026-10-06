import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.PHASE03_URL||'http://127.0.0.1:5194';
const browser=await chromium.launch({headless:true,channel:'chromium'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 page.on('pageerror',e=>{throw e;});page.on('console',m=>{if(m.type()==='error'&&/Shader Error/.test(m.text()))throw Error(m.text());});
 await page.goto(base);await page.waitForSelector('.narrative-live');await page.evaluate(()=>document.fonts.ready);
 await mkdir('docs/capturas/spatial-phase-03',{recursive:true});
 for(const [name,offset] of [['automation',4.05],['data',5.15],['intelligence',5.65],['decision',7.05]]){
  await page.evaluate(offset=>scrollTo({top:document.querySelector('.narrative-arc').offsetHeight/8*offset,behavior:'instant'}),offset);
  await page.waitForTimeout(250);
  const state=await page.evaluate(()=>document.querySelector('canvas').__vogelSpatial.getState());
  if(state.phase!==3)throw Error('Phase 3 is not enabled');
  const data=await page.evaluate(()=>document.querySelector('canvas').__vogelSpatial.snapshot({poster:true}));
  await sharp(Buffer.from(data.split(',')[1],'base64')).extract({left:220,top:150,width:1000,height:625}).resize(1440,900).flatten({background:'#05090f'}).webp({quality:86}).toFile(`public/landscape/${name}.webp`);
  await writeFile(`public/landscape/${name}.webp.json`,JSON.stringify({
   prompt:`ORIGIN: Original Vogel procedural WebGL world; ${name}; offset ${offset} viewport units, frozen uTime=0 and neutral pointer; poster camera [12,14,3] toward [0,1,-28]; cluster exposure 1.2; crop [220,150,1000,625] resized to 1440x900 for editorial reading. No external or AI imagery.`,
   generator:'scripts/capture-phase03.mjs',state:{flow:state.flow,data:state.data,intelligence:state.intelligence,clarity:state.clarity,convergence:state.convergence,pulsePhase:state.pulsePhase,selectionPhase:state.selectionPhase},createdAt:new Date().toISOString(),
  },null,2)+'\n');
  await page.screenshot({path:`docs/capturas/spatial-phase-03/${name}-capture.png`});console.log(`poster: ${name}`);
 }
}finally{await browser.close();}
