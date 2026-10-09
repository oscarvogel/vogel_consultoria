// Release gate: runs every check against a fresh production build and records the evidence.
//   npm run release:gate            (writes docs/capturas/release-<date>/results.json and screenshots)
// Stops at the first failure. Never commits, pushes or deploys.
import {spawn,spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
const date=process.env.RELEASE_DATE||new Date().toISOString().slice(0,10);
const captureDir=path.join('docs','capturas',`release-${date}`);
await fs.mkdir(captureDir,{recursive:true});
const results=[];
const count=(output,pattern)=>(output.match(pattern)||[]).length;
function step(name,command,{env={},ok}={}){
  const started=Date.now();
  const run=spawnSync(command,{shell:true,encoding:'utf8',env:{...process.env,...env},maxBuffer:64*1024*1024});
  const output=`${run.stdout||''}${run.stderr||''}`;
  const entry={name,command,exitCode:run.status,seconds:Math.round((Date.now()-started)/100)/10,checks:ok?ok(output):undefined};
  results.push(entry);
  console.log(`${run.status===0?'ok  ':'FAIL'} ${name}${entry.checks!==undefined?` (${entry.checks} checks)`:''} — ${entry.seconds}s`);
  if(run.status!==0){console.error(output.split('\n').slice(-25).join('\n'));return false;}
  return true;
}
const freePort=()=>new Promise((resolve,reject)=>{const server=net.createServer();server.listen(0,'127.0.0.1',()=>{const {port}=server.address();server.close(()=>resolve(port));});server.on('error',reject);});
async function waitFor(url){for(let i=0;i<60;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,500));}throw new Error(`preview server did not answer at ${url}`);}
const versions={node:process.version,vite:JSON.parse(await fs.readFile('node_modules/vite/package.json','utf8')).version};
let preview;let passed=false;
try{
  const static_=[
    ['build','npm run build'],
    ['unit and contract tests','npm test'],
    ['contrast tokens','npm run test:contrast'],
    ['build integrity and image hashes','node scripts/verify-portfolio-build.mjs',{}],
    ['weight budgets','npm run test:budgets',{ok:o=>count(o,/^ok /gm)}],
    ['project captures have no blank bands','node scripts/check-captures.mjs',{ok:o=>count(o,/^ok /gm)}],
    ['production dependency audit','npm audit --omit=dev --audit-level=high'],
  ];
  passed=true;
  const port=await freePort();const url=`http://127.0.0.1:${port}`;
  for(const [name,command,options] of static_){
    if(name==='build integrity and image hashes'){
      // verify-portfolio-build fetches the built routes, so it needs the preview server.
      preview=spawn(`npx vite preview --port ${port} --strictPort --host 127.0.0.1`,{shell:true,stdio:'ignore'});
      await waitFor(url+'/');
      if(!step(name,command,{env:{PORTFOLIO_TEST_URL:url}})){passed=false;break;}
      continue;
    }
    if(!step(name,command,options)){passed=false;break;}
  }
  if(passed){
    const env={PORTFOLIO_TEST_URL:url,CAPTURE_DIR:captureDir};
    const browser=[
      ['browser journeys, viewports, reduced motion, forms','npm run test:portfolio',{env,ok:o=>count(o,/^ok - /gm)}],
      ['axe accessibility (8 routes × 3 viewports)','npm run test:a11y',{env,ok:o=>count(o,/violations=0/g)}],
      ['motion stress and shared-image continuity','npm run test:motion',{env,ok:o=>count(o,/^ok - /gm)}],
      ['view transitions (no cuts, portrait stays in the viewport)','npm run test:transitions',{env,ok:o=>count(o,/^ok - /gm)}],
      ['site crawl (console, images, links, h1)','npm run test:crawl',{env,ok:o=>count(o,/^ok - /gm)}],
    ];
    for(const [name,command,options] of browser){if(!step(name,command,options)){passed=false;break;}}
  }
}finally{
  if(preview?.pid)spawnSync(`taskkill /pid ${preview.pid} /T /F`,{shell:true,stdio:'ignore'});
}
await fs.writeFile(path.join(captureDir,'results.json'),JSON.stringify({date,passed,versions,steps:results},null,2)+'\n');
console.log(`\n${passed?'RELEASE GATE PASSED':'RELEASE GATE FAILED'} — evidence in ${captureDir}/results.json`);
process.exit(passed?0:1);
