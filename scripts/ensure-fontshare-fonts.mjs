import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "public", "fonts");
const families = [
  {
    family: "Chillax",
    slug: "chillax",
    filename: "chillax-variable.woff2",
  },
];

function isWoff2(buffer) {
  return buffer.length > 1024 && buffer.subarray(0, 4).toString("ascii") === "wOF2";
}

function extractOfficialWoff2(css, family) {
  const escapedFamily = family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const face = css.match(new RegExp(`/\\*\\s*${escapedFamily}\\s*\\*/\\s*@font-face\\s*\\{([^}]+)\\}`, "i"));
  if (!face) throw new Error(`Fontshare no publicó un @font-face reconocible para ${family}.`);

  const rules = face[1];
  if (!new RegExp(`font-family:\\s*['"]${escapedFamily}['"]`, "i").test(rules)) {
    throw new Error(`El bloque recibido no corresponde a ${family}.`);
  }
  if (!/font-weight:\s*200\s+700\s*;/i.test(rules)) {
    throw new Error(`El archivo de ${family} no declara el rango variable esperado 200–700.`);
  }

  const source = rules.match(/url\((['"]?)([^)'"\s]+\.woff2)\1\)\s*format\(['"]woff2['"]\)/i)?.[2];
  if (!source) throw new Error(`Fontshare no devolvió una URL WOFF2 para ${family}.`);

  const assetUrl = new URL(source.startsWith("//") ? `https:${source}` : source);
  if (assetUrl.protocol !== "https:" || assetUrl.hostname !== "cdn.fontshare.com") {
    throw new Error(`La URL WOFF2 de ${family} no pertenece al CDN oficial de Fontshare.`);
  }
  return assetUrl;
}

async function ensureFamily({ family, slug, filename }) {
  const target = path.join(outputDirectory, filename);
  const refresh = process.argv.includes("--refresh");
  if (!refresh) {
    try {
      const cached = await fs.readFile(target);
      if (isWoff2(cached)) {
        console.log(`ok - ${family}: archivo oficial local disponible (${cached.length} bytes)`);
        return;
      }
    } catch {
      // First run or an incomplete previous download: resolve a fresh official file below.
    }
  }

  const cssUrl = `https://api.fontshare.com/v2/css?f%5B%5D=${slug}%401&display=swap`;
  const cssResponse = await fetch(cssUrl, { headers: { "user-agent": "Vogel-Consultoria-Font-Installer/1.0" } });
  if (!cssResponse.ok) throw new Error(`No se pudo consultar Fontshare para ${family} (HTTP ${cssResponse.status}).`);

  const assetUrl = extractOfficialWoff2(await cssResponse.text(), family);
  const fontResponse = await fetch(assetUrl, { headers: { "user-agent": "Vogel-Consultoria-Font-Installer/1.0" } });
  if (!fontResponse.ok) throw new Error(`No se pudo descargar ${family} del CDN oficial (HTTP ${fontResponse.status}).`);

  const bytes = Buffer.from(await fontResponse.arrayBuffer());
  if (!isWoff2(bytes)) throw new Error(`El archivo descargado para ${family} no tiene formato WOFF2 válido.`);

  await fs.mkdir(outputDirectory, { recursive: true });
  const temporary = `${target}.tmp`;
  await fs.writeFile(temporary, bytes);
  await fs.rename(temporary, target);
  console.log(`ok - ${family}: WOFF2 oficial descargado (${bytes.length} bytes)`);
}

await Promise.all(families.map(ensureFamily));
