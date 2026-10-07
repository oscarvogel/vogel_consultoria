// Builds one contact sheet per viewport from the PNG screenshots of a capture directory.
//   node scripts/contact-sheet.mjs docs/capturas/release-2026-10-07
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
const dir=process.argv[2];
if(!dir){console.error('usage: node scripts/contact-sheet.mjs <capture-dir>');process.exit(1);}
const files=(await fs.readdir(dir)).filter(f=>f.endsWith('.png')&&!f.startsWith('sheet-'));
const groups=new Map();
for(const file of files){const size=file.match(/(\d{3,4}x\d{3,4})\.png$/)?.[1]||'other';groups.set(size,[...(groups.get(size)||[]),file]);}
const width=360,height=270,label=26,columns=4;
for(const [size,names] of groups){
  const tiles=await Promise.all(names.sort().map(async(name,index)=>{
    const image=await sharp(path.join(dir,name)).resize(width,height-label,{fit:'contain',background:'#2a2a2a'}).png().toBuffer();
    const text=Buffer.from(`<svg width="${width}" height="${label}"><rect width="100%" height="100%" fill="#eee"/><text x="8" y="18" font-size="12" font-family="Arial" fill="#111">${name.replace(/&/g,'&amp;')}</text></svg>`);
    const tile=await sharp(image).extend({bottom:label,background:'#eee'}).composite([{input:text,top:height-label,left:0}]).png().toBuffer();
    return {input:tile,left:(index%columns)*width,top:Math.floor(index/columns)*height};
  }));
  const out=path.join(dir,`sheet-${size}.png`);
  await sharp({create:{width:width*columns,height:Math.ceil(names.length/columns)*height,channels:3,background:'#444'}}).composite(tiles).png().toFile(out);
  console.log(`${out} (${names.length} screenshots)`);
}
