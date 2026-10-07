// Generates public/landscape/closing-ordered.webp: the ordered world as a still for the closing
// conversation section, so the second half of the page does no GPU work.
//   node scripts/capture-closing-poster.mjs [beat=2.85] [--preview]    (needs a dev server: VITE_SPATIAL_PHASE_05=true)
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.PHASE05_URL||'http://127.0.0.1:5198',beat=Number(process.argv[2]&&!process.argv[2].startsWith('--')?process.argv[2]:2.85),preview=process.argv.includes('--preview');
const width=1672,height=660;
const browser=await chromium.launch({headless:true,channel:'chromium'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 page.on('pageerror',e=>{throw e;});
 await page.goto(base);await page.waitForSelector('.narrative-live');await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(([beat,units])=>{const arc=document.querySelector('.narrative-arc');scrollTo({top:arc.getBoundingClientRect().top+scrollY+arc.offsetHeight/units*beat,behavior:'instant'});},[beat,10.8]);
 await page.waitForTimeout(900);
 const data=await page.evaluate(()=>document.querySelector('canvas').__vogelSpatial.snapshot({poster:true}));
 const png=Buffer.from(data.split(',')[1],'base64');
 // The world sits in the upper-middle of the poster frame; crop to the closing band and soften it into navy.
 const crop=await sharp(png).extract({left:60,top:170,width:1320,height:Math.round(1320*height/width)}).resize(width,height).modulate({brightness:.92}).toBuffer();
 const out=preview?'docs/capturas/spatial-phase-05/closing-poster-preview.png':'public/landscape/closing-ordered.webp';
 await mkdir(preview?'docs/capturas/spatial-phase-05':'public/landscape',{recursive:true});
 if(preview)await sharp(crop).toFile(out);else{
  await sharp(crop).webp({quality:82}).toFile(out);
  await writeFile('public/landscape/closing-ordered.webp.json',JSON.stringify({
   origin:'Original Vogel procedural WebGL world, ordered state (systems), frozen uTime=0 and neutral pointer. No external or AI imagery.',
   generator:'scripts/capture-closing-poster.mjs',beat,createdAt:new Date().toISOString(),
  },null,2)+'\n');
 }
 console.log(out);
}finally{await browser.close();}
