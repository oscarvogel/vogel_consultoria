import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const expectedServiceIds = [
  "sistemas-a-medida",
  "dashboards-ejecutivos",
  "automatizacion-de-procesos",
  "contaflow-api-facturacion-electronica",
  "desarrollo-web",
  "talleres-ia",
  "mantenimiento-de-equipos",
  "integraciones-whatsapp",
];

const expectedResourceIds = [
  "cuando-conviene-sistema-a-medida",
  "dashboards-ejecutivos-pymes",
  "automatizacion-procesos-administrativos",
];

const servicePages = loadServicePagesForTest();
const resources = loadResourcesForTest();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function loadServicePagesForTest() {
  const source = readProjectFile("src/data/servicePages.js")
    .replace(/^import .*?;\r?\n/gm, "")
    .replace("export const servicePages", "const servicePages")
    .replace(/export function /g, "function ");

  const context = { encodeURIComponent };

  vm.createContext(context);
  vm.runInContext(`${source}\nresult = servicePages;`, context);
  return context.result;
}

function loadResourcesForTest() {
  const source = readProjectFile("src/data/resources.js")
    .replace("export const resources", "const resources")
    .replace(/export function /g, "function ");

  const context = {};

  vm.createContext(context);
  vm.runInContext(`${source}\nresult = resources;`, context);
  return context.result;
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const pattern = /<script\s+type=["']application\/ld\+json["']\s*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = pattern.exec(html)) !== null) {
    blocks.push(match[1].trim());
  }

  return blocks;
}

function testServiceData() {
  assert(
    JSON.stringify(Object.keys(servicePages).sort()) === JSON.stringify([...expectedServiceIds].sort()),
    "servicePages must contain exactly the expected service ids",
  );

  for (const id of expectedServiceIds) {
    const page = servicePages[id];
    assert(page.id === id, `${id}: page.id must match key`);
    assert(page.path === `/${id}/`, `${id}: path must be /${id}/`);
    assert(page.title && page.metaTitle && page.metaDescription, `${id}: missing SEO text`);
    assert(page.summary && page.summary.length > 80, `${id}: summary is too short`);
    assert(page.ctaUrl.startsWith("https://wa.me/543743667526?text="), `${id}: CTA must use WhatsApp link`);
    assert(page.problems.length === 3, `${id}: must have 3 problems`);
    assert(page.includes.length === 4, `${id}: must have 4 included items`);
    assert(page.process.length === 4, `${id}: must have 4 process steps`);
    assert(page.deliverables.length === 4, `${id}: must have 4 deliverables`);
    assert(page.faqs.length === 3, `${id}: must have 3 FAQs`);
    assert(page.related.length === 3, `${id}: must have 3 related services`);
    if (id === "contaflow-api-facturacion-electronica") {
      assert(page.benefits.length === 6, `${id}: must have 6 developer-oriented benefit cards`);
      assert(page.apiExamples.success.includes('"estado": "AUTORIZADO"'), `${id}: must show authorized API response example`);
      assert(page.apiExamples.error.includes('"estado": "RECHAZADO"'), `${id}: must show rejected API response example`);
      assert(page.secondaryCtaLabel === "Consultar documentación técnica", `${id}: must expose prepared technical documentation CTA`);
    }
    for (const relatedId of page.related) {
      assert(servicePages[relatedId], `${id}: related service ${relatedId} does not exist`);
    }
  }
}

