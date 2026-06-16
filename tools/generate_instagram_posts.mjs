import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = "O:/vogel_consultoria/outputs/instagram_vogel_posts";
await fs.mkdir(outDir, { recursive: true });

const W = 1080;
const H = 1080;

const colors = {
  ink: "#12343B",
  ink2: "#173F47",
  teal: "#2F8F83",
  mint: "#8ED8C6",
  paper: "#F6F8F7",
  soft: "#DDE8E5",
  muted: "#7B8B8C",
  warn: "#D7A548",
};

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function lines(text, max = 22) {
  const words = text.split(" ");
  const out = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      out.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) out.push(current);
  return out;
}

function textBlock({ text, x, y, size, weight = 700, fill = colors.paper, max = 22, lineHeight = 1.08, anchor = "start" }) {
  const rows = lines(text, max);
  return rows.map((row, i) => (
    `<text x="${x}" y="${y + i * size * lineHeight}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(row)}</text>`
  )).join("\n");
}

function brandMark() {
  return `
  <g transform="translate(70 70)">
    <rect x="0" y="0" width="116" height="54" rx="12" fill="${colors.paper}" opacity="0.96"/>
    <text x="18" y="36" font-size="28" font-weight="800" fill="${colors.ink}" letter-spacing="1">OV</text>
    <rect x="72" y="14" width="25" height="25" rx="5" fill="${colors.teal}"/>
  </g>`;
}

function footer() {
  return `
  <g transform="translate(70 980)">
    <line x1="0" y1="-38" x2="940" y2="-38" stroke="${colors.soft}" stroke-opacity="0.22"/>
    <text x="0" y="0" font-size="24" font-weight="700" fill="${colors.paper}">Vogel Consultoria</text>
    <text x="940" y="0" text-anchor="end" font-size="22" font-weight="500" fill="${colors.mint}">Sistemas · Dashboards · IA aplicada</text>
  </g>`;
}

function gridBg() {
  return `
  <defs>
    <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse">
      <path d="M 54 0 L 0 0 0 54" fill="none" stroke="${colors.soft}" stroke-width="1" opacity="0.08"/>
    </pattern>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${colors.ink}"/>
      <stop offset="1" stop-color="${colors.ink2}"/>
    </linearGradient>
  </defs>
  <style>
    text { font-family: Arial, Helvetica, sans-serif; }
  </style>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>`;
}

function flowNodes(items, y = 650) {
  const xs = [125, 390, 655];
  return `
  <g>
    <path d="M240 ${y + 38} C300 ${y + 38}, 320 ${y + 38}, 365 ${y + 38}" stroke="${colors.mint}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M505 ${y + 38} C565 ${y + 38}, 585 ${y + 38}, 630 ${y + 38}" stroke="${colors.mint}" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${items.map((item, idx) => `
      <g transform="translate(${xs[idx]} ${y})">
        <rect x="0" y="0" width="190" height="132" rx="18" fill="${colors.paper}" opacity="0.96"/>
        <circle cx="36" cy="38" r="16" fill="${colors.teal}"/>
        <text x="36" y="46" text-anchor="middle" font-size="20" font-weight="800" fill="${colors.paper}">${idx + 1}</text>
        ${textBlock({ text: item, x: 24, y: 82, size: 24, weight: 700, fill: colors.ink, max: 12, lineHeight: 1.05 })}
      </g>
    `).join("")}
  </g>`;
}

function cardList(items, startY = 450) {
  return items.map((item, i) => {
    const y = startY + i * 122;
    return `
    <g transform="translate(90 ${y})">
      <rect x="0" y="0" width="900" height="96" rx="18" fill="${colors.paper}" opacity="${i === 1 ? "0.99" : "0.92"}"/>
      <rect x="24" y="24" width="48" height="48" rx="12" fill="${i === 1 ? colors.teal : colors.ink}"/>
      <text x="48" y="57" text-anchor="middle" font-size="24" font-weight="800" fill="${colors.paper}">${i + 1}</text>
      <text x="100" y="58" font-size="30" font-weight="760" fill="${colors.ink}">${esc(item)}</text>
    </g>`;
  }).join("\n");
}

