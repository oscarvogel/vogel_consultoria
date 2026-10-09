// Fails when a project capture has a large blank band: the sign of a page photographed before its
// scroll-reveal sections appeared (what left AN Asociados half white). Run after the captures are derived.
//   node scripts/check-captures.mjs [folder-with-captures] [--limit=0.3]
// Default folder: public/projects (desktop.webp and mobile.webp of every project).
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const limit = Number((args.find(a => a.startsWith('--limit=')) || '--limit=0.3').split('=')[1]);
const target = args.find(a => !a.startsWith('--')) || 'public/projects';
const USEFUL_HEIGHT = 2600;   // what the reader actually shows
const FLAT = 2.5;             // a row whose pixels vary less than this (std. dev. of luminance) counts as flat

async function longestFlatRun(file) {
  const { data, info } = await sharp(file).resize({ width: 96 }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const scale = info.height / (await sharp(file).metadata()).height;       // thumbnail rows per source pixel
  const usable = Math.min(info.height, Math.round(USEFUL_HEIGHT * scale));
  let best = 0, current = 0, bestStart = 0, start = 0;
  for (let y = 0; y < usable; y++) {
    let sum = 0, sq = 0;
    for (let x = 0; x < info.width; x++) { const v = data[y * info.width + x]; sum += v; sq += v * v; }
    const mean = sum / info.width, std = Math.sqrt(Math.max(0, sq / info.width - mean * mean));
    if (std < FLAT) { if (!current) start = y; current++; if (current > best) { best = current; bestStart = start; } } else current = 0;
  }
  return { fraction: best / usable, fromPx: Math.round(bestStart / scale), lengthPx: Math.round(best / scale) };
}

async function collect(folder) {
  const out = [];
  for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) out.push(...await collect(full));
    else if (/(^|-)(desktop|mobile)\.(webp|jpg|png)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const files = (await collect(target)).sort();
let failed = 0;
for (const file of files) {
  const { fraction, fromPx, lengthPx } = await longestFlatRun(file);
  const bad = fraction > limit;
  if (bad) failed++;
  console.log(`${bad ? 'FAIL' : 'ok  '} ${path.relative(process.cwd(), file).replace(/\\/g, '/').padEnd(52)} banda lisa ${(fraction * 100).toFixed(0).padStart(3)} % (${lengthPx}px desde y=${fromPx})`);
}
console.log(`\n${files.length} capturas · ${failed} con una banda en blanco de más de ${Math.round(limit * 100)} %`);
process.exit(failed ? 1 : 0);
