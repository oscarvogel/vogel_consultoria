import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='src/assets/cases',report=[];
for(const name of ['campo','revision','dashboard','dashboard-desktop']){
  const input=`${root}/forestal-${name}.png`,output=`${root}/forestal-${name}.webp`;
  const png=await readFile(input),webp=await sharp(png).webp({lossless:true,effort:6}).toBuffer();
  const a=await sharp(png).ensureAlpha().raw().toBuffer(),b=await sharp(webp).ensureAlpha().raw().toBuffer();
  if(!a.equals(b))throw new Error('Pixel mismatch: '+name);
  await writeFile(output,webp);
  report.push({original:input,derived:output,sha256:createHash('sha256').update(png).digest('hex'),pngBytes:png.length,webpBytes:webp.length,pixelIdentical:true,serve:webp.length<png.length});
}
await writeFile(`${root}/derived-provenance.json`,JSON.stringify({script:'node scripts/derive-forest-case.mjs',encoding:'lossless WebP',sourceProvenance:'provenance.json',images:report},null,2)+'\n');
console.log(JSON.stringify(report,null,2));
