import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = process.cwd();
const cap = 'docs/capturas/project-sources-2026-10-09';
const mCommit = '30b6894bf20cce28699bd0453963fef8bc2c96cc';
const wCommit = 'f5f79fd76e8f9ef9061021fd422d11ba77bc4a71';
const mDir = 'public/projects/mantenimiento';
const wDir = 'public/projects/vogel-whatsapp-api';
const mDesktop = cap + '/mantenimiento-dashboard-desktop.png';
const mMobile = cap + '/mantenimiento-dashboard-mobile.png';
const diagramFile = wDir + '/diagram.svg';
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const entries = [];

const mCover = await sharp(mDesktop).resize(1600, 900, { fit: 'cover' }).webp({ quality: 86 }).toBuffer();
await fs.mkdir(path.join(root, mDir), { recursive: true });
await sharp(mDesktop).webp({ quality: 88 }).toFile(path.join(root, mDir, 'desktop.webp'));
await sharp(mMobile).webp({ quality: 88 }).toFile(path.join(root, mDir, 'mobile.webp'));
await fs.writeFile(path.join(root, mDir, 'cover.webp'), mCover);
await sharp(mCover).resize(800, 450).webp({ quality: 82 }).toFile(path.join(root, mDir, 'cover-800.webp'));
const mArt = await sharp({ create: { width: 1280, height: 1600, channels: 3, background: '#07182d' } })
  .composite([{ input: await sharp(mDesktop).resize(1280, 800, { fit: 'contain' }).png().toBuffer(), left: 0, top: 400 }])
  .webp({ quality: 86 }).toBuffer();
await fs.writeFile(path.join(root, mDir, 'art.webp'), mArt);
await sharp(mArt).resize(640, 800).webp({ quality: 82 }).toFile(path.join(root, mDir, 'art-800.webp'));

