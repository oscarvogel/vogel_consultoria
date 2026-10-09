import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
// Folder written by scripts/capture-project-sources.mjs; pass another one as the first argument.
const sourceDirectory = process.argv[2] || 'docs/capturas/project-sources-2026-10-09';
const measurements = JSON.parse(await fs.readFile(path.join(root, sourceDirectory, 'measurements.json'), 'utf8'));
const urls = JSON.parse(await fs.readFile(path.join(root, sourceDirectory, 'urls.json'), 'utf8'));
const hash = async file => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');
const provenancePath = path.join(root, 'public/projects/provenance.json');
const mediaPath = path.join(root, 'src/data/projectMedia.json');
const previousProvenance = JSON.parse(await fs.readFile(provenancePath, 'utf8'));
const previousMedia = JSON.parse(await fs.readFile(mediaPath, 'utf8'));
const projects = [];
for (const [index, measurement] of measurements.entries()) {
  const id = measurement.id;
  const target = path.join(root, 'public/projects', id);
  await fs.mkdir(target, { recursive: true });
  const project = { id, status: 'captured', url: urls[index], derived: [] };
  for (const variant of ['desktop', 'mobile']) {
    const source = `${sourceDirectory}/${id}-${variant}.jpg`;
    const file = path.join(root, source);
    const metadata = await sharp(file).metadata();
    project[variant] = { source, width: metadata.width, height: metadata.height, sha256: await hash(file), viewport: measurement[variant], fullHeight: metadata.height };
    const cropWidth = Math.min(metadata.width, variant === 'desktop' ? 1440 : 390);
    const cropHeight = Math.min(metadata.height, variant === 'desktop' ? 2600 : 2200);
    const output = path.join(target, `${variant}.webp`);
    await sharp(file).extract({ left: 0, top: 0, width: cropWidth, height: cropHeight }).webp({ quality: 86 }).toFile(output);
    project.derived.push({ path: `/projects/${id}/${variant}.webp`, width: cropWidth, height: cropHeight, sha256: await hash(output), source, crop: { left: 0, top: 0, width: cropWidth, height: cropHeight } });
    if (variant === 'desktop') {
      const cover = path.join(target, 'cover.webp');
      const coverHeight = Math.min(900, metadata.height);
      await sharp(file).extract({ left: 0, top: 0, width: cropWidth, height: coverHeight }).resize(1600, 900, { fit: 'cover', position: 'top' }).webp({ quality: 86 }).toFile(cover);
      project.derived.push({ path: `/projects/${id}/cover.webp`, width: 1600, height: 900, sha256: await hash(cover), source, crop: { left: 0, top: 0, width: cropWidth, height: coverHeight } });
    }
  }
  projects.push(project);
}
const capturedIds = new Set(projects.map(project => project.id));
const retainedProjects = previousProvenance.projects.filter(project => !capturedIds.has(project.id));
const retainedMedia = Object.fromEntries(Object.entries(previousMedia).filter(([id]) => !capturedIds.has(id)));
await fs.writeFile(provenancePath, JSON.stringify({
  capturedAt: new Date().toISOString(),
  captureMethod: 'Web projects: browser fullPage screenshots; desktop software: approved repository demo mode; originals retained locally',
  derivativeMethod: 'Unaltered colors; web captures top-cropped and compressed as WebP; desktop software screenshots preserved and padded on brand base where needed',
  projects: [...projects, ...retainedProjects],
}, null, 2) + '\n');
console.log(`Prepared ${projects.length} web projects and retained ${retainedProjects.length} other project sources.`);

const generatedMedia = Object.fromEntries(projects.map(project => [project.id, Object.fromEntries(project.derived.map(item => [path.basename(item.path, '.webp'), { width: item.width, height: item.height }]))]));
await fs.writeFile(mediaPath, JSON.stringify({ ...generatedMedia, ...retainedMedia }, null, 2) + '\n');
