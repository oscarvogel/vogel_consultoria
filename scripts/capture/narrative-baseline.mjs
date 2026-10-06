import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const output = 'docs/capturas/coreografia-2026-10-03/before';
let exists=false;
try {await access('docs/coreografia-linea-base-2026-10-03.md');exists=true;}catch{}
if(exists)throw new Error('La línea base ya existe. No se sobrescribe; usar una fecha nueva para otro registro.');
await mkdir(output, { recursive: true });
const files = ['src/components/HeroSection.vue','src/components/ProblemsSection.vue','src/components/ServicesSection.vue','src/composables/useSiteMotion.js','src/components/ui/waves-shader.tsx','src/components/Navbar.vue'];
const hashes = await Promise.all(files.map(async file => ({file,sha256:createHash('sha256').update(await readFile(file)).digest('hex')})));
await writeFile('docs/coreografia-linea-base-2026-10-03.md', '# Línea base de la coreografía\n\nEstado previo a esta implementación, incluyendo el desvanecimiento bajo la navbar.\n\nCapturas en `capturas/coreografia-2026-10-03/before/`, con movimiento reducido para registrar el contenido completo. No prueban tiempos de animación.\n\n'+hashes.map(h=>`- ${h.file}: \`${h.sha256}\``).join('\n')+'\n');
const browser = await chromium.launch({headless:true});
try {
 for (const viewport of [{width:1440,height:1000},{width:1199,height:900},{width:390,height:844}]) {
  const page = await browser.newPage({viewport,reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:5177/',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(600);
  for (const id of ['inicio','soluciones','casos','servicios']) {
   await page.locator('#'+id).evaluate(el=>el.scrollIntoView({behavior:'instant'}));
   await page.waitForTimeout(200);
   await page.screenshot({path:`${output}/${viewport.width}-${id}.png`});
  }
  await page.close();
 }
} finally { await browser.close(); }
console.log('baseline captured');