const landscape = '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs><linearGradient id="bg" x2="0" y2="1"><stop stop-color="#10261f"/><stop offset="1" stop-color="#071514"/></linearGradient><marker id="a" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M0 0 12 6 0 12z" fill="#64d895"/></marker></defs><rect width="1600" height="900" fill="url(#bg)"/><text x="96" y="100" fill="#79dca5" font-family="Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="4">VOGEL · INTEGRACIÓN</text><text x="96" y="180" fill="#f3f1e2" font-family="Arial,sans-serif" font-size="52" font-weight="700">VOGEL WHATSAPP API</text><text x="96" y="225" fill="#b5c9be" font-family="Arial,sans-serif" font-size="24">Mensajería empresarial desde un punto central</text><rect x="95" y="330" width="390" height="250" rx="22" fill="#11241e" stroke="#3c7254" stroke-width="2"/><text x="135" y="385" fill="#ccebd8" font-family="Arial,sans-serif" font-size="24" font-weight="700">SISTEMAS VOGEL</text><text x="135" y="440" fill="#f3f1e2" font-family="Arial,sans-serif" font-size="26">FEMAG · Forestal</text><text x="135" y="482" fill="#f3f1e2" font-family="Arial,sans-serif" font-size="26">Mantenimiento · otros</text><path d="M490 455h125" stroke="#64d895" stroke-width="5" marker-end="url(#a)"/><rect x="640" y="295" width="390" height="320" rx="26" fill="#132820" stroke="#64d895" stroke-width="4"/><path d="M700 385h42l27 27-27 27h-42z" fill="none" stroke="#64d895" stroke-width="6" stroke-linejoin="round"/><circle cx="773" cy="412" r="31" fill="none" stroke="#64d895" stroke-width="5"/><path d="m758 412 11 11 20-23" fill="none" stroke="#64d895" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><text x="820" y="398" fill="#f3f1e2" font-family="Arial,sans-serif" font-size="27" font-weight="700">API REST</text><text x="700" y="505" fill="#ccebd8" font-family="Arial,sans-serif" font-size="23">Instancias · permisos · cola</text><text x="700" y="546" fill="#ccebd8" font-family="Arial,sans-serif" font-size="23">Estados · multimedia · auditoría</text><path d="M1035 455h125" stroke="#64d895" stroke-width="5" marker-end="url(#a)"/><rect x="1175" y="330" width="330" height="250" rx="22" fill="#11241e" stroke="#3c7254" stroke-width="2"/><path d="M1230 439c-22-11-40-30-40-52 0-34 29-59 65-59s65 25 65 59-29 59-65 59c-9 0-17-2-25-5l-34 11 8-33" fill="none" stroke="#64d895" stroke-width="7" stroke-linejoin="round"/><path d="m1306 420 17 17 34-39" fill="none" stroke="#64d895" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><text x="1224" y="526" fill="#f3f1e2" font-family="Arial,sans-serif" font-size="25" font-weight="700">WHATSAPP</text><rect x="96" y="690" width="420" height="94" rx="15" fill="#132820"/><text x="128" y="748" fill="#d0e7d8" font-family="Arial,sans-serif" font-size="22">Claves y permisos por sistema</text><rect x="590" y="690" width="420" height="94" rx="15" fill="#132820"/><text x="622" y="748" fill="#d0e7d8" font-family="Arial,sans-serif" font-size="22">Envíos en cola y estados</text><rect x="1084" y="690" width="420" height="94" rx="15" fill="#132820"/><text x="1116" y="748" fill="#d0e7d8" font-family="Arial,sans-serif" font-size="22">Registro y trazabilidad</text><text x="96" y="850" fill="#779786" font-family="Arial,sans-serif" font-size="18">ESQUEMA CONCEPTUAL · basado en documentación del repositorio</text></svg>';
await fs.mkdir(path.join(root, wDir), { recursive: true });
await fs.writeFile(path.join(root, diagramFile), landscape + '\n');
const wCover = await sharp(Buffer.from(landscape)).webp({ quality: 88 }).toBuffer();
await fs.writeFile(path.join(root, wDir, 'cover.webp'), wCover);
await sharp(wCover).resize(800, 450).webp({ quality: 82 }).toFile(path.join(root, wDir, 'cover-800.webp'));
const cardArt = '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="1600" viewBox="0 0 1280 1600"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#10261f"/><stop offset="1" stop-color="#071514"/></linearGradient><pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0v80" fill="none" stroke="#315445" stroke-width="1" opacity=".26"/></pattern><filter id="glow"><feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="1280" height="1600" fill="url(#bg)"/><rect width="1280" height="1600" fill="url(#grid)"/><g fill="none" stroke="#64d895" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".78"><path d="M230 455h240l115 185M230 800h250M230 1145h240l115-185M1050 455H810l-115 185M1050 800H810M1050 1145H810l-115-185"/><path d="M350 455h70M350 800h70M350 1145h70" stroke-width="5" opacity=".56"/></g><g fill="#132820" stroke="#3c7254" stroke-width="4"><rect x="110" y="385" width="250" height="140" rx="25"/><rect x="110" y="730" width="250" height="140" rx="25"/><rect x="110" y="1075" width="250" height="140" rx="25"/><rect x="920" y="385" width="250" height="140" rx="25"/><rect x="920" y="730" width="250" height="140" rx="25"/><rect x="920" y="1075" width="250" height="140" rx="25"/></g><g fill="none" stroke="#64d895" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M200 457h70l28 28-28 28h-70z"/><circle cx="250" cy="800" r="35"/><path d="M227 800h46M250 777v46"/><path d="M215 1110h55a24 24 0 0 1 0 48h-55a24 24 0 0 1 0-48zM220 1158l-8 25 28-25"/><path d="M987 455c0-25 22-45 49-45s49 20 49 45-22 45-49 45h-8l-28 15 9-28c-14-8-22-19-22-32z"/><path d="m987 800 22 22 43-47"/><path d="M990 1110h72a25 25 0 0 1 0 50h-35l-34 20 9-22a25 25 0 0 1-12-48z"/></g><g filter="url(#glow)"><circle cx="640" cy="800" r="155" fill="#10261f" stroke="#64d895" stroke-width="12"/><circle cx="640" cy="800" r="112" fill="none" stroke="#3c7254" stroke-width="5"/></g><path d="M585 755h55l38 38-38 38h-55z" fill="none" stroke="#79dca5" stroke-width="14" stroke-linejoin="round"/><circle cx="677" cy="793" r="42" fill="none" stroke="#79dca5" stroke-width="11"/><path d="m657 793 15 15 29-34" fill="none" stroke="#79dca5" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><g fill="#79dca5"><circle cx="470" cy="640" r="9"/><circle cx="480" cy="800" r="9"/><circle cx="470" cy="960" r="9"/><circle cx="810" cy="640" r="9"/><circle cx="800" cy="800" r="9"/><circle cx="810" cy="960" r="9"/></g></svg>';
const wArt = await sharp(Buffer.from(cardArt)).webp({ quality: 88 }).toBuffer();
await fs.writeFile(path.join(root, wDir, 'art.webp'), wArt);
await sharp(wArt).resize(640, 800).webp({ quality: 82 }).toFile(path.join(root, wDir, 'art-800.webp'));

