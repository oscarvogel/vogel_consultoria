import fs from 'node:fs/promises';
import path from 'node:path';

// Writes proyectos/<id>/index.html from src/data/projectSummaries.json so the head metadata,
// the noscript fallback and the app data cannot drift apart. Run: node scripts/generate-project-pages.mjs
const root = process.cwd();
const site = 'https://vogelconsultoria.com.ar';
const summaries = JSON.parse(await fs.readFile(path.join(root, 'src/data/projectSummaries.json'), 'utf8'));
const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// Meta descriptions stay under ~160 characters: keep whole sentences until the limit.
const shorten = text => {
  const sentences = text.match(/[^.]+\.?/g).map(part => part.trim());
  let out = '';
  for (const sentence of sentences) { if ((out + ' ' + sentence).trim().length > 158) break; out = (out + ' ' + sentence).trim(); }
  return out || sentences[0];
};
// The reader hero is the LCP element: ask for it before the app boots. Must match the <img> srcset/sizes in ProjectDetail.vue.
const preload = id => id === 'caso-forestal'
  ? '<link rel="preload" as="image" type="image/webp" href="/src/assets/cases/forestal-dashboard-desktop.webp" fetchpriority="high">'
  : `<link rel="preload" as="image" type="image/webp" href="/projects/${id}/cover.webp" imagesrcset="/projects/${id}/cover-800.webp 800w, /projects/${id}/cover.webp 1600w" imagesizes="(max-width: 767px) calc(100vw - 32px), 1277px" fetchpriority="high">`;
for (const [id, { name, summary }] of Object.entries(summaries)) {
  const url = `${site}/proyectos/${id}/`;
  const title = `${name} — Vogel Consultoría`;
  const description = shorten(summary);
  const html = `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/og-image.png">${preload(id)}</head><body><div id="app"></div><noscript><main><h1>${escape(name)}</h1><p>${escape(summary)}</p><a href="/">Proyectos</a> <a href="mailto:oscar@vogelconsultoria.com.ar">Contacto</a></main></noscript><script type="module" src="/src/main.js"></script></body></html>\n`;
  await fs.mkdir(path.join(root, 'proyectos', id), { recursive: true });
  await fs.writeFile(path.join(root, 'proyectos', id, 'index.html'), html);
  console.log(`${id.padEnd(24)} title ${title.length} / description ${description.length}`);
}
