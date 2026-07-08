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

  const context = {
    sistemasImage: "sistemas-a-medida.webp",
    dashboardsImage: "dashboards-ejecutivos.webp",
    automatizacionImage: "automatizacion-procesos.webp",
    contaflowImage: "contaflow-api-facturacion-electronica.webp",
    webImage: "desarrollo-web.webp",
    talleresImage: "talleres-capacitacion-ia.webp",
    encodeURIComponent,
  };

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
    assert(servicesSection.includes(`href: "/${id}/"`), `ServicesSection.vue: missing home link for ${id}`);
  }

  assert(servicesSection.includes('href: "/inteligencia-artificial/"'), "ServicesSection.vue: missing IA page link");
  assert(
    servicesSection.includes("API de facturacion electronica para desarrolladores"),
    "ServicesSection.vue: missing ContaFlow service card copy",
  );
  assert(servicesSection.includes('href="/automatizaciones/"'), "ServicesSection.vue: missing home link for automatizaciones campaign");
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
  assert(navbar.includes('href: "/recursos/"'), "Navbar.vue: missing Recursos link");
  assert(navbar.includes('href: "/automatizaciones/"'), "Navbar.vue: missing Automatizaciones campaign link");

  for (const id of expectedServiceIds) {
    assert(navbar.includes(`href: "/${id}/"`), `Navbar.vue: missing service menu link for ${id}`);
  }

  assert(navbar.includes('href: "/inteligencia-artificial/"'), "Navbar.vue: missing IA service menu link");
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
    ctaSection.includes("mailto:oscar@vogelconsultoria.com.ar?subject=Quiero%20agendar%20una%20reuni%C3%B3n"),
    "CTASection.vue: Agendar por email must use oscar@vogelconsultoria.com.ar",
  );
  assert(footerSection.includes("mailto:oscar@vogelconsultoria.com.ar"), "FooterSection.vue: footer email must use oscar@vogelconsultoria.com.ar");
}

function testResourcesContent() {
  const app = readProjectFile("src/App.vue");
  const section = readProjectFile("src/components/ResourcesSection.vue");
  const resourceIndex = readProjectFile("recursos/index.html");

  assert(app.includes("ResourcesSection"), "App.vue: ResourcesSection must be mounted on home");
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

  assert(app.includes("MiniCasesSection"), "App.vue: MiniCasesSection must be mounted on home");
  assert(section.includes("Forestal"), "MiniCasesSection.vue: missing forestal rubro");
  assert(section.includes("falta de datos de produccion"), "MiniCasesSection.vue: missing production data problem");
  assert(section.includes("recoleccion de datos en campo"), "MiniCasesSection.vue: missing field data collection solution");
  assert(section.includes("dashboards interactivos"), "MiniCasesSection.vue: missing interactive dashboards result");
  assert(section.includes("Caso anonimo"), "MiniCasesSection.vue: mini case must be explicitly anonymous");
}

function testPortalAccessLinks() {
  const navbar = readProjectFile("src/components/Navbar.vue");
  const hero = readProjectFile("src/components/HeroSection.vue");
  const portalUrl = "https://portal.vogelconsultoria.com.ar";

  assert(navbar.includes(portalUrl), "Navbar.vue: missing portal access link");
  assert(navbar.includes("Ingresar al portal"), "Navbar.vue: portal access link must be clearly labeled");
  assert(hero.includes(portalUrl), "HeroSection.vue: missing portal access CTA");
  assert(hero.includes("Ingresar al portal"), "HeroSection.vue: portal access CTA must be clearly labeled");
}

function testAboutCvSection() {
  const about = readProjectFile("src/components/AboutSection.vue");
  const navbar = readProjectFile("src/components/Navbar.vue");
  const footer = readProjectFile("src/components/FooterSection.vue");
  const cvPath = path.join(root, "public", "cv-jose-oscar-vogel.pdf");

  assert(about.includes('eyebrow="Quién soy"'), "AboutSection.vue: section must present the personal profile");
  assert(about.includes("Oscar Vogel, tecnología con criterio de negocio"), "AboutSection.vue: missing personal heading");
  assert(about.includes("/cv-jose-oscar-vogel.pdf"), "AboutSection.vue: missing CV download link");
  assert(about.includes("about_download_cv"), "AboutSection.vue: missing CV analytics marker");
  assert(navbar.includes("Quién soy"), "Navbar.vue: missing Quién soy navigation label");
  assert(footer.includes("Quién soy"), "FooterSection.vue: missing Quién soy footer link");
  assert(fs.existsSync(cvPath), "public/cv-jose-oscar-vogel.pdf: missing downloadable CV asset");
  assert(fs.statSync(cvPath).size > 5000, "public/cv-jose-oscar-vogel.pdf: CV asset looks unexpectedly small");
}

const tests = [
  ["service data", testServiceData],
  ["HTML entrypoints and JSON-LD", testHtmlEntrypoints],
  ["Vite inputs", testViteInputs],
  ["discovery files", testDiscoveryFiles],
  ["navbar services menu", testNavbarServicesMenu],
  ["analytics event attributes", testAnalyticsEventAttributes],
  ["commercial email destination", testCommercialEmailDestination],
  ["resources content", testResourcesContent],
  ["mini cases section", testMiniCasesSection],
  ["portal access links", testPortalAccessLinks],
  ["about CV section", testAboutCvSection],
];

for (const [name, test] of tests) {
  test();
  console.log(`ok - ${name}`);
}
