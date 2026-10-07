import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

// Converts the generated card art in src/assets into card-sized WebP files and records them in provenance.
// These are illustrations (not captures): the project reader keeps the real screenshots.
const root = process.cwd();
const sources = {
  'an-asociados': 'src/assets/anasociados-card.png',
  indufor: 'src/assets/indufor-card.png',
  'forestal-paraguay': 'src/assets/forestal-paraguay-card.png',
  'forestal-garuhape': 'src/assets/forestal-garuhap-sistema.png', // the company website mock-up
  amitrac: 'src/assets/amitrac-card.png',
  h21: 'src/assets/H21-card.png',
  'municipalidad-garuhape': 'src/assets/garuhape-card.png',
  'servin-lgsm': 'src/assets/servin-card.png', // 3:1 logo plate, padded to a square below
  'caso-forestal': 'src/assets/forestal-garuhape-card.png', // "Sistema Registro de Producción"
};
const manifestPath = path.join(root, 'public/projects/provenance.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
manifest.generatedCardArt ||= [];
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');

// Wide plates get extra rows above and below, continuing their own edge, so both the 16:9 carousel
// crop and the 4:5 grid crop keep the whole logo.
async function loadSource(id, file) {
  const input = sharp(path.join(root, file));
  const meta = await input.metadata();
  if (meta.width / meta.height <= 1.5) return input.toBuffer();
  const side = meta.width;
  // 'copy' repeats the outermost pixel row, so the plate's own vignette continues without a seam.
  return sharp(path.join(root, file))
    .extend({ top: Math.floor((side - meta.height) / 2), bottom: Math.ceil((side - meta.height) / 2), extendWith: 'copy' })
    .toBuffer();
}

for (const [id, source] of Object.entries(sources)) {
  const buffer = await loadSource(id, source);
  const entries = [];
  for (const [name, width, quality] of [['art.webp', 1280, 76], ['art-800.webp', 640, 74]]) {
    const folder = path.join(root, 'public/projects', id);
    await fs.mkdir(folder, { recursive: true });
    const output = path.join(folder, name);
    await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(output);
    const data = await fs.readFile(output);
    const meta = await sharp(data).metadata();
    entries.push({ path: `/projects/${id}/${name}`, width: meta.width, height: meta.height, sha256: hash(data), source, kind: 'generated' });
    console.log(`${id.padEnd(24)} ${name.padEnd(13)} ${meta.width}x${meta.height} ${Math.round(data.length / 1024)} KB`);
  }
  const paths = new Set(entries.map(entry => entry.path));
  const project = manifest.projects.find(item => item.id === id);
  if (project) project.derived = [...project.derived.filter(item => !paths.has(item.path)), ...entries];
  else manifest.generatedCardArt = [...manifest.generatedCardArt.filter(item => !paths.has(item.path)), ...entries];
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
