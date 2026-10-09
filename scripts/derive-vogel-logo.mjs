// Vectorises the client's logo (src/assets/brand/vogel-logo-source.png, 1254x1254 on a solid navy background).
//   node scripts/derive-vogel-logo.mjs
// Every pixel is assigned to its nearest colour (background, white, blue, amber), so neighbouring shapes share their edge
// without a gap. Each colour layer is smoothed (upscaled and re-thresholded) and traced with potrace.
// Output (transparent background, meant for dark surfaces; the white parts are invisible on light ones):
//   src/assets/brand/vogel-simbolo.svg   C + V + the two nodes
//   src/assets/brand/vogel-lockup.svg    symbol + "VOGEL CONSULTORIA"
//   public/logo-vogel.svg                favicon: symbol on a rounded #020f1f square
//   public/logo-vogel.png / apple-touch-icon.png / og-image.png   rasters on #020f1f
import fs from 'node:fs/promises';
import sharp from 'sharp';
import potrace from 'potrace';

const SOURCE = 'src/assets/brand/vogel-logo-source.png';
const SCALE = 4;                    // smoothing factor before tracing
const INK = '#020f1f';
const trace = (buffer, params) => new Promise((resolve, reject) => potrace.trace(buffer, params, (error, svg) => error ? reject(error) : resolve(svg)));

const { data, info } = await sharp(SOURCE).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const px = (x, y) => { const i = (y * width + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };
const background = px(8, 8);

// Palette sampled from the artwork itself.
const sample = (x, y) => px(x, y);
const palette = {
  white: [255, 255, 255],
  blue: sample(790, 500),            // right stroke of the V
  amber: sample(765, 421),           // centre of the upper node
};
const classes = { bg: background, ...palette };
const hex = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
console.log('fondo', hex(background), '· azul', hex(palette.blue), '· ámbar', hex(palette.amber));

const labels = new Uint8Array(width * height);
const names = Object.keys(classes);
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const p = px(x, y);
  let best = 0, bestDistance = Infinity;
  names.forEach((name, index) => {
    const c = classes[name];
    const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
    if (d < bestDistance) { bestDistance = d; best = index; }
  });
  labels[y * width + x] = best;
}

// Content box (everything that is not background) and the symbol box (above the wordmark).
let box = { x1: width, y1: height, x2: 0, y2: 0 };
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (labels[y * width + x] !== 0) {
  box.x1 = Math.min(box.x1, x); box.y1 = Math.min(box.y1, y); box.x2 = Math.max(box.x2, x); box.y2 = Math.max(box.y2, y);
}
// The wordmark starts after the last empty band that follows the symbol.
const rowHasInk = y => { for (let x = box.x1; x <= box.x2; x++) if (labels[y * width + x] !== 0) return true; return false; };
let symbolBottom = box.y1; let gap = 0;
for (let y = box.y1; y <= box.y2; y++) { if (rowHasInk(y)) { if (gap > 20) break; symbolBottom = y; gap = 0; } else gap++; }
const symbolBox = { ...box, y2: symbolBottom };
for (const b of [symbolBox]) { // tighten x for the symbol
  let x1 = width, x2 = 0;
  for (let y = b.y1; y <= b.y2; y++) for (let x = 0; x < width; x++) if (labels[y * width + x] !== 0) { x1 = Math.min(x1, x); x2 = Math.max(x2, x); }
  b.x1 = x1; b.x2 = x2;
}
console.log('símbolo', JSON.stringify(symbolBox), '· completo', JSON.stringify(box));