function testHtmlEntrypoints() {
  for (const id of expectedServiceIds) {
    const relativePath = `${id}/index.html`;
    const html = readProjectFile(relativePath);
    const page = servicePages[id];

    assert(html.includes(`data-service-id="${id}"`), `${relativePath}: missing data-service-id`);
    assert(html.includes('<script type="module" src="/src/service-page.js"></script>'), `${relativePath}: missing service entry script`);
    assert(html.includes(`<title>${page.metaTitle}</title>`), `${relativePath}: title does not match service data`);
    assert(html.includes(`href="https://vogelconsultoria.com.ar${page.path}"`), `${relativePath}: missing canonical`);
    assert(html.includes("<noscript>"), `${relativePath}: missing noscript fallback`);

    const jsonLdBlocks = extractJsonLdBlocks(html);
    assert(jsonLdBlocks.length === 1, `${relativePath}: expected exactly one JSON-LD block`);

    const jsonLd = JSON.parse(jsonLdBlocks[0]);
    assert(jsonLd["@context"] === "https://schema.org", `${relativePath}: invalid JSON-LD context`);
    assert(Array.isArray(jsonLd["@graph"]), `${relativePath}: JSON-LD graph must be an array`);

    const graphTypes = jsonLd["@graph"].flatMap((entry) => entry["@type"]);
    for (const requiredType of ["ProfessionalService", "WebPage", "Service", "FAQPage", "BreadcrumbList"]) {
      assert(graphTypes.includes(requiredType), `${relativePath}: missing ${requiredType} schema`);
    }
  }
}

function testViteInputs() {
  const viteConfig = readProjectFile("vite.config.js");
  for (const id of expectedServiceIds) {
    assert(viteConfig.includes(`${id}/index.html`), `vite.config.js: missing input for ${id}`);
  }
  assert(viteConfig.includes("recursos/index.html"), "vite.config.js: missing resources index input");
  for (const page of ["soluciones", "estudio", "contacto"]) {
    assert(viteConfig.includes(`${page}/index.html`), `vite.config.js: missing ${page} portfolio input`);
  }
  for (const id of expectedResourceIds) {
    assert(viteConfig.includes(`recursos/${id}/index.html`), `vite.config.js: missing input for resource ${id}`);
  }
}

function testPortfolioDestinations() {
  const app = readProjectFile("src/App.vue");
  const nav = readProjectFile("src/components/home/PortfolioNav.vue");
  const navbar = readProjectFile("src/components/Navbar.vue");
  const solutions = readProjectFile("src/components/home/destinations/SolutionsDestination.vue");
  const resourcesPage = readProjectFile("src/components/home/destinations/ResourcesDestination.vue");
  const studio = readProjectFile("src/components/home/destinations/StudioDestination.vue");
  const contact = readProjectFile("src/components/home/destinations/ContactDestination.vue");

  for (const page of ["soluciones", "recursos", "estudio", "contacto"]) {
    const html = readProjectFile(`${page}/index.html`);
    assert(html.includes("/src/main.js") && html.includes("rel=\"canonical\""), `${page}: needs portfolio entry and canonical URL`);
  }
  for (const route of ["/soluciones/", "/recursos/", "/estudio/", "/contacto/"]) {
    assert(nav.includes(`href:'${route}'`) && app.includes(route), `portfolio route is not connected: ${route}`);
  }
  assert(nav.includes(":aria-current") && nav.includes("activeLabel"), "portfolio navigation must expose the active destination");
  assert(navbar.includes('href="/estudio/" class="info-button"'), "Info header action must resolve to Studio");
  assert(app.includes("['servicios', '/soluciones/#servicios']") && app.includes("['metodologia', '/estudio/#metodologia']"), "legacy Info hashes must map to their new destination");
  assert(solutions.includes("capabilities") && solutions.includes("alsoServices"), "Solutions must reuse capability data");
  assert(resourcesPage.includes("from '../../../data/resources.js'") && resourcesPage.includes("resource.path"), "Resources must reuse published resource data and routes");
  assert(studio.includes("methodSteps") && studio.includes("oscarProfile") && !studio.includes("En desarrollo"), "Studio must reuse method and profile data and no longer carry the FEMAG in-development label");
  assert(contact.includes("useContactForm") && contact.includes('id=\"contacto\"') && contact.includes('type=\"tel\"'), "Contact must reuse the form and retain its optional phone field");
}

