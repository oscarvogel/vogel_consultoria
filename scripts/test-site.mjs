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
  for (const id of expectedResourceIds) {
    assert(viteConfig.includes(`recursos/${id}/index.html`), `vite.config.js: missing input for resource ${id}`);
  }
}

function testDiscoveryFiles() {
  const sitemap = readProjectFile("public/sitemap.xml");
  const llms = readProjectFile("public/llms.txt");
  const servicesSection = readProjectFile("src/components/ServicesSection.vue");
  const campaignUrl = "https://vogelconsultoria.com.ar/automatizaciones/";

  for (const id of expectedServiceIds) {
    const url = `https://vogelconsultoria.com.ar/${id}/`;
    assert(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: missing ${url}`);
    assert(llms.includes(url), `llms.txt: missing ${url}`);
    assert(servicesSection.includes(id) && servicesSection.includes("servicePages"), `ServicesSection.vue: missing home link for ${id}`);
  }

  assert(servicesSection.includes("/inteligencia-artificial/"), "ServicesSection.vue: missing IA page link");
  assert(
    servicePages["contaflow-api-facturacion-electronica"].summary.includes("API"),
    "ServicesSection.vue: missing ContaFlow service card copy",
  );
  assert(servicesSection.includes("path:'/automatizaciones/'") && servicesSection.includes(':href="service.path"'), "ServicesSection.vue: missing home link for automatizaciones campaign");
  assert(sitemap.includes(`<loc>${campaignUrl}</loc>`), "sitemap.xml: missing automatizaciones campaign URL");
  assert(llms.includes(campaignUrl), "llms.txt: missing automatizaciones campaign URL");
  assert(sitemap.includes("https://vogelconsultoria.com.ar/recursos/"), "sitemap.xml: missing resources index");
  assert(llms.includes("https://vogelconsultoria.com.ar/recursos/"), "llms.txt: missing resources index");
  for (const id of expectedResourceIds) {
    const url = `https://vogelconsultoria.com.ar/recursos/${id}/`;
    assert(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: missing ${url}`);
    assert(llms.includes(url), `llms.txt: missing ${url}`);
  }
}

function testNavbarServicesMenu() {
  const navbar = readProjectFile("src/components/Navbar.vue");

  assert(navbar.includes("serviceLinks"), "Navbar.vue: missing serviceLinks menu data");
  assert(navbar.includes('aria-label="Servicios"'), "Navbar.vue: missing accessible services menu label");
  assert(navbar.includes("Servicios"), "Navbar.vue: missing Servicios menu text");
  assert(navbar.includes("/recursos/"), "Navbar.vue: missing Recursos link");
  assert(navbar.includes("/automatizaciones/"), "Navbar.vue: missing Automatizaciones campaign link");

  for (const id of expectedServiceIds) {
    assert(navbar.includes("Object.values(servicePages)") && servicePages[id].path === `/${id}/`, `Navbar.vue: missing service menu link for ${id}`);
  }

  assert(navbar.includes("/inteligencia-artificial/"), "Navbar.vue: missing IA service menu link");
}

function testNavbarBrandAndCurrentState() {
  const navbar = readProjectFile("src/components/Navbar.vue");
  const iconFiles = [
    "agendar-diagnostico.svg?raw",
    "casos.svg?raw",
    "chevron-down.svg?raw",
    "como-trabajamos.svg?raw",
    "menu.svg?raw",
    "nosotros.svg?raw",
    "portal.svg?raw",
    "recursos.svg?raw",
    "servicios.svg?raw",
  ];

  for (const icon of iconFiles) {
    assert(navbar.includes(icon), `Navbar.vue: missing inline navigation icon ${icon}`);
  }

  assert(navbar.includes("aria-current"), "Navbar.vue: current route and section must be announced");
  assert(navbar.includes("requestAnimationFrame") && navbar.includes("cancelAnimationFrame"), "Navbar.vue: scroll tracking must be frame scheduled and cleaned up");
  assert(navbar.includes("vogel-v-amber.svg") && navbar.includes("is-scrolled"), "Navbar.vue: missing new brand or readable scrolling treatment");
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
  assert(analytics.includes("return \"whatsapp\""), "analytics.js: must avoid sending WhatsApp numbers to GA4");
  assert(analytics.includes("return \"email\""), "analytics.js: must avoid sending email addresses to GA4");
}

function testCommercialEmailDestination() {
  const ctaSection = readProjectFile("src/components/CTASection.vue");
  const footerSection = readProjectFile("src/components/FooterSection.vue");

  assert(
    ctaSection.includes("mailto:oscar@vogelconsultoria.com.ar?subject=Quiero%20agendar%20un%20diagn%C3%B3stico"),
    "CTASection.vue: Agendar por email must use oscar@vogelconsultoria.com.ar",
  );
  assert(footerSection.includes("mailto:oscar@vogelconsultoria.com.ar"), "FooterSection.vue: footer email must use oscar@vogelconsultoria.com.ar");
}

function testResourcesContent() {
  const app = readProjectFile("src/App.vue");
  const section = readProjectFile("src/components/HomeEvidence.vue");
  const resourceIndex = readProjectFile("recursos/index.html");

  assert(app.includes("ServicesSection") && readProjectFile("src/components/SecondaryContent.vue").includes('kind="resources"'), "home capabilities must include resource discovery");
  assert(section.includes("content_discovery"), "ResourcesSection.vue: resource links must be analytics-tagged");
  assert(resourceIndex.includes('<script type="module" src="/src/resources.js"></script>'), "recursos/index.html: missing resources entry script");

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

function testMiniCasesSection() {
  const app = readProjectFile("src/App.vue");
  const section = readProjectFile("src/components/MiniCasesSection.vue");
  const content = readProjectFile("src/data/forestCase.js");
  assert(section.includes("forestCase.steps"), "legacy forest case must consume the shared content");

  assert(app.includes("MiniCasesSection"), "App.vue: MiniCasesSection must be mounted on home");
  assert(content.includes("forestal"), "MiniCasesSection.vue: missing forestal rubro");
  assert(content.includes("Equipo, proceso, tiempos y producción"), "forest case must explain the recorded operational data");
  assert(content.includes("registro de campo"), "forest case must explain field collection");
  assert(content.includes("Indicadores, evolución y detalle operativo"), "forest case must explain decision support");
  assert(content.includes("Caso forestal anónimo"), "MiniCasesSection.vue: mini case must be explicitly anonymous");
}

function testPortalAccessLinks() {
  const navbar = readProjectFile("src/components/Navbar.vue");
  const hero = readProjectFile("src/components/HeroSection.vue");
  const portalUrl = "https://portal.vogelconsultoria.com.ar";

  assert(navbar.includes(portalUrl), "Navbar.vue: missing portal access link");
  assert(navbar.includes("Ingresar al portal"), "Navbar.vue: portal access link must be clearly labeled");
  assert(hero.includes("Explorar soluciones") && navbar.includes("Agendar diagnóstico"), "Hero and navbar must expose their agreed actions");
  assert(navbar.includes("navbar_portal_access"), "Navbar.vue: missing portal analytics");
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
  const survey=readProjectFile("src/SurveyApp.vue");
  assert(survey.includes("8000") && survey.includes('role="status"') && survey.includes("Abrir encuesta en otra pestaña"), "survey must expose accessible loading and a persistent external form link");
  assert(survey.includes("Correo de contacto") && survey.includes("opcional"), "survey copy must clarify that its email field is optional");
  const iaHero=readProjectFile("src/components/HeroIA.vue");
  const iaExamples=readProjectFile("src/components/UseCasesIA.vue");
  assert(iaHero.includes("ProcessFlowDiagram") && !iaHero.includes("ai-operations.webp"), "IA hero should use a Vogel process diagram");
  assert(!iaExamples.includes("ai-use-cases.webp"), "IA use cases should not use decorative mock UI artwork");
  assert(!readProjectFile("automatizaciones/index.html").includes("/src/assets/ia/ai-operations.webp"), "ARCA page should not use the generic blue artwork");
  assert(readProjectFile("automatizaciones/index.html").includes("hero-flow__list"), "ARCA page should use its own process diagram");
  const contact=readProjectFile("src/components/CTASection.vue");
  assert(contact.includes('type="tel" name="Telefono" autocomplete="tel"'), "contact phone must be a custom optional tel field");
  assert(!contact.includes('id="contacto-telefono" required'), "phone must remain optional");
  const proof=readProjectFile("src/components/ClientProof.vue");
  assert(proof.includes("webProjects"), "early proof must use the existing project catalogue");
  assert(readProjectFile("scripts/capture-landscape-poster.mjs").includes("toDataURL"), "Landscape poster must be exported from the canvas buffer, without HTML overlays");
  const provenance=JSON.parse(readProjectFile("public/clients/provenance.json"));
  for(const file of Object.keys(provenance.sources)) assert(fs.existsSync(path.join(root,"public/clients",file)), `missing local client logo ${file}`);
  for(const file of ["index.html","src/SurveyApp.vue",...expectedServiceIds.map(id=>`${id}/index.html`)]) {
    assert(!readProjectFile(file).includes("oscarvogel@gmail.com"), `${file}: inconsistent commercial email`);
  }
}

function testAboutCvSection() {
  const about = readProjectFile("src/components/AboutSection.vue");
  const navbar = readProjectFile("src/components/Navbar.vue");
  const footer = readProjectFile("src/components/FooterSection.vue");
  const cvPath = path.join(root, "public", "cv-jose-oscar-vogel.pdf");

  assert(about.includes('id="nosotros"'), "AboutSection.vue: section must present the personal profile");
  assert(about.includes("Tecnología con criterio de negocio") && about.includes("Oscar Vogel es desarrollador"), "AboutSection.vue: missing heading or named biography");
  assert(about.includes("Capacidades técnicas") && !about.includes('value: "Python, Django y MySQL"'), "AboutSection.vue: stack must be presented as a capability");
  assert(about.includes("/cv-jose-oscar-vogel.pdf"), "AboutSection.vue: missing CV download link");
  assert(about.includes("about_download_cv"), "AboutSection.vue: missing CV analytics marker");
  assert(navbar.includes("Nosotros"), "Navbar.vue: missing Quién soy navigation label");
  assert(footer.includes("Nosotros"), "FooterSection.vue: missing Quién soy footer link");
  assert(fs.existsSync(cvPath), "public/cv-jose-oscar-vogel.pdf: missing downloadable CV asset");
  assert(fs.statSync(cvPath).size > 5000, "public/cv-jose-oscar-vogel.pdf: CV asset looks unexpectedly small");
}

const tests = [
  ["service data", testServiceData],
  ["HTML entrypoints and JSON-LD", testHtmlEntrypoints],
  ["Vite inputs", testViteInputs],
  ["discovery files", testDiscoveryFiles],
  ["navbar services menu", testNavbarServicesMenu],
  ["navbar brand and current state", testNavbarBrandAndCurrentState],
  ["analytics event attributes", testAnalyticsEventAttributes],
  ["commercial email destination", testCommercialEmailDestination],
  ["resources content", testResourcesContent],
  ["mini cases section", testMiniCasesSection],
  ["portal access links", testPortalAccessLinks],
  ["about CV section", testAboutCvSection],
  ["UI refinements assets and contact", testUiRefinements],
];

for (const [name, test] of tests) {
  test();
  console.log(`ok - ${name}`);
}
