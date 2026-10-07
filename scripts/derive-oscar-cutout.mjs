// Applies an alpha matte (scripts/oscar-matte.py) to the authorised portrait and writes transparent WebP cut-outs.
//   node scripts/derive-oscar-cutout.mjs <matte.png>
// Only the background is removed: facial features are untouched. The body leaves the photo through the bottom
// and right edges, so those edges are kept fully opaque instead of being feathered.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

const matteFile = process.argv[2];
if (!matteFile) { console.error('usage: node scripts/derive-oscar-cutout.mjs <matte.png>'); process.exit(1); }
const source = 'src/assets/oscar_vogel_imagen.png', out = 'src/assets/oscar';
const rgb = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = rgb.info;
const matte = await sharp(matteFile).greyscale().resize(width, height).raw().toBuffer();
// Keep the edge the body crosses fully solid, then soften only the free contour.
const edge = 6;
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  if (y >= height - edge || x >= width - edge) { const i = y * width + x; if (matte[i] > 128) matte[i] = 255; }
}
const softened = await sharp(matte, { raw: { width, height, channels: 1 } }).blur(0.7).linear(1.18, -22).extractChannel(0).raw().toBuffer();
const pixels = Buffer.alloc(width * height * 4);
let left = width, top = height;
for (let i = 0, p = 0; i < softened.length; i++, p += 4) {
  pixels[p] = rgb.data[i * 3]; pixels[p + 1] = rgb.data[i * 3 + 1]; pixels[p + 2] = rgb.data[i * 3 + 2]; pixels[p + 3] = softened[i];
  if (softened[i] > 8) { const x = i % width, y = (i / width) | 0; if (x < left) left = x; if (y < top) top = y; }
}
left = Math.max(0, left - 8); top = Math.max(0, top - 8);
const cropped = sharp(pixels, { raw: { width, height, channels: 4 } }).extract({ left, top, width: width - left, height: height - top });
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
const provenancePath = `${out}/provenance.json`;
const provenance = JSON.parse(await fs.readFile(provenancePath, 'utf8'));
provenance.cutout = {
  generator: 'scripts/oscar-matte.py + scripts/derive-oscar-cutout.mjs',
  derivation: 'Eliminación del fondo con un modelo de segmentación de retratos (alfa) y recorte al cuerpo. Facciones y color sin modificar. Recorte solicitado expresamente por el titular el 2026-10-07; la autorización original de la fotografía no lo contemplaba.',
  crop: { left, top, width: width - left, height: height - top },
  outputs: [],
};
// Files carry their real width; the largest is the cropped body at full resolution.
for (const target of [640, 720, width - left]) {
  const buffer = await cropped.clone().resize({ width: target, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 92, effort: 6 }).toBuffer();
  const meta = await sharp(buffer).metadata();
  const file = `${out}/oscar-cutout-${meta.width}.webp`;
  await fs.writeFile(file, buffer);
  provenance.cutout.outputs.push({ file, width: meta.width, height: meta.height, bytes: buffer.length, sha256: sha(buffer) });
  console.log(`${file} ${meta.width}x${meta.height} ${Math.round(buffer.length / 1024)} KB`);
}
await fs.writeFile(provenancePath, JSON.stringify(provenance, null, 2) + '\n');
