// Derives web-sized WebP portraits from the authorized original. No retouching: resize + encode only.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const input = 'src/assets/oscar_vogel_imagen.png', out = 'src/assets/oscar';
await mkdir(out, { recursive: true });
const source = await readFile(input);
const meta = await sharp(source).metadata();
const outputs = [];
for (const width of [480, 720, 1024]) {
  const file = `${out}/oscar-vogel-${width}.webp`;
  const buffer = await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toBuffer();
  await writeFile(file, buffer);
  outputs.push({ file, width, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex') });
}
await writeFile(`${out}/provenance.json`, JSON.stringify({
  origin: 'Fotografía real de Oscar Vogel, provista y autorizada por el titular para su publicación en el sitio.',
  original: { file: input, width: meta.width, height: meta.height, bytes: source.length, sha256: createHash('sha256').update(source).digest('hex') },
  derivation: 'Redimensionado y codificación WebP (calidad 82). Sin retoque, recorte ni modificación de facciones.',
  generator: 'scripts/derive-oscar-portrait.mjs',
  outputs,
}, null, 2) + '\n');
console.log(outputs.map(o => `${o.file} ${(o.bytes / 1024).toFixed(0)} KB`).join('\n'));
