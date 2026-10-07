import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Picks one accent per project from its card art (or capture) and normalises it to a dark tone,
// so cream text keeps its contrast where the backdrop gradient is most saturated.
// Writes src/data/projectColors.json; edit that file by hand to override a value.
const root = process.cwd();
const summaries = JSON.parse(await fs.readFile(path.join(root, 'src/data/projectSummaries.json'), 'utf8'));
const sourceFor = async id => {
  for (const file of [`public/projects/${id}/art.webp`, `public/projects/${id}/cover.webp`]) {
    try { await fs.access(path.join(root, file)); return file; } catch { /* next */ }
  }
  return 'src/assets/cases/forestal-dashboard-desktop.webp';
};
// Brand colour read from each client logo (public/clients/*.svg, src/assets/*.svg). It wins over the image:
// card art often has sunsets or smoke that are not the company colour. Amitrac has no colour logo: its card sign is used.
const brand = {
  'an-asociados': '#556439', indufor: '#218F52', 'forestal-paraguay': '#008E2E', 'forestal-garuhape': '#008D2E',
  'servin-lgsm': '#45B8DF', 'caso-forestal': '#008D2E', h21: '#636E79', 'municipalidad-garuhape': '#0C6F37',
};
// Optional hue window per project, used when the user fixed the family (Amitrac stays blue).
const hueWindow = { amitrac: [195, 250] };
const toHsl = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
};
const toHex = (h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
};
const colors = {};
for (const id of Object.keys(summaries)) {
  if (brand[id]) {
    const hex = brand[id].replace('#', '');
    const [hue, saturation] = toHsl([0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)));
    colors[id] = toHex(hue, Math.min(0.62, Math.max(0.18, saturation)), 0.3);
    console.log(`${id.padEnd(24)} ${colors[id]}  hue ${Math.round(hue)}°  from logo ${brand[id]}`);
    continue;
  }
  const file = await sourceFor(id);
  const { data, info } = await sharp(path.join(root, file)).resize(48, 48, { fit: 'cover' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const bins = Array.from({ length: 24 }, () => ({ weight: 0, h: 0, s: 0 }));
  for (let i = 0; i < data.length; i += info.channels) {
    const [h, s, l] = toHsl([data[i], data[i + 1], data[i + 2]]);
    const window = hueWindow[id];
    if (window && (h < window[0] || h > window[1])) continue;
    const weight = s * (1 - Math.abs(l - 0.45) * 1.6);
    if (weight <= 0.05) continue;
    const bin = bins[Math.floor(h / 15)];
    bin.weight += weight; bin.h += h * weight; bin.s += s * weight;
  }
  const best = bins.sort((a, b) => b.weight - a.weight)[0];
  const hue = best.weight ? best.h / best.weight : 40;
  const saturation = Math.min(0.62, Math.max(0.32, best.weight ? best.s / best.weight : 0.3));
  colors[id] = toHex(hue, saturation, 0.3);
  console.log(`${id.padEnd(24)} ${colors[id]}  hue ${Math.round(hue)}°  from ${file}`);
}
await fs.writeFile(path.join(root, 'src/data/projectColors.json'), JSON.stringify(colors, null, 2) + '\n');