const add = async (id, dir, file, width, height, source, sourceUrl, commit, method, kind) => {
 const data = await fs.readFile(path.join(root, dir, file));
 entries.push({ path: '/' + dir.replace('public/', '') + '/' + file, width, height, sha256: hash(data), source, sourceUrl, sourceCommit: commit, method, kind: kind || 'derived' });
};
const mUrl = 'https://github.com/oscarvogel/mantenimiento';
const wUrl = 'https://github.com/oscarvogel/vogel_whatsapp_api';
const mDesktopUrl = mUrl + '/blob/' + mCommit + '/docs/screenshots/ui/dashboard-desktop.png';
const mMobileUrl = mUrl + '/blob/' + mCommit + '/docs/screenshots/ui/dashboard-mobile.png';
const wDocUrl = wUrl + '/blob/' + wCommit + '/docs/INTEGRACION_SISTEMAS.md';
for (const item of [
 ['desktop.webp',1440,900,mDesktop,mDesktopUrl,'Screenshot from repository demo data, encoded as WebP without edits'],
 ['mobile.webp',390,1087,mMobile,mMobileUrl,'Mobile repository screenshot, encoded as WebP without edits'],
 ['cover.webp',1600,900,mDesktop,mDesktopUrl,'16:9 crop of repository demo dashboard screenshot'],
 ['cover-800.webp',800,450,mDesktop,mDesktopUrl,'800px derivative of cover.webp'],
 ['art.webp',1280,1600,mDesktop,mDesktopUrl,'Dashboard screenshot centered unchanged on navy 4:5 canvas'],
 ['art-800.webp',640,800,mDesktop,mDesktopUrl,'640px derivative of art.webp']
]) await add('mantenimiento',mDir,item[0],item[1],item[2],item[3],item[4],mCommit,item[5],item[0].startsWith('art')?'generated':'derived');
for (const item of [
 ['cover.webp',1600,900,diagramFile,wDocUrl,'Conceptual integration diagram based on public docs; not a product screenshot'],
 ['cover-800.webp',800,450,diagramFile,wDocUrl,'800px derivative of the conceptual integration diagram'],
 ['art.webp',1280,1600,diagramFile,wDocUrl,'Decorative node-network illustration inspired by the documented API architecture'],
 ['art-800.webp',640,800,diagramFile,wDocUrl,'640px derivative of art.webp']
]) await add('vogel-whatsapp-api',wDir,item[0],item[1],item[2],item[3],item[4],wCommit,item[5],'diagram');
const manifestPath = path.join(root,'public/projects/provenance.json');
const manifest = JSON.parse(await fs.readFile(manifestPath,'utf8'));
manifest.capturedAt = new Date().toISOString();
manifest.projects = manifest.projects.filter(p => !['mantenimiento','vogel-whatsapp-api'].includes(p.id));
manifest.projects.push({
 id:'mantenimiento',status:'captured',sourceType:'web-app-demo',sourceRepository:mUrl,sourceCommit:mCommit,
 captureMethod:'Repository demo dashboard screenshots; fictitious company, vehicle and service data; no production data',
 desktop:{source:mDesktop,sourceUrl:mDesktopUrl,sourceCommit:mCommit,width:1440,height:900},
 mobile:{source:mMobile,sourceUrl:mMobileUrl,sourceCommit:mCommit,width:390,height:1087},
 derived:entries.filter(e=>e.path.includes('/mantenimiento/'))
});
manifest.projects.push({
 id:'vogel-whatsapp-api',status:'diagram',sourceType:'rest-api-integration',sourceRepository:wUrl,sourceCommit:wCommit,
 source:diagramFile,sourceUrl:wDocUrl,captureMethod:'Conceptual diagram authored from public integration documentation; not a live API or dashboard capture',
 derived:entries.filter(e=>e.path.includes('/vogel-whatsapp-api/'))
});
await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(entries.map(e=>e.path+' '+e.width+'x'+e.height).join('\n'));
