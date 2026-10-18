import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const catalog = path.resolve(here, "..");
const project = path.resolve(here, "..", "..", "..", "..");
const logoPath = path.join(project, "src", "assets", "brand", "vogel-lockup.svg");
const archivoPath = path.join(project, "node_modules", "@fontsource-variable", "archivo", "files", "archivo-latin-wdth-normal.woff2");
const chillaxPath = path.join(project, "public", "fonts", "chillax-variable.woff2");

const posts = [
  {
    id: "diagnostico",
    title: ["ORDENÁ TUS", "PROCESOS"],
    body: "Detectamos fricciones y priorizamos oportunidades para mejorar tu operación.",
    image: "01-diagnostico-procesos.png",
  },
  {
    id: "dashboard",
    title: ["DECIDÍ CON", "DATOS CLAROS"],
    body: "Indicadores clave de ventas, stock y operación en una vista clara.",
    image: "02-dashboard-ejecutivo.png",
  },
  {
    id: "automatizacion",
    title: ["MENOS TAREAS", "REPETITIVAS"],
    body: "Reducí tareas repetitivas y errores en administración y operaciones.",
    image: "03-automatizacion-procesos.png",
  },
  {
    id: "sistemas",
    title: ["UN SISTEMA", "PENSADO PARA", "TU OPERACIÓN"],
    body: "Ordená procesos, conectá áreas y mejorá la trazabilidad.",
    image: "04-sistemas-a-medida.png",
  },
  {
    id: "ia-aplicada",
    title: ["IA APLICADA", "AL NEGOCIO REAL"],
    body: "Asistentes, análisis de documentos y automatización con criterio.",
    image: "05-ia-aplicada.png",
  },
  {
    id: "taller-ia",
    title: ["IA PRÁCTICA", "PARA TU EQUIPO"],
    body: "Ejercicios aplicados para que tu equipo incorpore IA con criterio.",
    image: "06-taller-practico-ia.png",
  },
  {
    id: "arca",
    title: ["AUTOMATIZACIONES", "ARCA PARA ESTUDIOS", "CONTABLES"],
    body: "Ejecución supervisada y evidencia organizada por período y CUIT.",
    image: "07-automatizaciones-arca.png",
    titleSize: 62,
  },
];

const dataUri = async (filePath, mime) => `data:${mime};base64,${(await fs.readFile(filePath)).toString("base64")}`;
const logo = await dataUri(logoPath, "image/svg+xml");
const archivo = await dataUri(archivoPath, "font/woff2");
const chillax = await dataUri(chillaxPath, "font/woff2");

const htmlFor = async ({ title, body, image, titleSize = 76 }) => {
  const imageData = await dataUri(path.join(catalog, image), "image/png");
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=1080, initial-scale=1">
<style>
@font-face{font-family:Archivo;src:url('${archivo}') format('woff2');font-weight:100 900;font-stretch:62% 125%;font-style:normal}
@font-face{font-family:Chillax;src:url('${chillax}') format('woff2');font-weight:200 700;font-style:normal}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#020f1f}
main{position:relative;width:1080px;height:1920px;overflow:hidden;background:#020f1f;color:#F3F1E2}
.logo{position:absolute;left:84px;top:66px;width:260px;height:auto}
.eyebrow{position:absolute;left:80px;right:80px;top:258px;text-align:center;color:#FFBC54;font:600 27px Chillax,Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase}
.title{position:absolute;left:60px;right:60px;top:328px;height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:Archivo,Arial,sans-serif;font-size:${titleSize}px;font-weight:800;font-stretch:125%;line-height:.98;letter-spacing:-.045em;text-transform:uppercase;color:#F3F1E2}
.title span{display:block;white-space:nowrap}
.body{position:absolute;left:105px;right:105px;top:598px;height:100px;display:flex;align-items:center;justify-content:center;text-align:center;font:400 34px/1.28 Chillax,Arial,sans-serif;color:#F3F1E2}
.art{position:absolute;left:130px;top:728px;width:820px;height:820px;object-fit:cover;border-radius:12px;border:2px solid rgba(243,241,226,.14)}
.rule{position:absolute;left:100px;right:100px;top:1586px;height:3px;background:#FFBC54}
.cta{position:absolute;left:100px;right:100px;top:1628px;text-align:center;color:#FFBC54;font:800 30px Archivo,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase}
.cta-sub{position:absolute;left:100px;right:100px;top:1680px;text-align:center;color:#F3F1E2;font:500 31px Chillax,Arial,sans-serif}
.domain{position:absolute;left:100px;right:100px;top:1752px;text-align:center;color:#A8A596;font:500 24px Chillax,Arial,sans-serif;letter-spacing:.04em}
</style></head><body><main>
<img class="logo" src="${logo}" alt="Vogel Consultoría">
<div class="eyebrow">Soluciones para empresas</div>
<div class="title">${title.map((line) => `<span>${line}</span>`).join("")}</div>
<div class="body">${body}</div>
<img class="art" src="${imageData}" alt="Ilustración conceptual del servicio">
<div class="rule"></div>
<div class="cta">Conocé el catálogo</div>
<div class="cta-sub">Consultas por WhatsApp empresarial</div>
<div class="domain">vogelconsultoria.com.ar</div>
</main></body></html>`;
};

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const post of posts) {
    await page.setContent(await htmlFor(post), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(here, `${post.id}-estado.png`), fullPage: true });
  }
} finally {
  await browser.close();
}

console.log(`Rendered ${posts.length} WhatsApp Status graphics to ${here}`);
