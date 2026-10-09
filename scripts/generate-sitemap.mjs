import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resources } from '../src/data/resources.js';
import { servicePages } from '../src/data/servicePages.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://vogelconsultoria.com.ar';
const projects = JSON.parse(await fs.readFile(path.join(root, 'src/data/projectSummaries.json'), 'utf8'));
const paths = new Set([
  '/',
  '/soluciones/',
  '/estudio/',
  '/contacto/',
  '/recursos/',
  '/inteligencia-artificial/',
  '/automatizaciones/',
  ...Object.values(servicePages).map(({ path: servicePath }) => servicePath),
  ...resources.map(({ path: resourcePath }) => resourcePath),
  ...Object.keys(projects).map((id) => `/proyectos/${id}/`),
]);

const urls = [...paths]
  .sort((a, b) => a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b, 'es'))
  .map((pagePath) => `  <url><loc>${site}${pagePath}</loc></url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
await fs.writeFile(path.join(root, 'public/sitemap.xml'), sitemap);
console.log(`Sitemap actualizado: ${paths.size} URLs canónicas.`);
