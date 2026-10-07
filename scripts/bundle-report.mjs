// Prints initial-load JS/CSS (what index.html pulls before any lazy chunk) and the lazy chunks, raw and gzip.
//   node scripts/bundle-report.mjs [dist]
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {join} from 'node:path';
const dist=process.argv[2]||'dist',assets=join(dist,'assets');
const html=readFileSync(join(dist,'index.html'),'utf8');
const initial=new Set([...html.matchAll(/(?:src|href)="\/assets\/([^"]+\.(?:js|css))"/g)].map(m=>m[1]));
const rows=readdirSync(assets).filter(f=>/\.(js|css)$/.test(f)).map(f=>{const b=readFileSync(join(assets,f));return {file:f,raw:b.length,gzip:gzipSync(b).length,initial:initial.has(f)};});
const kb=n=>(n/1024).toFixed(1).padStart(8)+' KB';
let init={raw:0,gzip:0};
for(const r of rows.sort((a,b)=>b.initial-a.initial||b.raw-a.raw)){if(r.initial){init.raw+=r.raw;init.gzip+=r.gzip;}console.log(`${r.initial?'initial':'lazy   '} ${kb(r.raw)} ${kb(r.gzip)} gz  ${r.file}`);}
console.log(`\nINITIAL TOTAL ${kb(init.raw)} ${kb(init.gzip)} gz`);
const images=readdirSync(assets).filter(f=>/\.(webp|png|jpg|svg|woff2)$/.test(f));
console.log(`other assets: ${images.length}, ${kb(images.reduce((s,f)=>s+statSync(join(assets,f)).size,0))}`);