async function layerPath(name, region, margin, blur) {
  const w = region.x2 - region.x1 + 1 + margin * 2, h = region.y2 - region.y1 + 1 + margin * 2;
  const mask = Buffer.alloc(w * h, 255);
  const index = names.indexOf(name);
  // Sub-parts that sit on top of another colour (the amber centre inside a white/blue ring) must also cut the ring below,
  // so the layer under them keeps the dot area filled: tracing "white" alone would leave a hole where the amber is.
  const cover = name === 'amber' ? [index] : name === 'bg' ? [] : [index, names.indexOf('amber')];
  for (let y = region.y1; y <= region.y2; y++) for (let x = region.x1; x <= region.x2; x++) {
    if (cover.includes(labels[y * width + x])) mask[(y - region.y1 + margin) * w + (x - region.x1 + margin)] = 0;
  }
  const smooth = await sharp(mask, { raw: { width: w, height: h, channels: 1 } })
    .resize(w * SCALE, h * SCALE, { kernel: 'lanczos3' }).blur(SCALE * blur).threshold(128).png().toBuffer();
  const svg = await trace(smooth, { turdSize: 40 * SCALE, optTolerance: 2, alphaMax: 1.0, turnPolicy: 'minority' });
  // Integer coordinates (a quarter of a source pixel) keep the file small without visible change.
  const d = (svg.match(/<path[^>]* d="([^"]+)"/)?.[1] || '').replace(/-?\d+\.\d+/g, n => String(Math.round(Number(n))));
  return { d, w: w * SCALE, h: h * SCALE };
}

async function build(region, { padding = 20, blur = 1.0 } = {}) {
  const layers = [];
  for (const name of ['white', 'blue', 'amber']) layers.push([name, await layerPath(name, region, padding, blur)]);
  const { w, h } = layers[0][1];
  // Paths are in 4x pixels: scale back so 1 unit = 1 source pixel, then shift by the margin.
  const body = layers.map(([name, { d }]) => `<path fill="${hex(palette[name])}" fill-rule="evenodd" d="${d}"/>`).join('');
  const viewBox = `0 0 ${w} ${h}`;
  return { body, viewBox, w: w / SCALE, h: h / SCALE };
}

const symbol = await build(symbolBox);
// The wordmark has tiny counters (the O's): a light blur keeps them open. Tracing the symbol and the text separately lets
// each use the smoothing it needs; both share the same 20px margin so they can be placed by their source coordinates.
const textBox = { x1: box.x1, x2: box.x2, y1: symbolBottom + 1, y2: box.y2 };
for (let y = textBox.y1; y <= textBox.y2 && !rowHasInk(y); y++) textBox.y1 = y + 1;
const text = await build(textBox, { blur: 0.3 });
const lockupBase = await build(box, { blur: 1.0 });
const place = (region, part) => `<g transform="translate(${(region.x1 - box.x1) * SCALE} ${(region.y1 - box.y1) * SCALE})">${part.body}</g>`;
const lockup = { ...lockupBase, body: place(symbolBox, symbol) + place(textBox, text) };
const wrap = ({ body, viewBox, w, h }, label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w)}" height="${Math.round(h)}" viewBox="${viewBox}" role="img" aria-label="${label}">${body}</svg>\n`;
await fs.writeFile('src/assets/brand/vogel-simbolo.svg', wrap(symbol, 'Vogel Consultoría'));
await fs.writeFile('src/assets/brand/vogel-lockup.svg', wrap(lockup, 'Vogel Consultoría'));

// Favicon: symbol centred on a rounded ink square so the white strokes stay visible on light browser tabs.
const [, , sw, sh] = symbol.viewBox.split(' ').map(Number);
const side = Math.max(sw, sh) * 1.5;
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}"><rect width="${side}" height="${side}" rx="${side * 0.18}" fill="${INK}"/><g transform="translate(${(side - sw) / 2} ${(side - sh) / 2})">${symbol.body}</g></svg>\n`;
await fs.writeFile('public/logo-vogel.svg', favicon);

// Rasters on the ink colour.
const rasterize = async (svgText, size, file, { pad = 0.12, width: w2, height: h2 } = {}) => {
  const target = { width: w2 || size, height: h2 || size };
  const inner = await sharp(Buffer.from(svgText), { density: 300 }).resize({ width: Math.round(target.width * (1 - pad * 2)), height: Math.round(target.height * (1 - pad * 2)), fit: 'inside' }).png().toBuffer();
  await sharp({ create: { ...target, channels: 4, background: INK } }).composite([{ input: inner, gravity: 'center' }]).png({ compressionLevel: 9 }).toFile(file);
};
await rasterize(wrap(symbol, ''), 512, 'public/logo-vogel.png', { pad: 0.16 });
await rasterize(wrap(symbol, ''), 180, 'public/apple-touch-icon.png', { pad: 0.2 });
await rasterize(wrap(lockup, ''), 0, 'public/og-image.png', { width: 1200, height: 630, pad: 0.2 });
console.log('listo: símbolo, lockup, favicon y rasters');
