import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("C:/Users/roman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"));
}

const output = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../docs/capturas/waves-shader-21st-2026-10-03");
const origin = "http://127.0.0.1:5177";
const report = { capturedAt: new Date().toISOString(), origin, source: "21st.dev Waves Shader prompt, adapted to Vogel palette", captures: [], errors: [] };

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
const page = await context.newPage();
page.on("pageerror", (error) => report.errors.push(error.message));

const response = await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: 30000 });
await page.evaluate(() => document.fonts?.ready);
await page.waitForFunction(() => {
  const canvas = document.querySelector(".site-waves-canvas");
  return canvas instanceof HTMLCanvasElement && canvas.width > 0 && canvas.height > 0;
}, null, { timeout: 15000 });

async function capture(name, viewport, wait = 500) {
  if (viewport) await page.setViewportSize(viewport);
  await page.waitForTimeout(wait);
  const state = await page.evaluate(() => {
    const canvas = document.querySelector(".site-waves-canvas");
    const host = document.querySelector(".site-waves-host");
    const gl = canvas?.getContext("webgl");
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      documentWidth: document.documentElement.scrollWidth,
      canvasCount: document.querySelectorAll(".site-waves-host canvas").length,
      canvasReady: Boolean(canvas && canvas.width > 0 && canvas.height > 0 && gl),
      hostPosition: host ? getComputedStyle(host).position : null,
      webgl: gl?.getParameter(gl.VERSION) ?? null,
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  });
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: false });
  report.captures.push({ name, ...state });
}

report.status = response?.status() ?? null;
await capture("inicio-escritorio", { width: 1440, height: 1000 }, 5000);
await page.mouse.move(1070, 410);
await capture("cursor-activo-escritorio", null, 350);
await capture("cursor-neutral-escritorio", null, 1150);
await capture("inicio-tablet", { width: 768, height: 1024 }, 500);
await capture("inicio-movil", { width: 390, height: 844 }, 500);
await page.emulateMedia({ reducedMotion: "reduce" });
await capture("inicio-escritorio-reduced-motion", { width: 1440, height: 1000 }, 200);

await context.close();
await browser.close();
await writeFile(path.join(output, "capture-report.json"), JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ output, status: report.status, captures: report.captures.length, errors: report.errors }, null, 2));