function postOne() {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${gridBg()}
    ${brandMark()}
    <text x="70" y="225" font-size="30" font-weight="700" fill="${colors.mint}">Automatización ARCA + IA aplicada</text>
    ${textBlock({ text: "3 tareas que tu estudio no debería seguir haciendo a mano", x: 70, y: 315, size: 60, weight: 850, fill: colors.paper, max: 20, lineHeight: 1.02 })}
    ${cardList([
      "Evidencia por CUIT",
      "Clientes delegados",
      "Reportes mensuales",
    ], 585)}
    <path d="M850 190 L972 190 L972 312" stroke="${colors.teal}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="972" cy="312" r="14" fill="${colors.mint}"/>
    ${footer()}
  </svg>`;
}

function postTwo() {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${gridBg()}
    ${brandMark()}
    <text x="70" y="225" font-size="30" font-weight="700" fill="${colors.mint}">Control humano · evidencia · trazabilidad</text>
    ${textBlock({ text: "Automatizar ARCA no significa perder control", x: 70, y: 330, size: 76, weight: 850, fill: colors.paper, max: 16, lineHeight: 1.0 })}
    <g transform="translate(90 620)">
      <rect x="0" y="0" width="900" height="250" rx="28" fill="${colors.paper}" opacity="0.96"/>
      <path d="M78 135 L148 205 L292 62" stroke="${colors.teal}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="350" y="86" font-size="34" font-weight="800" fill="${colors.ink}">Flujo supervisado</text>
      <text x="350" y="138" font-size="28" font-weight="600" fill="${colors.ink}">La IA ordena y documenta.</text>
      <text x="350" y="186" font-size="28" font-weight="600" fill="${colors.ink}">El estudio mantiene el control.</text>
    </g>
    <g transform="translate(770 150)" opacity="0.9">
      <rect x="0" y="0" width="190" height="86" rx="16" fill="${colors.teal}"/>
      <text x="95" y="54" text-anchor="middle" font-size="26" font-weight="800" fill="${colors.paper}">SIN MAGIA</text>
    </g>
    ${footer()}
  </svg>`;
}

function postThree() {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${gridBg()}
    ${brandMark()}
    <text x="70" y="225" font-size="30" font-weight="700" fill="${colors.mint}">Demo breve para estudios contables</text>
    ${textBlock({ text: "Qué mostramos en una demo de automatización ARCA", x: 70, y: 330, size: 72, weight: 850, fill: colors.paper, max: 17, lineHeight: 1.0 })}
    ${flowNodes(["Lote mensual", "Ejecución", "Evidencia final"], 660)}
    <g transform="translate(710 480)">
      <rect x="0" y="0" width="280" height="92" rx="18" fill="${colors.teal}"/>
      <text x="140" y="57" text-anchor="middle" font-size="28" font-weight="850" fill="${colors.paper}">PEDÍ DEMO</text>
    </g>
    <path d="M90 580 H600" stroke="${colors.soft}" stroke-opacity="0.25" stroke-width="2"/>
    <text x="90" y="560" font-size="26" font-weight="600" fill="${colors.soft}">Tiempo · errores · retrabajo · seguimiento</text>
    ${footer()}
  </svg>`;
}

const posts = [
  ["01_tareas_a_mano", postOne()],
  ["02_control_arca", postTwo()],
  ["03_demo_arca", postThree()],
];

for (const [name, svg] of posts) {
  const svgPath = path.join(outDir, `${name}.svg`);
  const pngPath = path.join(outDir, `${name}.png`);
  await fs.writeFile(svgPath, svg, "utf8");
  await sharp(Buffer.from(svg)).png().toFile(pngPath);
}

console.log(JSON.stringify({ outDir, files: posts.map(([name]) => `${name}.png`) }, null, 2));
