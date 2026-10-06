import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'chromium'}),page=await browser.newPage({viewport:{width:1440,height:900}});
page.on('pageerror',e=>console.log('ERROR',e.message));page.on('console',m=>{if(m.type()==='error')console.log(m.text());});
await page.goto('http://127.0.0.1:5192');await page.waitForSelector('.narrative-live');await page.evaluate(()=>document.fonts.ready);
await mkdir('docs/capturas/spatial-phase-02',{recursive:true});
for(const [name,p] of [['intro',0],['entry',.3],['complexity',.5],['mid-transform',.735],['systems',.95],['services',1.2]]){
 await page.evaluate(p=>scrollTo(0,(document.querySelector('.narrative-arc').offsetHeight-innerHeight)*p),p);await page.waitForTimeout(400);
 console.log('capture:',name);
 await page.screenshot({path:`docs/capturas/spatial-phase-02/${name}.png`});
 if(['complexity','systems'].includes(name)){
  const data=await page.evaluate(()=>document.querySelector('canvas').__vogelSpatial.snapshot({poster:true}));
  await writeFile(`public/landscape/${name}.webp.json`,JSON.stringify({prompt:`ORIGIN: Original procedural Vogel Three.js world, ${name}, progress ${p}, frozen uTime=0, static camera [9,14,8] toward [0,1,-22], cluster exposure 2.2. No external or AI imagery.`,generator:'scripts/capture-phase02.mjs',createdAt:new Date().toISOString()},null,2)+'\n');
  const sharp=require('sharp');await sharp(Buffer.from(data.split(',')[1],'base64')).flatten({background:'#05090f'}).webp({quality:84}).toFile(`public/landscape/${name}.webp`);
 }
}
await browser.close();
