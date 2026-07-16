import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const base = String.raw`\\notebook-oscar\programacion\vogel_consultoria\n8n-social-approval\generated\campana-marketing-pdf-2026-07`;
const source = path.join(base, 'source');
const logoPath = path.join(source, 'logo-vogel.png');

const assets = [
  { id:'instagram-01-portada', platform:'instagram', input:'instagram-01-base.png', output:'instagram/carrusel-5-senales/01-portada.png', w:1080, h:1080, n:'1/7', title:['5 señales de que','tu empresa necesita','automatizar un proceso'], body:['Problemas cotidianos que consumen','tiempo y generan errores.'] },
  { id:'instagram-02-informacion-duplicada', platform:'instagram', input:'instagram-02-base.png', output:'instagram/carrusel-5-senales/02-informacion-duplicada.png', w:1080, h:1080, n:'2/7', title:['La misma información','se carga más de una vez.'], body:['Cada carga duplicada aumenta el tiempo','de trabajo y la posibilidad de errores.'] },
  { id:'instagram-03-reportes-dependientes', platform:'instagram', input:'instagram-03-base.png', output:'instagram/carrusel-5-senales/03-reportes-dependientes.png', w:1080, h:1080, n:'3/7', title:['Los reportes dependen','de una persona.'], body:['Cuando esa persona no está,','la información no llega.'] },
  { id:'instagram-04-vencimientos-manuales', platform:'instagram', input:'instagram-04-base.png', output:'instagram/carrusel-5-senales/04-vencimientos-manuales.png', w:1080, h:1080, n:'4/7', title:['El equipo controla','vencimientos manualmente.'], body:['Una alerta automática puede reemplazar','horas de seguimiento.'] },
  { id:'instagram-05-datos-en-planillas', platform:'instagram', input:'instagram-05-base.png', output:'instagram/carrusel-5-senales/05-datos-en-planillas.png', w:1080, h:1080, n:'5/7', title:['Los datos están distribuidos','en varias planillas.'], body:['El problema no siempre es la planilla.','Es la falta de integración.'] },
  { id:'instagram-06-errores-al-cierre', platform:'instagram', input:'instagram-06-base.png', output:'instagram/carrusel-5-senales/06-errores-al-cierre.png', w:1080, h:1080, n:'6/7', title:['Los errores se descubren','al cierre del mes.'], body:['Automatizar controles permite','detectar desvíos antes.'] },
  { id:'instagram-07-cta-diagnostico', platform:'instagram', input:'instagram-07-base.png', output:'instagram/carrusel-5-senales/07-cta-diagnostico.png', w:1080, h:1080, n:'7/7', title:['No hace falta automatizar','toda la empresa.'], body:['Empezá por el proceso que más tiempo consume.'], cta:'Solicitá un diagnóstico', domain:'vogelconsultoria.com.ar' },
  { id:'whatsapp-01-automatizacion-procesos', platform:'whatsapp', input:'whatsapp-01-base.png', output:'whatsapp/01-automatizacion-procesos.png', w:1080, h:1920, title:['¿Tu equipo carga la misma','información más de una vez?'], body:['Empezá por automatizar el proceso','que más tiempo consume.'], cta:'Solicitá un diagnóstico', domain:'vogelconsultoria.com.ar' },
  { id:'whatsapp-02-ia-proceso-ordenado', platform:'whatsapp', input:'whatsapp-02-base.png', output:'whatsapp/02-ia-proceso-ordenado.png', w:1080, h:1920, title:['La IA no debería ser','el punto de partida.'], body:['Primero, ordenar. Después, integrar.','Finalmente, aplicar IA.'], cta:'Conocé IA aplicada al negocio real', domain:'vogelconsultoria.com.ar/inteligencia-artificial/' },
  { id:'whatsapp-03-automatizaciones-arca', platform:'whatsapp', input:'whatsapp-03-base.png', output:'whatsapp/03-automatizaciones-arca.png', w:1080, h:1920, title:['Menos tareas repetitivas.','Más tiempo para asesorar.'], body:['Automatizaciones ARCA','para estudios contables.'], cta:'Solicitá una demo breve', domain:'vogelconsultoria.com.ar/automatizaciones/' },
  { id:'facebook-01-automatizacion-procesos', platform:'facebook', input:'facebook-01-base.png', output:'facebook/01-automatizacion-procesos.png', w:1080, h:1350, title:['5 señales de que necesitás','automatizar un proceso'], body:['Doble carga, reportes dependientes y controles','tardíos consumen tiempo y aumentan errores.'], cta:'Solicitá un diagnóstico', domain:'vogelconsultoria.com.ar' },
  { id:'facebook-02-ia-proceso-ordenado', platform:'facebook', input:'facebook-02-base.png', output:'facebook/02-ia-proceso-ordenado.png', w:1080, h:1350, title:['La IA no debería ser','el punto de partida.'], body:['Primero ordená el proceso. Después integrá','la información. Aplicá IA donde genere valor.'], cta:'Conocé nuestras soluciones de IA', domain:'vogelconsultoria.com.ar/inteligencia-artificial/' },
  { id:'facebook-03-automatizaciones-arca', platform:'facebook', input:'facebook-03-base.png', output:'facebook/03-automatizaciones-arca.png', w:1080, h:1350, title:['Menos tareas repetitivas.','Más tiempo para asesorar.'], body:['Automatizaciones ARCA con control humano,','evidencia y trazabilidad.'], cta:'Solicitá una demo breve', domain:'vogelconsultoria.com.ar/automatizaciones/' }
];

