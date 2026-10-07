// Fails when the production build exceeds the agreed weight budgets. Run after `npm run build`.
//   node scripts/check-budgets.mjs [dist]
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {join} from 'node:path';
const dist=process.argv[2]||'dist';
const kb=n=>Math.round(n/1024);
const budgets={
  initialGzip:{limit:90*1024,label:'initial JS+CSS (gzip) before any lazy chunk'},
  largestImage:{limit:600*1024,label:'largest single image in dist/projects'},
  cover800:{limit:90*1024,label:'largest 800px cover'},
  projectsTotal:{limit:6*1024*1024,label:'all dist/projects images (captures + generated card art)'},
  preloadedFonts:{limit:100*1024,label:'fonts preloaded by index.html'},
};
const html=readFileSync(join(dist,'index.html'),'utf8');
const initial=[...html.matchAll(/(?:src|href)="\/assets\/([^"]+\.(?:js|css))"/g)].map(m=>m[1]);
const measured={initialGzip:initial.reduce((sum,f)=>sum+gzipSync(readFileSync(join(dist,'assets',f))).length,0)};
const images=[];
for(const id of readdirSync(join(dist,'projects'),{withFileTypes:true}).filter(e=>e.isDirectory()))for(const f of readdirSync(join(dist,'projects',id.name)))images.push({file:`${id.name}/${f}`,size:statSync(join(dist,'projects',id.name,f)).size});
measured.largestImage=Math.max(...images.map(i=>i.size));
measured.cover800=Math.max(...images.filter(i=>i.file.endsWith('cover-800.webp')).map(i=>i.size));
measured.projectsTotal=images.reduce((sum,i)=>sum+i.size,0);
measured.preloadedFonts=[...html.matchAll(/rel="preload"[^>]*href="(\/fonts\/[^"]+)"/g)].reduce((sum,m)=>sum+statSync(join(dist,m[1])).size,0);
let failed=0;
for(const [key,{limit,label}] of Object.entries(budgets)){const over=measured[key]>limit;if(over)failed++;console.log(`${over?'FAIL':'ok  '} ${label}: ${kb(measured[key])} KB / ${kb(limit)} KB`);}
if(failed){console.error(`${failed} budget(s) exceeded`);process.exit(1);}
