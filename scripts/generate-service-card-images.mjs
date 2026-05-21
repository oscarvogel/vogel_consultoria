import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDir = path.resolve("src/assets/services/cards");

const cards = [
  {
    file: "sistemas-a-medida.webp",
    accent: "#42b6ff",
    warm: "#f2a900",
    title: "Sistemas a medida",
    shapes: `
      <rect x="118" y="128" width="270" height="178" rx="22" class="panel"/>
      <rect x="430" y="158" width="234" height="134" rx="20" class="panel dim"/>
      <rect x="184" y="358" width="356" height="86" rx="20" class="panel"/>
      <path d="M196 194h112M196 230h154M196 266h78" class="line"/>
      <path d="M486 210h92M486 246h130M244 404h212" class="line amber"/>
      <circle cx="720" cy="116" r="42" class="ring"/>
      <path d="M388 218c54 0 64 64 116 64" class="flow"/>
    `,
  },
  {
    file: "dashboards-ejecutivos.webp",
    accent: "#8bc5ff",
    warm: "#f2a900",
    title: "Dashboards ejecutivos",
    shapes: `
      <rect x="122" y="102" width="232" height="156" rx="22" class="panel"/>
      <rect x="392" y="102" width="336" height="156" rx="22" class="panel dim"/>
      <rect x="122" y="302" width="606" height="136" rx="22" class="panel"/>
      <path d="M166 214l44-54 42 28 48-72" class="flow"/>
      <path d="M442 214V154M506 214V132M570 214v-42M634 214v-78" class="bar"/>
      <path d="M178 392c74-84 136 40 216-28s130-12 278-48" class="flow amber"/>
      <circle cx="680" cy="372" r="48" class="ring"/>
    `,
  },
  {
    file: "automatizacion-procesos.webp",
    accent: "#42b6ff",
    warm: "#f2a900",
    title: "Automatización de procesos",
    shapes: `
      <rect x="124" y="128" width="150" height="92" rx="20" class="panel"/>
      <rect x="404" y="128" width="150" height="92" rx="20" class="panel"/>
      <rect x="684" y="128" width="150" height="92" rx="20" class="panel"/>
      <rect x="264" y="330" width="150" height="92" rx="20" class="panel dim"/>
      <rect x="544" y="330" width="150" height="92" rx="20" class="panel dim"/>
      <path d="M274 174h130M554 174h130M474 220v110M414 376h130" class="flow"/>
      <circle cx="198" cy="174" r="24" class="node"/>
      <circle cx="478" cy="174" r="24" class="node"/>
      <circle cx="758" cy="174" r="24" class="node"/>
      <circle cx="338" cy="376" r="24" class="node amber"/>
      <circle cx="618" cy="376" r="24" class="node amber"/>
    `,
  },
  {
    file: "ia-aplicada.webp",
    accent: "#8bc5ff",
    warm: "#f2a900",
    title: "Inteligencia artificial aplicada",
    shapes: `
      <circle cx="480" cy="260" r="96" class="core"/>
      <circle cx="480" cy="260" r="154" class="ring soft"/>
      <circle cx="480" cy="260" r="218" class="ring"/>
      <path d="M480 106v86M480 328v92M326 260h86M548 260h92M374 154l58 58M528 308l62 62M586 154l-58 58M432 308l-62 62" class="flow"/>
      <circle cx="302" cy="124" r="32" class="node"/>
      <circle cx="664" cy="142" r="28" class="node amber"/>
      <circle cx="724" cy="374" r="36" class="node"/>
      <circle cx="246" cy="398" r="28" class="node amber"/>
    `,
  },
  {
    file: "talleres-capacitacion-ia.webp",
    accent: "#42b6ff",
    warm: "#f2a900",
    title: "Talleres y capacitacion IA",
    shapes: `
      <rect x="144" y="112" width="438" height="250" rx="26" class="panel"/>
      <rect x="188" y="158" width="350" height="34" rx="10" class="panel bright"/>
      <path d="M206 242h112M206 282h192M206 322h146" class="line"/>
      <circle cx="674" cy="178" r="52" class="ring"/>
      <circle cx="688" cy="354" r="68" class="ring soft"/>
      <path d="M660 356h56M688 328v56M606 232c42 12 74 42 92 84" class="flow amber"/>
      <path d="M318 410h236" class="line amber"/>
    `,
  },
  {
    file: "desarrollo-web.webp",
    accent: "#8bc5ff",
    warm: "#f2a900",
    title: "Desarrollo de paginas web",
    shapes: `
      <rect x="126" y="116" width="580" height="316" rx="28" class="panel"/>
      <rect x="126" y="116" width="580" height="58" rx="28" class="panel bright"/>
      <circle cx="174" cy="145" r="8" class="dot"/>
      <circle cx="204" cy="145" r="8" class="dot amber"/>
      <circle cx="234" cy="145" r="8" class="dot"/>
      <rect x="180" y="222" width="204" height="128" rx="18" class="panel dim"/>
      <path d="M424 238h178M424 276h126M424 314h156" class="line"/>
      <path d="M190 388h438" class="line amber"/>
      <circle cx="734" cy="174" r="46" class="ring"/>
    `,
  },
];

const svgFor = ({ title, accent, warm, shapes }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="960" height="600" viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="a" cx="22%" cy="12%" r="78%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.42"/>
      <stop offset="46%" stop-color="#123557" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#071a2d"/>
    </radialGradient>
    <radialGradient id="b" cx="78%" cy="82%" r="60%">
      <stop offset="0%" stop-color="${warm}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#071a2d" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#d9efff" stroke-opacity="0.055"/>
    </pattern>
    <style>
      .panel{fill:#123557;fill-opacity:.52;stroke:#a9d9ff;stroke-opacity:.24;stroke-width:1.4}
      .panel.dim{fill-opacity:.32}
      .panel.bright{fill:${accent};fill-opacity:.14}
      .line,.bar{fill:none;stroke:${accent};stroke-opacity:.82;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}
      .line.amber,.flow.amber{stroke:${warm};stroke-opacity:.86}
      .flow{fill:none;stroke:${accent};stroke-opacity:.72;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;filter:url(#glow)}
      .ring{fill:none;stroke:${accent};stroke-opacity:.42;stroke-width:3}
      .ring.soft{stroke:${warm};stroke-opacity:.26}
      .node{fill:${accent};fill-opacity:.2;stroke:${accent};stroke-opacity:.7;stroke-width:2;filter:url(#glow)}
      .node.amber,.dot.amber{fill:${warm};stroke:${warm}}
      .core{fill:${accent};fill-opacity:.2;stroke:${warm};stroke-opacity:.75;stroke-width:3;filter:url(#glow)}
      .dot{fill:${accent};fill-opacity:.8}
    </style>
  </defs>
  <rect width="960" height="600" fill="#071a2d"/>
  <rect width="960" height="600" fill="url(#a)"/>
  <rect width="960" height="600" fill="url(#b)"/>
  <rect width="960" height="600" fill="url(#grid)"/>
  <g opacity=".92">${shapes}</g>
  <text x="58" y="542" fill="#ffffff" fill-opacity=".16" font-size="38" font-family="Arial, sans-serif" font-weight="700">${title}</text>
</svg>`;

await fs.mkdir(outputDir, { recursive: true });

await Promise.all(
  cards.map(async (card) => {
    await sharp(Buffer.from(svgFor(card)))
      .resize(960, 600)
      .webp({ quality: 84, effort: 6 })
      .toFile(path.join(outputDir, card.file));
  }),
);

console.log(`Generated ${cards.length} service card backgrounds in ${outputDir}`);