const esc = (s='') => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const lines = (items, x, y, size, step, weight=700, fill='#FFFFFF') => items.map((t,i) => `<text x="${x}" y="${y+i*step}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(t)}</text>`).join('');

function overlay(a) {
  const isStory = a.platform === 'whatsapp';
  const titleSize = isStory ? 68 : a.platform === 'instagram' ? 58 : 62;
  const titleStep = Math.round(titleSize * 1.08);
  const top = isStory ? 250 : a.platform === 'facebook' ? 210 : 205;
  const x = 72;
  const bodyY = top + a.title.length * titleStep + 36;
  const bottom = isStory ? 1660 : a.platform === 'facebook' ? 1125 : 910;
  const panelHeight = isStory ? 560 : a.platform === 'facebook' ? 430 : 430;
  const cta = a.cta ? `<rect x="72" y="${bottom}" width="${Math.min(760, Math.max(390,a.cta.length*22))}" height="72" rx="18" fill="#F2A900"/><text x="104" y="${bottom+48}" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#0B2035">${esc(a.cta)}</text>` : '';
  const domain = a.domain ? `<text x="72" y="${bottom+112}" font-family="Arial, sans-serif" font-size="24" font-weight="600" fill="#E5E7EB">${esc(a.domain)}</text>` : '';
  const number = a.n ? `<text x="960" y="82" text-anchor="end" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#8BC5FF">${esc(a.n)}</text>` : '';
  return Buffer.from(`<svg width="${a.w}" height="${a.h}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#071b30" stop-opacity="0.98"/><stop offset="0.72" stop-color="#071b30" stop-opacity="0.72"/><stop offset="1" stop-color="#071b30" stop-opacity="0"/></linearGradient></defs>
    <rect x="0" y="0" width="${a.w}" height="${panelHeight}" fill="url(#shade)"/>
    <rect x="72" y="${top-34}" width="74" height="6" rx="3" fill="#F2A900"/>
    ${lines(a.title,x,top,titleSize,titleStep,700)}
    ${lines(a.body,x,bodyY,isStory?30:27,isStory?40:36,400,'#E5E7EB')}
    ${cta}${domain}${number}
  </svg>`);
}

async function validate() {
  if (assets.length !== 13) throw new Error(`Expected 13 assets, got ${assets.length}`);
  const dims = { instagram:'1080x1080', whatsapp:'1080x1920', facebook:'1080x1350' };
  for (const a of assets) {
    if (!a.title?.length) throw new Error(`${a.id}: title missing`);
    if (`${a.w}x${a.h}` !== dims[a.platform]) throw new Error(`${a.id}: invalid dimensions`);
    const resolved = path.resolve(base, a.output);
    if (!resolved.startsWith(path.resolve(base))) throw new Error(`${a.id}: output escapes campaign directory`);
    await fs.access(path.join(source,a.input));
  }
  await fs.access(logoPath);
}

async function compose(a) {
  const out = path.join(base,a.output);
  await fs.mkdir(path.dirname(out), {recursive:true});
  const logoWidth = a.platform === 'whatsapp' ? 130 : 110;
  const logo = await sharp(logoPath).resize(logoWidth,logoWidth,{fit:'cover'}).png().toBuffer();
  await sharp(path.join(source,a.input))
    .resize(a.w,a.h,{fit:'cover',position:'centre'})
    .composite([{input:overlay(a),top:0,left:0},{input:logo,top:a.platform==='whatsapp'?20:18,left:18}])
    .png({compressionLevel:9})
    .toFile(out);
}

async function verify() {
  let count=0;
  for (const a of assets) {
    const meta=await sharp(path.join(base,a.output)).metadata();
    if(meta.width!==a.w || meta.height!==a.h || meta.format!=='png') throw new Error(`${a.id}: invalid output ${meta.width}x${meta.height} ${meta.format}`);
    count++;
  }
  console.log(`Verified ${count}/13 assets; errors=0`);
}

await validate();
if (process.argv.includes('--validate-only')) console.log('Validated 13 asset definitions');
else if (process.argv.includes('--verify')) await verify();
else {
  for (const a of assets) await compose(a);
  console.log('Generated 13/13 assets');
}
