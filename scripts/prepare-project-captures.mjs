import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceDirectory = 'docs/capturas/project-sources-2026-10-06';
const measurements = JSON.parse(await fs.readFile(path.join(root, sourceDirectory, 'measurements.json'), 'utf8'));
const urls = JSON.parse(await fs.readFile(path.join(root, sourceDirectory, 'urls.json'), 'utf8'));
const hash = async file => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');
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
await fs.writeFile(path.join(root, 'public/projects/provenance.json'), JSON.stringify({ capturedAt: new Date().toISOString(), captureMethod: 'Browser screenshot fullPage; per-tab CDP viewport override; originals retained locally', derivativeMethod: 'Unaltered colors; top crop and WebP compression; cover resize 1600x900', projects }, null, 2) + '\n');
console.log(`Prepared ${projects.length} projects and ${projects.length * 3} WebP images.`);

await fs.writeFile(path.join(root,'src/data/projectMedia.json'),JSON.stringify(Object.fromEntries(projects.map(p=>[p.id,Object.fromEntries(p.derived.map(d=>[path.basename(d.path,'.webp'),{width:d.width,height:d.height}]))])),null,2)+'\n');
