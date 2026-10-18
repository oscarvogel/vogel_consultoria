import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const base = String.raw`\\notebook-oscar\programacion\vogel_consultoria\n8n-social-approval\generated\campana-marketing-pdf-2026-07`;
const groups = [
  ['instagram/carrusel-5-senales', 7],
  ['whatsapp', 3],
  ['facebook', 3],
];
const files = [];
for (const [folder] of groups) {
  const names = (await fs.readdir(path.join(base, folder))).filter((name) => name.endsWith('.png')).sort();
  files.push(...names.map((name) => path.join(base, folder, name)));
}

const tileW = 270;
const tileH = 360;
const columns = 4;
const rows = Math.ceil(files.length / columns);
const composites = [];
for (let i = 0; i < files.length; i += 1) {
  const input = await sharp(files[i]).resize(tileW - 12, tileH - 12, { fit: 'contain', background: '#06172a' }).png().toBuffer();
  composites.push({ input, left: (i % columns) * tileW + 6, top: Math.floor(i / columns) * tileH + 6 });
}
await sharp({ create: { width: columns * tileW, height: rows * tileH, channels: 3, background: '#06172a' } })
  .composite(composites)
  .jpeg({ quality: 88 })
  .toFile(path.join(base, 'contact-sheet-v2.jpg'));
console.log(`Contact sheet generated with ${files.length} assets`);