function testDiscoveryFiles() {
  const sitemap = readProjectFile("public/sitemap.xml");
  const llms = readProjectFile("public/llms.txt");
  const info = readProjectFile("src/components/home/InfoPanel.vue");
  const campaignUrl = "https://vogelconsultoria.com.ar/automatizaciones/";

  for (const id of expectedServiceIds) {
    const url = `https://vogelconsultoria.com.ar/${id}/`;
    assert(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: missing ${url}`);
    assert(llms.includes(url), `llms.txt: missing ${url}`);
    assert(info.includes("Object.values(servicePages)") && servicePages[id].path === `/${id}/`, `InfoPanel.vue: missing home link for ${id}`);
  }

  assert(info.includes("/inteligencia-artificial/"), "InfoPanel.vue: missing IA page link");
  assert(servicePages["contaflow-api-facturacion-electronica"].summary.includes("API"), "ContaFlow service copy must keep the API reference");
  assert(info.includes("/automatizaciones/"), "InfoPanel.vue: missing home link for automatizaciones campaign");
  assert(sitemap.includes(`<loc>${campaignUrl}</loc>`), "sitemap.xml: missing automatizaciones campaign URL");
  assert(llms.includes(campaignUrl), "llms.txt: missing automatizaciones campaign URL");
  assert(sitemap.includes("https://vogelconsultoria.com.ar/recursos/"), "sitemap.xml: missing resources index");
  assert(llms.includes("https://vogelconsultoria.com.ar/recursos/"), "llms.txt: missing resources index");
  for (const page of ["soluciones", "estudio", "contacto"]) {
    const url = `https://vogelconsultoria.com.ar/${page}/`;
    assert(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: missing ${url}`);
    assert(llms.includes(url), `llms.txt: missing ${url}`);
  }
  for (const id of expectedResourceIds) {
    const url = `https://vogelconsultoria.com.ar/recursos/${id}/`;
    assert(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: missing ${url}`);
    assert(llms.includes(url), `llms.txt: missing ${url}`);
  }
}

function testInfoPanelMenu() {
  const navbar = readProjectFile("src/components/Navbar.vue");
  const info = readProjectFile("src/components/home/InfoPanel.vue");

  assert(navbar.includes("InfoPanel") && navbar.includes('aria-controls="info-panel"') && navbar.includes(":aria-expanded"), "Navbar.vue: Info button must control the panel accessibly");
  assert(info.includes('role="dialog"') && info.includes('aria-modal="true"'), "InfoPanel.vue: panel must be an accessible dialog");
  assert(info.includes("Escape"), "InfoPanel.vue: Escape must close the panel");
  assert(info.includes("/recursos/") && info.includes("Servicios"), "InfoPanel.vue: missing Servicios or Recursos entries");
  for (const hash of ["contacto", "nosotros", "metodologia", "recursos", "servicios"]) {
    assert(info.includes(`id="${hash}"`) && navbar.includes(`'${hash}'`), `legacy anchor #${hash} must open the panel at its section`);
  }
}

function testNavbarBrandAndViewToggle() {
  const navbar = readProjectFile("src/components/Navbar.vue");
  assert(navbar.includes("vogel-v-amber.svg"), "Navbar.vue: missing brand mark");
  assert(navbar.includes("aria-pressed") && navbar.includes("update:view"), "Navbar.vue: carousel/grid toggle must expose its state");
  assert(!navbar.includes("backdrop-filter:"), "Navbar.vue: obsolete glass treatment");
}

function testAnalyticsEventAttributes() {
  const analytics = readProjectFile("src/lib/analytics.js");
  const servicePage = readProjectFile("src/components/ServicePage.vue");
  const automatizaciones = readProjectFile("automatizaciones/index.html");

  assert(servicePage.includes("data-analytics-event"), "ServicePage.vue: service CTAs must declare analytics events");
  assert(automatizaciones.includes('/src/automatizaciones.js'), "automatizaciones/index.html: missing analytics entry script");
  assert(automatizaciones.includes('data-analytics-view="automatizaciones_entry"'), "automatizaciones/index.html: missing view analytics marker");
  assert(automatizaciones.includes('data-analytics-event="whatsapp_click"'), "automatizaciones/index.html: WhatsApp CTAs must declare analytics events");
  assert(analytics.includes("[data-analytics-cta], [data-analytics-event]"), "analytics.js: must bind custom analytics events");
  assert(analytics.includes("analytics_label"), "analytics.js: must send custom analytics labels");
  assert(analytics.includes("analytics_location"), "analytics.js: must send custom analytics locations");
  assert(analytics.includes("gtag(\"consent\", \"default\""), "analytics.js: must set Google Consent Mode defaults");
  assert(analytics.includes("renderPrivacySettingsButton"), "analytics.js: users must be able to reopen privacy preferences");
  assert(analytics.includes("getStoredConsent() !== \"granted\""), "analytics.js: events must be gated by explicit consent");
  assert(!analytics.includes('document.addEventListener("submit"'), "analytics.js: submit attempts must not be counted as successful contacts");
  assert(analytics.includes("return \"whatsapp\""), "analytics.js: must avoid sending WhatsApp numbers to GA4");
  assert(analytics.includes("return \"email\""), "analytics.js: must avoid sending email addresses to GA4");
}

function testContactPrivacyDisclosureAndHeaders() {
  const contact = readProjectFile("src/components/home/destinations/ContactDestination.vue");
  const info = readProjectFile("src/components/home/InfoPanel.vue");
  const headers = readProjectFile("public/.htaccess");

  assert(contact.includes('aria-describedby="contacto-datos-notice"') && contact.includes("Web3Forms"), "ContactDestination.vue: the form must describe its processor and data flow");
  assert(info.includes('aria-describedby="info-contacto-datos-notice"') && info.includes("Evitá incluir información sensible"), "InfoPanel.vue: the form must expose its privacy notice to assistive technology");
  for (const header of ["X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "X-Frame-Options", "Strict-Transport-Security"]) {
    assert(headers.includes(header), `public/.htaccess: missing ${header}`);
  }
  assert(headers.includes("env=vogel_https"), "public/.htaccess: HSTS must only be emitted on HTTPS requests");
}

function testCommercialEmailDestination() {
  const info = readProjectFile("src/components/home/InfoPanel.vue");
  const footerSection = readProjectFile("src/components/FooterSection.vue");

  assert(
    info.includes("mailto:oscar@vogelconsultoria.com.ar?subject=Quiero%20agendar%20un%20diagn%C3%B3stico"),
    "InfoPanel.vue: Agendar por email must use oscar@vogelconsultoria.com.ar",
  );
  assert(footerSection.includes("mailto:oscar@vogelconsultoria.com.ar"), "FooterSection.vue: footer email must use oscar@vogelconsultoria.com.ar");
}

function testResourcesContent() {
  const info = readProjectFile("src/components/home/InfoPanel.vue");
  const resourceIndex = readProjectFile("recursos/index.html");

  assert(info.includes("resources") && info.includes('id="recursos"'), "home must expose resource discovery in the Info panel");
  assert(resourceIndex.includes('<script type="module" src="/src/main.js"></script>'), "recursos/index.html: missing portfolio entry script");

  assert(
    JSON.stringify(resources.map((resource) => resource.id).sort()) === JSON.stringify([...expectedResourceIds].sort()),
    "resources must contain exactly the expected resource ids",
  );

  for (const id of expectedResourceIds) {
    const resource = resources.find((item) => item.id === id);
    const html = readProjectFile(`recursos/${id}/index.html`);

    assert(resource, `${id}: missing resource data`);
    assert(resource.path === `/recursos/${id}/`, `${id}: resource path must match id`);
    assert(resource.title && resource.metaTitle && resource.metaDescription, `${id}: missing SEO text`);
    assert(resource.summary.length > 80, `${id}: summary is too short`);
    assert(resource.sections.length >= 4, `${id}: must have at least 4 sections`);
    assert(resource.checklist.length >= 5, `${id}: must have at least 5 checklist items`);
    assert(servicePages[resource.primaryService], `${id}: primary service must exist`);
    assert(html.includes(`data-resource-id="${id}"`), `${id}: HTML must declare resource id`);
    assert(html.includes('<script type="module" src="/src/resource-article.js"></script>'), `${id}: missing resource article entry script`);
    assert(html.includes(`href="https://vogelconsultoria.com.ar/recursos/${id}/"`), `${id}: missing canonical`);
  }
}

function testHomeStage() {
  const app = readProjectFile("src/App.vue");
  const stage = readProjectFile("src/components/home/HomeStage.vue");
  const cards = readProjectFile("src/data/homeCards.js");
  const content = readProjectFile("src/data/forestCase.js");

  assert(app.includes("HomeStage") && app.includes("Preloader"), "App.vue: home stage and preloader must be mounted");
  assert(stage.includes("<h1") && stage.includes("keydown"), "HomeStage.vue: needs a real h1 and keyboard navigation");
  assert(stage.includes("reducedPortfolioMotion"), "HomeStage.vue: wheel glide must respect reduced motion");
  for (const id of ["forestCase", "webProjects"]) assert(cards.includes(id), `homeCards.js: missing source ${id}`);
  assert(cards.includes("Datos de demostración"), "homeCards.js: the demo case must keep its demonstration label");
  assert(!readProjectFile("src/components/home/InfoPanel.vue").includes("En desarrollo"), "Info: FEMAG is published as a project, so the in-development label must be gone");
  assert(readProjectFile("src/data/projects.js").includes("femag.com.ar"), "projects.js: FEMAG must point to its published site");
  assert(content.includes("registro de producción anónimo"), "production-registry case must be explicitly anonymous");
  assert(content.includes("Equipo, proceso, tiempos y producción"), "forest case must explain the recorded operational data");
}

function testPortalAccessLinks() {
  const info = readProjectFile("src/components/home/InfoPanel.vue");
  const portalUrl = "https://portal.vogelconsultoria.com.ar";

  assert(info.includes(portalUrl), "InfoPanel.vue: missing portal access link");
  assert(info.includes("Ingresar al portal"), "InfoPanel.vue: portal access link must be clearly labeled");
  assert(info.includes("navbar_portal_access"), "InfoPanel.vue: missing portal analytics");
}

function testUiRefinements() {
  const generator=readProjectFile("scripts/generate-service-card-images.mjs");
  assert(!generator.includes("<text"), "service backgrounds must not contain embedded titles");
  const serviceData=readProjectFile("src/data/servicePages.js");
  const serviceTemplate=readProjectFile("src/components/ServicePage.vue");
  assert(!serviceData.includes("assets/services/cards/"), "service pages should not ship decorative mockup images");
  assert(serviceTemplate.includes("ProcessFlowDiagram") && serviceTemplate.includes("serviceFlows"), "service pages must use service-specific process diagrams");
  assert(serviceData.includes('title: "ContaFlow API para facturación electrónica"'), "ContaFlow must use the shorter service title");
  assert(serviceData.includes("AFIP/ARCA"), "ContaFlow's service summary must retain the fiscal integration reference");
  assert(serviceTemplate.includes("service-main-cta") && serviceTemplate.includes('aria-label="Ruta de navegación"'), "service pages must expose one prominent CTA and a compact breadcrumb");
  const whatsapp=readProjectFile("src/components/WhatsAppButton.vue");
  assert(whatsapp.includes("max-[639px]:hidden"), "floating WhatsApp must be hidden on narrow mobile screens");
  const info=readProjectFile("src/components/home/InfoPanel.vue");
  assert(info.includes('type="tel" name="Telefono" autocomplete="tel"') && !info.includes('id="contacto-telefono" required'), "contact phone must be a custom optional tel field");
  const survey=readProjectFile("src/SurveyApp.vue");
  assert(survey.includes("8000") && survey.includes('role="status"') && survey.includes("Abrir encuesta en otra pestaña"), "survey must expose accessible loading and a persistent external form link");
  assert(survey.includes("Correo de contacto") && survey.includes("opcional"), "survey copy must clarify that its email field is optional");
  const iaHero=readProjectFile("src/components/HeroIA.vue");
  const iaExamples=readProjectFile("src/components/UseCasesIA.vue");
  assert(iaHero.includes("ProcessFlowDiagram") && !iaHero.includes("ai-operations.webp"), "IA hero should use a Vogel process diagram");
  assert(!iaExamples.includes("ai-use-cases.webp"), "IA use cases should not use decorative mock UI artwork");
  assert(!readProjectFile("automatizaciones/index.html").includes("/src/assets/ia/ai-operations.webp"), "ARCA page should not use the generic blue artwork");
  assert(readProjectFile("automatizaciones/index.html").includes("hero-flow__list"), "ARCA page should use its own process diagram");
  const provenance=JSON.parse(readProjectFile("public/clients/provenance.json"));
  for(const file of Object.keys(provenance.sources)) assert(fs.existsSync(path.join(root,"public/clients",file)), `missing local client logo ${file}`);
  for(const file of ["index.html","src/SurveyApp.vue",...expectedServiceIds.map(id=>`${id}/index.html`)]) {
    assert(!readProjectFile(file).includes("oscarvogel@gmail.com"), `${file}: inconsistent commercial email`);
  }
}

function testAboutCvSection() {
  const info = readProjectFile("src/components/home/InfoPanel.vue");
  const oscar = readProjectFile("src/data/oscar.js");
  const cvPath = path.join(root, "public", "cv-jose-oscar-vogel.pdf");

  assert(info.includes('id="nosotros"') && info.includes("oscarProfile.cv"), "InfoPanel.vue: profile section must link the CV");
  assert(oscar.includes("/cv-jose-oscar-vogel.pdf"), "oscar.js: missing CV path");
  assert(fs.existsSync(cvPath), "public/cv-jose-oscar-vogel.pdf: missing downloadable CV asset");
  assert(fs.statSync(cvPath).size > 5000, "public/cv-jose-oscar-vogel.pdf: CV asset looks unexpectedly small");
}

function testBluePalette() {
  const tokens = readProjectFile("src/styles/tokens.css");
  assert(/--vogel-ink:\s*2 15 31;/.test(tokens), "tokens.css: --vogel-ink must be #020f1f (2 15 31)");
  assert(/--vogel-navy:\s*2 15 31;/.test(tokens), "tokens.css: the page background (navy) must be the blue base");
  assert(/--vogel-charcoal:\s*22 21 21;/.test(tokens), "tokens.css: the previous charcoal must stay available as charcoal");
  const tailwind = readProjectFile("tailwind.config.js");
  for (const name of ["ink", "raised", "charcoal"]) assert(tailwind.includes(`${name}: "rgb(var(--vogel-${name}) / <alpha-value>)"`), `tailwind.config.js: vogel.${name} must accept opacity`);
  const sources = ["src/App.vue", "src/components/home/StageBackdrop.vue", "src/components/home/ProjectCard.vue", "src/components/home/ProjectDetail.vue", "src/components/Navbar.vue", "src/components/home/PortfolioNav.vue", "src/components/home/InfoPanel.vue"];
  for (const file of sources) assert(!/#161515|rgb\(22 21 21|#3b3933|#262523/i.test(readProjectFile(file)), `${file}: hard-coded charcoal/warm grey; use the colour variables`);
}

const tests = [
  ["blue palette and Tailwind colours", testBluePalette],
  ["service data", testServiceData],
  ["HTML entrypoints and JSON-LD", testHtmlEntrypoints],
  ["Vite inputs", testViteInputs],
  ["portfolio destinations", testPortfolioDestinations],
  ["discovery files", testDiscoveryFiles],
  ["info panel menu", testInfoPanelMenu],
  ["navbar brand and view toggle", testNavbarBrandAndViewToggle],
  ["analytics event attributes", testAnalyticsEventAttributes],
  ["contact privacy disclosure and server headers", testContactPrivacyDisclosureAndHeaders],
  ["commercial email destination", testCommercialEmailDestination],
  ["resources content", testResourcesContent],
  ["home stage", testHomeStage],
  ["portal access links", testPortalAccessLinks],
  ["about CV section", testAboutCvSection],
  ["UI refinements assets and contact", testUiRefinements],
];

for (const [name, test] of tests) {
  test();
  console.log(`ok - ${name}`);
}
