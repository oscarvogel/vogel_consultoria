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
  "desarrollo-web",
  "talleres-ia",
];

const servicePages = loadServicePagesForTest();

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
    webImage: "desarrollo-web.webp",
    talleresImage: "talleres-capacitacion-ia.webp",
    encodeURIComponent,
  };

  vm.createContext(context);
  vm.runInContext(`${source}\nresult = servicePages;`, context);
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
}

function testDiscoveryFiles() {
  const sitemap = readProjectFile("public/sitemap.xml");
  const llms = readProjectFile("public/llms.txt");
  const servicesSection = readProjectFile("src/components/ServicesSection.vue");

  for (const id of expectedServiceIds) {
    const url = `https://vogelconsultoria.com.ar/${id}/`;
    assert(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: missing ${url}`);
    assert(llms.includes(url), `llms.txt: missing ${url}`);
    assert(servicesSection.includes(`href: "/${id}/"`), `ServicesSection.vue: missing home link for ${id}`);
  }

  assert(servicesSection.includes('href: "/ia.html"'), "ServicesSection.vue: missing IA page link");
}

function testNavbarServicesMenu() {
  const navbar = readProjectFile("src/components/Navbar.vue");

  assert(navbar.includes("serviceLinks"), "Navbar.vue: missing serviceLinks menu data");
  assert(navbar.includes('aria-label="Servicios"'), "Navbar.vue: missing accessible services menu label");
  assert(navbar.includes("Servicios"), "Navbar.vue: missing Servicios menu text");

  for (const id of expectedServiceIds) {
    assert(navbar.includes(`href: "/${id}/"`), `Navbar.vue: missing service menu link for ${id}`);
  }

  assert(navbar.includes('href: "/ia.html"'), "Navbar.vue: missing IA service menu link");
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

const tests = [
  ["service data", testServiceData],
  ["HTML entrypoints and JSON-LD", testHtmlEntrypoints],
  ["Vite inputs", testViteInputs],
  ["discovery files", testDiscoveryFiles],
  ["navbar services menu", testNavbarServicesMenu],
  ["mini cases section", testMiniCasesSection],
];

for (const [name, test] of tests) {
  test();
  console.log(`ok - ${name}`);
}
