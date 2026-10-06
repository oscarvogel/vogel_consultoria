import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import sharp from 'sharp';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out=join(tmpdir(),'vogel-paisaje-2026-10-04');await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chromium'});
try{
 const page=await browser.newPage({viewport:{width:1672,height:940}});
 page.on('pageerror',e=>console.log('PAGEERROR '+e.message));
 page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE '+m.text().slice(0,220));});
 await page.goto('http://127.0.0.1:5177/');
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForSelector('.landscape-live',{timeout:45000});
 await page.waitForTimeout(1000);
 await page.screenshot({path:join(out,'hero-spatial-gate.png')});
 const dataUrl=await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>resolve(document.querySelector('.landscape-canvas').toDataURL('image/png')))));
 const png=Buffer.from(dataUrl.split(',')[1],'base64');
 await mkdir('public/landscape',{recursive:true});
 await sharp(png).resize({width:1672}).webp({quality:85}).toFile('public/landscape/data-terrain.webp');
 await writeFile('public/landscape/provenance.json',JSON.stringify({origin:'Procedural Three.js terrain authored for Vogel. Static frame of src/lib/dataLandscape.js. No UI or text embedded.',reference:'Consultor\u00eda tecnol\u00f3gica sobre paisaje de datos.png, user-provided visual direction.',generatedAt:new Date().toISOString(),role:'Production fallback asset, not a QA screenshot.'},null,2)+'\n');
 console.log(JSON.stringify({out,canvas:await page.locator('canvas').count(),bounds:await page.locator('.landscape-canvas').boundingBox()}));
}finally{await browser.close();}
