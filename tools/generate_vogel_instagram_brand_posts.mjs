import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = "O:/vogel_consultoria";
const outDir = path.join(root, "outputs/instagram_vogel_brand_posts");
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
  bright: "#196ECF",
  light: "#8BC5FF",
  amber: "#F2A900",
  gray: "#E5E7EB",
  muted: "#8EA8C3",
  white: "#FFFFFF",
};

const posts = [
  {
    id: "01_tareas_estudio_contable",
    eyebrow: "AUTOMATIZACIÓN ARCA",
    title: "3 tareas que tu estudio no debería seguir haciendo a mano",
    lead: "Menos carga repetitiva. Más trazabilidad, evidencia y control mensual.",
    cta: "Automatizar un proceso",
    visual: assets.dashboard,
    chips: ["Evidencia por CUIT", "Clientes delegados", "Reportes mensuales"],
  },
  {
    id: "02_arca_sin_perder_control",
    eyebrow: "IA APLICADA CON CRITERIO",
    title: "Automatizar ARCA no significa perder control",
    lead: "El flujo se ejecuta con supervisión humana y salidas auditables.",
    cta: "Solicitar diagnóstico",
    visual: assets.network,
    chips: ["Control humano", "Seguridad", "Trazabilidad"],
  },
  {
    id: "03_demo_automatizacion_arca",
    eyebrow: "DEMO BREVE",
    title: "Qué mostramos en una demo de automatización ARCA",
    lead: "Lote mensual, ejecución supervisada y carpeta final con evidencia.",
    cta: "Hablar por WhatsApp",
    visual: assets.services,
    chips: ["Lote mensual", "Ejecucion", "Resultado final"],
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

function textLines({ text, x, y, size, max, weight = 800, fill = palette.white, lineHeight = 1.04, family = "Arial, Helvetica, sans-serif" }) {
  return wrap(text, max).map((line, index) => (
    `<text x="${x}" y="${y + index * size * lineHeight}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(line)}</text>`
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
  for (let i = 0; i <= 1080; i += 72) {
    lines.push(`<line x1="${i}" y1="0" x2="${i}" y2="1080" stroke="${palette.gray}" opacity=".045"/>`);
    lines.push(`<line x1="0" y1="${i}" x2="1080" y2="${i}" stroke="${palette.gray}" opacity=".045"/>`);
  }
  return lines.join("\n");
}

function nodes() {
  return `
    <g opacity=".85">
      <path d="M828 180 C910 190 930 262 992 292" fill="none" stroke="${palette.blue}" stroke-width="3" opacity=".72"/>
      <path d="M760 790 C850 748 914 814 1000 748" fill="none" stroke="${palette.light}" stroke-width="2" opacity=".35"/>
      <circle cx="828" cy="180" r="8" fill="${palette.amber}"/>
      <circle cx="992" cy="292" r="10" fill="${palette.amber}"/>
      <circle cx="760" cy="790" r="7" fill="${palette.light}"/>
      <circle cx="1000" cy="748" r="8" fill="${palette.amber}"/>
    </g>`;
}

function chipList(chips) {
  return chips.map((chip, index) => {
    const y = 682 + index * 74;
    return `
      <g transform="translate(76 ${y})">
        <rect x="0" y="0" width="500" height="56" rx="16" fill="${palette.slate}" opacity=".88" stroke="${palette.gray}" stroke-opacity=".13"/>
        <circle cx="32" cy="28" r="8" fill="${index === 0 ? palette.amber : palette.light}"/>
        <text x="58" y="36" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" fill="${palette.gray}">${esc(chip)}</text>
      </g>`;
  }).join("\n");
}

function svg(post, imageUri, logoUri) {
  return `
  <svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${palette.deep}"/>
        <stop offset=".68" stop-color="${palette.navy}"/>
        <stop offset="1" stop-color="#07182A"/>
      </linearGradient>
      <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${palette.navy}" stop-opacity=".98"/>
        <stop offset=".55" stop-color="${palette.deep}" stop-opacity=".92"/>
        <stop offset="1" stop-color="${palette.navy}" stop-opacity=".46"/>
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="20" stdDeviation="28" flood-color="#000000" flood-opacity=".32"/>
      </filter>
    </defs>
    <rect width="1080" height="1080" fill="url(#bg)"/>
    <image href="${imageUri}" x="410" y="90" width="760" height="760" preserveAspectRatio="xMidYMid slice" opacity=".55"/>
    <rect width="1080" height="1080" fill="url(#leftFade)"/>
    <rect x="0" y="0" width="1080" height="1080" fill="${palette.deep}" opacity=".14"/>
    ${grid()}
    ${nodes()}

    <g transform="translate(70 48)">
      <clipPath id="logoClip"><rect x="0" y="0" width="230" height="112" rx="20"/></clipPath>
      <rect x="0" y="0" width="230" height="112" rx="20" fill="${palette.navy}" stroke="${palette.gray}" stroke-opacity=".13" filter="url(#softShadow)"/>
      <image href="${logoUri}" x="-10" y="-50" width="250" height="250" preserveAspectRatio="xMidYMid slice" clip-path="url(#logoClip)"/>
    </g>
    <text x="1010" y="104" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" fill="${palette.muted}">Sistemas · Dashboards · IA aplicada</text>

    <g transform="translate(72 224)">
      <line x1="0" y1="0" x2="48" y2="0" stroke="${palette.amber}" stroke-width="5" stroke-linecap="round"/>
      <text x="68" y="8" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="${palette.light}">${esc(post.eyebrow)}</text>
    </g>

    ${textLines({ text: post.title, x: 72, y: 342, size: 66, max: 17, weight: 800, fill: palette.white })}
    ${textLines({ text: post.lead, x: 76, y: 580, size: 30, max: 34, weight: 500, fill: palette.gray, lineHeight: 1.22 })}
    ${chipList(post.chips)}

    <g transform="translate(675 664)" filter="url(#softShadow)">
      <rect x="0" y="0" width="322" height="206" rx="28" fill="${palette.slate}" opacity=".84" stroke="${palette.light}" stroke-opacity=".16"/>
      <text x="28" y="50" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="${palette.muted}">Indicadores</text>
      <rect x="28" y="78" width="72" height="76" rx="14" fill="${palette.navy}" stroke="${palette.gray}" stroke-opacity=".1"/>
      <rect x="122" y="78" width="72" height="76" rx="14" fill="${palette.navy}" stroke="${palette.gray}" stroke-opacity=".1"/>
      <rect x="216" y="78" width="72" height="76" rx="14" fill="${palette.navy}" stroke="${palette.gray}" stroke-opacity=".1"/>
      <path d="M42 130 L62 111 L82 119" fill="none" stroke="${palette.amber}" stroke-width="5" stroke-linecap="round"/>
      <path d="M137 132 L137 106 M158 132 L158 96 M179 132 L179 116" stroke="${palette.light}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="252" cy="116" r="22" fill="none" stroke="${palette.blue}" stroke-width="8"/>
      <path d="M252 94 A22 22 0 0 1 274 116" fill="none" stroke="${palette.amber}" stroke-width="8" stroke-linecap="round"/>
    </g>

    <g transform="translate(72 945)">
      <line x1="0" y1="-32" x2="936" y2="-32" stroke="${palette.gray}" opacity=".18"/>
      <rect x="0" y="-5" width="285" height="58" rx="29" fill="${palette.amber}"/>
      <text x="142" y="32" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="${palette.navy}">${esc(post.cta)}</text>
      <text x="936" y="32" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="${palette.muted}">vogelconsultoria.com.ar</text>
    </g>
  </svg>`;
}

const logoUri = await dataUri(assets.logo);

for (const post of posts) {
  const imageUri = await dataUri(post.visual);
  const markup = svg(post, imageUri, logoUri);
  const svgPath = path.join(outDir, `${post.id}.svg`);
  const pngPath = path.join(outDir, `${post.id}.png`);
  await fs.writeFile(svgPath, markup, "utf8");
  await sharp(Buffer.from(markup)).png().toFile(pngPath);
}

console.log(JSON.stringify({ outDir, files: posts.map((post) => `${post.id}.png`) }, null, 2));
