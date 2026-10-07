// Visual QA for the spatial narrative: one frame per chapter, side-by-side with the
// reference landscape, plus luminance/amber metrics. Usage:
//   node scripts/capture-visual-overhaul.mjs [label]   (VISUAL_URL defaults to the Phase 04 dev server)
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import sharp from 'sharp';
const require=createRequire(import.meta.url);let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.VISUAL_URL||'http://127.0.0.1:5196',label=process.argv[2]||'current';
const out=resolve('docs/capturas/visual-overhaul',label);
const reference=resolve('Consultoría tecnológica sobre paisaje de datos.png');
// ONLY=01,05 limits chapters; WIDTHS=1440 limits viewports (fast iteration).
const only=process.env.ONLY?.split(',');
const chapters=[['01-intro',0],['02-complexity',1.8],['03-systems',2.85],['04-automation',3.9],['05-data',5.05],['06-intelligence',6],['07-decision',7],['08-portal',7.6],['09-registrar',8.15],['10-revisar',9.1],['11-dashboard',9.9]]
  .filter(([name])=>!only||only.some(prefix=>name.startsWith(prefix)));
const widths=process.env.WIDTHS?.split(',').map(Number);
await mkdir(out,{recursive:true});
async function metrics(buffer){
  const {data,info}=await sharp(buffer).removeAlpha().raw().toBuffer({resolveWithObject:true});
  let sum=0,amber=0,max=0;
  for(let i=0;i<data.length;i+=3){const r=data[i],g=data[i+1],b=data[i+2],l=.2126*r+.7152*g+.0722*b;sum+=l;if(l>max)max=l;if(r>150&&r>b*1.6&&g>r*.45)amber++;}
  const n=info.width*info.height;return {meanLuminance:+(sum/n).toFixed(2),amberPercent:+(amber/n*100).toFixed(2),maxLuminance:Math.round(max)};
}
const browser=await chromium.launch({headless:true,channel:'chromium',args:['--use-angle=default','--ignore-gpu-blocklist']});
const report={base,label,viewports:{}};
try{
  for(const viewport of [{width:1440,height:900},{width:1672,height:941}].filter(v=>!widths||widths.includes(v.width))){
    const page=await browser.newPage({viewport});
    page.on('pageerror',e=>console.error('pageerror',e.message));
    page.on('console',m=>{if(m.type()==='error'||/Shader|WebGL/.test(m.text()))console.error('console',m.text().slice(0,1500));});
    await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.waitForSelector('.narrative-live',{timeout:30000});
    const height=await page.evaluate(()=>{const s=document.querySelector('canvas').__vogelSpatial.getState();return s.phase===4?10.8:s.phase===3?8:3;});
    const key=`${viewport.width}x${viewport.height}`;report.viewports[key]={};
    for(const [name,offset] of chapters){
      await page.evaluate(([offset,height])=>{const arc=document.querySelector('.narrative-arc');scrollTo({top:arc.getBoundingClientRect().top+scrollY+arc.offsetHeight/height*offset,behavior:'instant'});},[offset,height]);
      await page.waitForTimeout(900);
      const shot=await page.screenshot();
      const file=resolve(out,`${name}-${key}.png`);await writeFile(file,shot);
      report.viewports[key][name]={offset,...await metrics(shot),state:await page.evaluate(()=>{const s=document.querySelector('canvas').__vogelSpatial.getState();return {calls:s.calls,tier:s.tier,dpr:s.dpr,frames:s.frames,running:s.running};})};
      if(name==='01-intro'&&viewport.width===1672){
        const ref=await sharp(reference).resize(viewport.width,viewport.height,{fit:'cover'}).png().toBuffer();
        await sharp({create:{width:viewport.width*2,height:viewport.height,channels:3,background:'#05090f'}})
          .composite([{input:shot,left:0,top:0},{input:ref,left:viewport.width,top:0}]).png().toFile(resolve(out,'intro-vs-reference.png'));
        report.reference=await metrics(ref);
      }
    }
    await page.close();
  }
  await writeFile(resolve(out,'metrics.json'),JSON.stringify(report,null,2));
  for(const [key,rows] of Object.entries(report.viewports))for(const [name,r] of Object.entries(rows))console.log(key,name,r.meanLuminance,r.amberPercent,JSON.stringify(r.state));console.log('reference',report.reference,'\n→',out);
}finally{await browser.close();}
