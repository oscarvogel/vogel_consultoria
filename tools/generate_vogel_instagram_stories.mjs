import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = "O:/vogel_consultoria";
const outDir = path.join(root, "outputs/instagram_vogel_stories");
await fs.mkdir(outDir, { recursive: true });

const assets = {
  logo: path.join(root, "src/assets/brand/logo-vogel-generated.png"),
  dashboard: path.join(root, "src/assets/hero/dashboard-mockup.png"),
  network: path.join(root, "src/assets/hero/network-intelligence.png"),
  services: path.join(root, "src/assets/services/services-overview.png"),
};

const palette = {
  deep: "#0F2A44",
  navy: "#0B2035",
  slate: "#162F49",
  blue: "#1E5FA8",
  light: "#8BC5FF",
  amber: "#F2A900",
  gray: "#E5E7EB",
  muted: "#8EA8C3",
  white: "#FFFFFF",
};

const stories = [
  {
    id: "01_demo_breve",
    eyebrow: "NUEVO EN VOGEL",
    title: "Automatización para estudios contables",
    lines: ["ARCA", "evidencia", "clientes delegados", "reportes"],
    cta: "Pedí una demo breve",
    visual: assets.dashboard,
  },
  {
    id: "02_encuesta_tareas",
    eyebrow: "PARA ESTUDIOS CONTABLES",
    title: "¿Qué tarea te consume más tiempo?",
    poll: ["Descargar evidencia", "Revisar clientes", "Armar reportes", "Hacer seguimiento"],
    cta: "Respondé la encuesta",
    visual: assets.services,
  },
  {
    id: "03_control_trazabilidad",
    eyebrow: "IA APLICADA CON CRITERIO",
    title: "Automatizar no es perder control",
    lines: ["evidencia ordenada", "supervisión humana", "trazabilidad", "menos trabajo repetitivo"],
    cta: "Escribinos DEMO",
    visual: assets.network,
  },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textLines({ text, x, y, size, max, weight = 800, fill = palette.white, lineHeight = 1.06 }) {
  return wrap(text, max).map((line, index) => (
    `<text x="${x}" y="${y + index * size * lineHeight}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(line)}</text>`
  )).join("\n");
}

async function dataUri(file) {
  const ext = path.extname(file).toLowerCase();
  const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
  const buf = await fs.readFile(file);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function grid() {
  const lines = [];
  for (let x = 0; x <= 1080; x += 72) lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="1920" stroke="${palette.gray}" opacity=".045"/>`);
  for (let y = 0; y <= 1920; y += 72) lines.push(`<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="${palette.gray}" opacity=".045"/>`);
  return lines.join("\n");
}

function listItems(story) {
  const items = story.poll ?? story.lines;
  return items.map((item, index) => {
    const y = 1030 + index * 110;
    return `
      <g transform="translate(86 ${y})">
        <rect x="0" y="0" width="908" height="78" rx="22" fill="${palette.slate}" opacity=".88" stroke="${palette.gray}" stroke-opacity=".14"/>
        <circle cx="42" cy="39" r="${story.poll ? 16 : 9}" fill="${index === 0 ? palette.amber : palette.light}"/>
        <text x="84" y="50" font-family="Arial, Helvetica, sans-serif" font-size="33" font-weight="750" fill="${palette.gray}">${esc(item)}</text>
      </g>`;
  }).join("\n");
}

function svg(story, imageUri, logoUri) {
  return `
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${palette.deep}"/>
        <stop offset=".7" stop-color="${palette.navy}"/>
        <stop offset="1" stop-color="#07182A"/>
      </linearGradient>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${palette.navy}" stop-opacity=".72"/>
        <stop offset=".45" stop-color="${palette.deep}" stop-opacity=".96"/>
        <stop offset="1" stop-color="${palette.navy}" stop-opacity="1"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#000000" flood-opacity=".34"/>
      </filter>
      <clipPath id="logoClip"><rect x="0" y="0" width="260" height="124" rx="22"/></clipPath>
    </defs>
    <rect width="1080" height="1920" fill="url(#bg)"/>
    <image href="${imageUri}" x="-50" y="90" width="1180" height="880" preserveAspectRatio="xMidYMid slice" opacity=".42"/>
    <rect width="1080" height="1920" fill="url(#fade)"/>
    ${grid()}
    <g transform="translate(86 88)">
      <rect x="0" y="0" width="260" height="124" rx="22" fill="${palette.navy}" stroke="${palette.gray}" stroke-opacity=".14" filter="url(#shadow)"/>
      <image href="${logoUri}" x="-8" y="-56" width="276" height="276" preserveAspectRatio="xMidYMid slice" clip-path="url(#logoClip)"/>
    </g>
    <g transform="translate(86 370)">
      <line x1="0" y1="0" x2="58" y2="0" stroke="${palette.amber}" stroke-width="7" stroke-linecap="round"/>
      <text x="78" y="9" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" fill="${palette.light}">${esc(story.eyebrow)}</text>
    </g>
    ${textLines({ text: story.title, x: 86, y: 560, size: 80, max: 16, weight: 800 })}
    ${listItems(story)}
    <g transform="translate(86 1608)">
      <rect x="0" y="0" width="470" height="82" rx="41" fill="${palette.amber}"/>
      <text x="235" y="52" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="850" fill="${palette.navy}">${esc(story.cta)}</text>
    </g>
    <text x="86" y="1794" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="800" fill="${palette.white}">Vogel Consultoria</text>
    <text x="86" y="1840" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="650" fill="${palette.muted}">Sistemas · Dashboards · IA aplicada</text>
  </svg>`;
}

const logoUri = await dataUri(assets.logo);
for (const story of stories) {
  const imageUri = await dataUri(story.visual);
  const markup = svg(story, imageUri, logoUri);
  await fs.writeFile(path.join(outDir, `${story.id}.svg`), markup, "utf8");
  await sharp(Buffer.from(markup)).png().toFile(path.join(outDir, `${story.id}.png`));
}

console.log(JSON.stringify({ outDir, files: stories.map((story) => `${story.id}.png`) }, null, 2));
