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
const output = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../docs/capturas/fase-final-2026-10-03");
const origin = "http://127.0.0.1:5177";
const routes = [
  "/",
  "/sistemas-a-medida/",
  "/dashboards-ejecutivos/",
  "/automatizacion-de-procesos/",
  "/contaflow-api-facturacion-electronica/",
  "/desarrollo-web/",
  "/talleres-ia/",
  "/mantenimiento-de-equipos/",
  "/integraciones-whatsapp/",
  "/inteligencia-artificial/",
  "/automatizaciones/",
  "/recursos/",
  "/recursos/automatizacion-procesos-administrativos/",
  "/recursos/cuando-conviene-sistema-a-medida/",
  "/recursos/dashboards-ejecutivos-pymes/",
  "/encuesta-contadores/",
];
const viewports = [
  { name: "escritorio", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "movil", width: 390, height: 844 },
];
const report = { capturedAt: new Date().toISOString(), origin, routes: [], forms: {}, browserErrors: [] };

await mkdir(output, { recursive: true });
await mkdir(path.join(output, "rutas-escritorio"), { recursive: true });
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  const page = await context.newPage();
  page.on("pageerror", (error) => report.browserErrors.push({ viewport: viewport.name, message: error.message }));

  for (const route of routes) {
    const response = await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(route === "/" ? 1400 : 700);
    const state = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector("main h1")?.innerText?.trim() || document.querySelector("h1")?.innerText?.trim() || null,
      width: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      font: getComputedStyle(document.querySelector("h1") || document.body).fontFamily,
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
      sections: [...document.querySelectorAll("main section")].length,
      background: (() => {
        const canvas = document.querySelector(".site-waves-canvas");
        const host = document.querySelector(".site-waves-host");
        const gl = canvas?.getContext("webgl");
        return {
          canvasCount: document.querySelectorAll(".site-waves-host canvas").length,
          canvasReady: Boolean(canvas && canvas.width > 0 && canvas.height > 0 && gl),
          hostPosition: host ? getComputedStyle(host).position : null,
          webgl: gl?.getParameter(gl.VERSION) ?? null,
        };
      })(),
    }));
    const item = { route, viewport: viewport.name, status: response?.status() ?? null, ...state };
    report.routes.push(item);

    const basename = route === "/" ? "inicio" : route.replace(/^\/+|\/+$/g, "").replaceAll("/", "--");
    if (viewport.name === "escritorio") {
      await page.screenshot({ path: path.join(output, "rutas-escritorio", `${basename}.png`), fullPage: false });
    }
    if (route === "/") {
      await page.screenshot({ path: path.join(output, `inicio-${viewport.name}.png`), fullPage: false });
    }
    if (route === "/" && viewport.name === "escritorio") {
      const geometry = await page.evaluate(() => {
        const host = document.querySelector("#casos");
        const sequence = host.querySelector(".case-sequence");
        const steps = [...host.querySelectorAll(".case-step")];
        const distance = Math.min(window.innerHeight * 2, Math.max(800, host.querySelector(".case-steps").offsetHeight - 350));
        return {
          start: sequence.getBoundingClientRect().top + window.scrollY - 116,
          distance,
          progress: steps.map((step) => (step.offsetTop - steps[0].offsetTop) / distance),
        };
      });
      report.caseGeometry = geometry;
      const caseScreenshots = [
        "caso-forestal-captura-escritorio.png",
        "caso-forestal-revision-escritorio.png",
        "caso-forestal-dashboard-escritorio.png",
      ];
      for (const [index, filename] of caseScreenshots.entries()) {
        const progress = Math.min(0.94, geometry.progress[index] + 0.04);
        await page.evaluate(({ start, distance, progress }) => window.scrollTo({ top: start + distance * progress, behavior: "instant" }), { ...geometry, progress });
        await page.waitForTimeout(500);
        report.caseStates ||= [];
        report.caseStates.push(await page.evaluate(() => ({
          activeStep: [...document.querySelectorAll(".case-step")].findIndex((step) => step.classList.contains("step-current")),
          visibleScreen: [...document.querySelectorAll(".case-screen")].find((screen) => Number.parseFloat(getComputedStyle(screen).opacity) > 0.8)?.querySelector("figcaption")?.innerText || null,
          pinned: Boolean(document.querySelector("#casos .pin-spacer")),
        })));
        await page.screenshot({ path: path.join(output, filename), fullPage: false });
      }
    }
  }

  if (viewport.name === "escritorio") {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(output, "inicio-escritorio-completo-reduced-motion.png"), fullPage: true });
  }
  if (viewport.name === "movil") {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(output, "inicio-movil-completo-reduced-motion.png"), fullPage: true });
  }
  await context.close();
}

const interactionContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const interactionPage = await interactionContext.newPage();
await interactionPage.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
const servicesSummary = interactionPage.locator(".services-menu > summary");
await servicesSummary.focus();
await servicesSummary.press("Enter");
await interactionPage.waitForTimeout(80);
report.interactions = {
  desktopMenuOpened: await interactionPage.locator(".services-menu").evaluate((element) => element.open),
};
await interactionPage.keyboard.press("Escape");
report.interactions.desktopMenuClosedByEscape = !(await interactionPage.locator(".services-menu").evaluate((element) => element.open));
report.interactions.desktopMenuFocusRestored = await servicesSummary.evaluate((element) => document.activeElement === element);

await interactionPage.locator("#web-projects").scrollIntoViewIfNeeded();
const gallery = interactionPage.locator("#web-projects");
const galleryStart = await gallery.evaluate((element) => element.scrollLeft);
await interactionPage.getByRole("button", { name: "Proyectos siguientes" }).click();
await interactionPage.waitForTimeout(300);
report.interactions.galleryAdvance = await gallery.evaluate((element) => element.scrollLeft);
await interactionPage.getByRole("button", { name: "Proyectos anteriores" }).click();
await interactionPage.waitForTimeout(300);
report.interactions.galleryReturn = await gallery.evaluate((element) => element.scrollLeft);
report.interactions.galleryStartedAt = galleryStart;

await interactionPage.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
await interactionPage.locator(".hero-actions a[href='#casos']").click();
await interactionPage.waitForTimeout(900);
report.interactions.caseAnchor = await interactionPage.evaluate(() => ({
  hash: window.location.hash,
  sectionTop: Math.round(document.querySelector("#casos").getBoundingClientRect().top),
  headerBottom: Math.round(document.querySelector(".site-header").getBoundingClientRect().bottom),
}));
await interactionContext.close();

const mobileMenuContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
const mobileMenuPage = await mobileMenuContext.newPage();
await mobileMenuPage.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
const menuToggle = mobileMenuPage.locator(".menu-toggle");
const toggleBox = await menuToggle.boundingBox();
await mobileMenuPage.touchscreen.tap(toggleBox.x + toggleBox.width / 2, toggleBox.y + toggleBox.height / 2);
report.interactions.mobileMenuOpenedByTouch = await menuToggle.getAttribute("aria-expanded");
await mobileMenuPage.keyboard.press("Escape");
report.interactions.mobileMenuClosedByEscape = (await menuToggle.getAttribute("aria-expanded")) === "false";
report.interactions.mobileMenuFocusRestored = await menuToggle.evaluate((element) => document.activeElement === element);
await mobileMenuContext.close();

const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
await reducedPage.waitForTimeout(900);
report.interactions.reducedMotion = await reducedPage.evaluate(() => ({
  requested: matchMedia("(prefers-reduced-motion: reduce)").matches,
  casePinned: document.querySelector("#casos").classList.contains("case-motion"),
  visibleStages: [...document.querySelectorAll("#casos .case-screen")].filter((screen) => getComputedStyle(screen).visibility !== "hidden" && Number.parseFloat(getComputedStyle(screen).opacity) > 0.9).length,
}));
await reducedContext.close();

const formContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const formPage = await formContext.newPage();
await formPage.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
await formPage.locator("#contacto").scrollIntoViewIfNeeded();
const form = formPage.getByRole("form", { name: "Formulario de contacto" });
const submit = form.getByRole("button", { name: /Enviar consulta/ });
await submit.click();
report.forms.empty = await form.evaluate((element) => ({ valid: element.checkValidity(), active: document.activeElement?.id }));

await formPage.route("https://api.web3forms.com/submit", async (route) => {
  await new Promise((resolve) => setTimeout(resolve, 450));
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
});
await form.getByLabel("Nombre y apellido").fill("Prueba local");
await form.getByLabel("Email").fill("qa@example.invalid");
const successSubmit = form.getByRole("button", { name: /Enviar consulta/ });
const successRequest = successSubmit.click();
await formPage.waitForTimeout(80);
report.forms.loading = await formPage.locator("#contacto form").evaluate((element) => ({ busy: element.getAttribute("aria-busy"), disabled: element.querySelector('[type="submit"]')?.disabled }));
await successRequest;
report.forms.success = await formPage.getByRole("status").innerText();

await formPage.route("https://api.web3forms.com/submit", (route) => route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false }) }));
await formPage.getByRole("button", { name: "Enviar otra consulta" }).click();
await formPage.getByLabel("Nombre y apellido").fill("Prueba local");
await formPage.getByLabel("Email").fill("qa@example.invalid");
await form.getByRole("button", { name: /Enviar consulta/ }).click();
report.forms.error = await formPage.getByRole("alert").innerText();
await formContext.close();

await browser.close();
await writeFile(path.join(output, "visual-qa.json"), JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ output, routes: report.routes.length, errors: report.browserErrors, forms: report.forms }, null, 2));
