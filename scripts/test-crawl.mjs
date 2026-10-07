// Visits every public route in a real browser and fails on console/page errors, broken images,
// internal links that do not resolve, or a missing <h1>. External links are listed, never requested.
//   PORTFOLIO_TEST_URL=http://127.0.0.1:5205 node scripts/test-crawl.mjs
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require('playwright');}catch{playwright=require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const base=process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:5205';
const routes=[...fs.readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>https:\/\/vogelconsultoria\.com\.ar([^<]*)<\/loc>/g)].map(m=>m[1]);
for(const id of Object.keys(JSON.parse(fs.readFileSync('src/data/projectSummaries.json','utf8'))))routes.push(`/proyectos/${id}/`);
routes.push('/info/','/ia.html');
const browser=await playwright.chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:900}});await context.addInitScript(()=>sessionStorage.setItem('vogel-intro','1'));
const page=await context.newPage();
const problems=[];const internal=new Set();const external=new Set();
// Third-party and analytics hosts are out of scope here; failures from our own origin are not.
const own=url=>url.startsWith(base);
let current='';
page.on('pageerror',e=>problems.push(`${current}: pageerror ${e.message}`));
page.on('console',m=>{if(m.type()==='error'&&!/google|gtag|web3forms/i.test(m.text()+(m.location().url||'')))problems.push(`${current}: console ${m.text().slice(0,140)}`)});
page.on('response',r=>{if(own(r.url())&&r.status()>=400)problems.push(`${current}: HTTP ${r.status()} ${r.url().replace(base,'')}`)});
for(const route of [...new Set(routes)]){
 current=route;const response=await page.goto(base+route,{waitUntil:'load'});await page.waitForTimeout(900);
 if(!response||response.status()>=400)problems.push(`${route}: HTTP ${response?.status()}`);
 await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}scrollTo(0,0);});await page.waitForTimeout(700);
 const found=await page.evaluate(()=>({h1:[...document.querySelectorAll('h1')].filter(h=>h.checkVisibility()).length,broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.currentSrc).map(i=>i.currentSrc),links:[...document.querySelectorAll('a[href]')].map(a=>a.href)}));
 if(found.h1!==1)problems.push(`${route}: ${found.h1} <h1> elements`);
 for(const src of found.broken)problems.push(`${route}: broken image ${src.replace(base,'')}`);
 for(const href of found.links){if(href.startsWith(base)){const url=new URL(href);internal.add(url.pathname)}else if(/^https?:/.test(href))external.add(new URL(href).origin);}
}
for(const link of internal){const r=await context.request.get(base+link);if(r.status()>=400)problems.push(`internal link ${link} -> HTTP ${r.status()}`);}
await browser.close();
console.log(`${new Set(routes).size} routes, ${internal.size} internal link targets, ${external.size} external origins (not requested)`);
if(problems.length){for(const p of [...new Set(problems)])console.error('FAIL '+p);process.exit(1);}
console.log('ok - no console errors, broken images, dead internal links or missing h1');
