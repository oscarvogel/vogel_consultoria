import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require('playwright');}catch{playwright=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const axeSource=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const base=process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:5198';
const routes=['/','/soluciones/','/recursos/','/estudio/','/contacto/','/proyectos/caso-forestal/','/proyectos/an-asociados/','/recursos/cuando-conviene-sistema-a-medida/'];
const viewports=[[1440,900],[390,844],[320,640]];
const tags=['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'];
const browser=await playwright.chromium.launch({headless:true});
let violations=0;const report=[];
for(const [width,height] of viewports){
 const mobile=width<768;const context=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile});
 await context.addInitScript(()=>sessionStorage.setItem('vogel-intro','1'));
 const page=await context.newPage();
 for(const route of routes){
  await page.goto(base+route);await page.waitForTimeout(1200);
  await page.evaluate(axeSource);
  const result=await page.evaluate(tags=>axe.run(document,{runOnly:{type:'tag',values:tags}}),tags);
  for(const v of result.violations){violations++;report.push({viewport:`${width}x${height}`,route,id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.slice(0,3).map(n=>n.target.join(' ')+' :: '+(n.any[0]?.message||n.all[0]?.message||n.none[0]?.message||''))});}
  console.log(`${width}x${height} ${route} violations=${result.violations.length} incomplete=${result.incomplete.length}`);
 }
 await context.close();
}
await browser.close();
console.log(JSON.stringify(report,null,1));
if(violations){console.error(`axe: ${violations} violation(s)`);process.exit(1);}
