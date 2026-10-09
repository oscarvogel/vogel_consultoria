import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = process.cwd();
const source = 'docs/capturas/project-sources-2026-10-09/pyfe-desktop-demo.png';
const sourceUrl = 'https://github.com/oscarvogel/pyfe/blob/fbcdca32b44e44927dbbba1c0979f3fcc085085a/tools/armar_sandbox.py';
const commit = 'fbcdca32b44e44927dbbba1c0979f3fcc085085a';
const capture = path.join(root, source);
const output = path.join(root, 'public/projects/pyfe');
await fs.mkdir(output, { recursive: true });
const input = await fs.readFile(capture);
const meta = await sharp(input).metadata();
if (meta.width !== 1600 || meta.height !== 900) throw new Error(`Unexpected capture size ${meta.width}x${meta.height}`);
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const entries = [];
const record = async (name, width, height, method, data) => {
  const file = path.join(output, name);
  await fs.writeFile(file, data);
  entries.push({ path: `/projects/pyfe/${name}`, width, height, sha256: hash(data), source, sourceUrl, sourceCommit: commit, method });
};

await record('desktop.webp', 1600, 900, 'Main application window rendered at 1600x900 in the isolated sandbox', await sharp(input).webp({ quality: 88 }).toBuffer());
await record('cover.webp', 1600, 900, '16:9 application screenshot encoded without cropping', await sharp(input).webp({ quality: 86 }).toBuffer());
await record('cover-800.webp', 800, 450, '800px derivative of cover.webp', await sharp(input).resize(800, 450, { fit: 'contain', background: '#020f1f' }).webp({ quality: 82 }).toBuffer());

const art = await sharp({ create: { width: 1280, height: 1600, channels: 3, background: '#020f1f' } })
  .composite([{ input: await sharp(input).resize(1280, 720).png().toBuffer(), left: 0, top: 0 }])
  .webp({ quality: 86 }).toBuffer();
await record('art.webp', 1280, 1600, 'Screenshot composited unchanged on the official ink base in a 4:5 card canvas', art);
await record('art-800.webp', 640, 800, '640px derivative of art.webp', await sharp(art).resize(640, 800).webp({ quality: 82 }).toBuffer());

const manifestPath = path.join(root, 'public/projects/provenance.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
manifest.capturedAt = new Date().toISOString();
manifest.projects = manifest.projects.filter(project => project.id !== 'pyfe');
manifest.projects.push({
  id: 'pyfe',
  status: 'captured',
  sourceType: 'desktop-open-source',
  sourceRepository: 'https://github.com/oscarvogel/pyfe',
  sourceCommit: commit,
  sourceFile: 'tools/armar_sandbox.py + temporary Qt screenshot runner',
  source,
  sourceUrl,
  captureMethod: 'Application launched from source in a new SQLite sandbox, homo=S, with fictitious company data; 1600x900 window capture; no ARCA/AFIP service actions invoked',
  desktop: { source, sourceUrl, sourceCommit: commit, width: meta.width, height: meta.height, sha256: hash(input) },
  derived: entries,
});
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(entries.map(item => `${item.path} ${item.width}x${item.height}`).join('\n'));
