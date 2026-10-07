import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

// Adds an 800px cover next to each cover.webp so cards on narrow screens do not download the 1600px file.
// Idempotent: it replaces its own provenance entry and leaves capturedAt and every other derivative untouched.
const root = process.cwd();
const manifestPath = path.join(root, 'public/projects/provenance.json');
const mediaPath = path.join(root, 'src/data/projectMedia.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const media = JSON.parse(await fs.readFile(mediaPath, 'utf8'));
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
let total = 0;
for (const project of manifest.projects) {
  const full = project.derived.find(item => item.path === `/projects/${project.id}/cover.webp`);
  if (!full) continue;
  const output = path.join(root, 'public/projects', project.id, 'cover-800.webp');
  await sharp(path.join(root, 'public', full.path)).resize(800, 450, { fit: 'cover' }).webp({ quality: 82 }).toFile(output);
  const data = await fs.readFile(output);
  total += data.length;
  const entry = { path: `/projects/${project.id}/cover-800.webp`, width: 800, height: 450, sha256: hash(data), source: full.source, derivedFrom: full.path, crop: full.crop };
  project.derived = [...project.derived.filter(item => item.path !== entry.path), entry];
  media[project.id]['cover-800'] = { width: 800, height: 450 };
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
await fs.writeFile(mediaPath, JSON.stringify(media, null, 2) + '\n');
console.log(`Derived ${manifest.projects.length} 800px covers (${total} bytes).`);
