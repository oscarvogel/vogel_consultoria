# Tanda B Service Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build five SEO/GEO service pages for Vogel Consultoria with reusable Vue structure, static HTML entrypoints, metadata, schema, sitemap, llms.txt, and conversion-focused CTAs.

**Architecture:** Keep the current Vite multi-page pattern instead of adding a router. Store page content in `src/data/servicePages.js`, render all pages through `src/components/ServicePage.vue` and `src/service-page.js`, and create one HTML entry file per service directory.

**Tech Stack:** Vue 3, Vite multi-page build, Tailwind CSS, static JSON-LD, existing analytics helper.

---

## File Structure

- Create `src/data/servicePages.js`: canonical content source for all service pages.
- Create `src/components/ServicePage.vue`: reusable service page UI.
- Create `src/service-page.js`: Vue entrypoint that reads `data-service-id`.
- Create `sistemas-a-medida/index.html`, `dashboards-ejecutivos/index.html`, `automatizacion-de-procesos/index.html`, `desarrollo-web/index.html`, `talleres-ia/index.html`: static entrypoints with page-specific metadata and fallback content.
- Modify `vite.config.js`: add five Rollup HTML inputs.
- Modify `src/components/ServicesSection.vue`: add links from service cards to new URLs.
- Modify `public/sitemap.xml`: include five service URLs.
- Modify `public/llms.txt`: include the five service pages and short summaries.
- Modify `src/style.css` only if the service layout needs a shared utility after implementation.

---

### Task 1: Add Central Service Page Data

**Files:**
- Create: `src/data/servicePages.js`

- [ ] **Step 1: Create the service page data module**

Use this shape exactly so the page component, HTML templates, and schema checks can rely on stable keys:

```js
import sistemasImage from "../assets/services/cards/sistemas-a-medida.webp";
import dashboardsImage from "../assets/services/cards/dashboards-ejecutivos.webp";
import automatizacionImage from "../assets/services/cards/automatizacion-procesos.webp";
import webImage from "../assets/services/cards/desarrollo-web.webp";
import talleresImage from "../assets/services/cards/talleres-capacitacion-ia.webp";

const siteUrl = "https://vogelconsultoria.com.ar";
const whatsappBase = "https://wa.me/543743667526";

function whatsappUrl(message) {
  return `${whatsappBase}?text=${encodeURIComponent(message)}`;
}

export const servicePages = {
  "sistemas-a-medida": {
    id: "sistemas-a-medida",
    path: "/sistemas-a-medida/",
    eyebrow: "Sistemas a medida",
    title: "Sistemas a medida para empresas en Argentina",
    shortTitle: "Sistemas a medida",
    metaTitle: "Sistemas a Medida para Empresas en Argentina | Vogel Consultoria",
    metaDescription:
      "Desarrollamos sistemas a medida para ordenar procesos, integrar informacion y mejorar trazabilidad operativa en empresas argentinas.",
    summary:
      "Vogel Consultoria desarrolla sistemas a medida para empresas que necesitan ordenar procesos, conectar areas y dejar de depender de planillas dispersas.",
    image: sistemasImage,
    imageAlt: "Panel digital para sistemas a medida y trazabilidad de procesos",
    ctaLabel: "Consultar por un sistema",
    ctaUrl: whatsappUrl("Hola Vogel Consultoria, quiero consultar por un sistema a medida para mi empresa."),
    problems: [
      "Procesos criticos repartidos entre planillas, mensajes y sistemas que no se hablan.",
      "Falta de trazabilidad para saber quien hizo que, cuando y con que datos.",
      "Reportes manuales que consumen tiempo y llegan tarde para decidir.",
    ],
    includes: [
      "Relevamiento del flujo real de trabajo y usuarios involucrados.",
      "Diseno de pantallas, permisos, datos y reportes necesarios.",
      "Desarrollo progresivo con validaciones y ajustes sobre casos reales.",
      "Documentacion basica y acompanamiento para adopcion interna.",
    ],
    process: [
      "Diagnostico del circuito actual y puntos de friccion.",
      "Prototipo funcional de los flujos principales.",
      "Implementacion por modulos para reducir riesgo operativo.",
      "Puesta en marcha, ajustes y soporte inicial.",
    ],
    deliverables: ["Aplicacion web o interna", "Modelo de datos", "Reportes operativos", "Usuarios y permisos"],
    faqs: [
      {
        question: "Cuanto tarda desarrollar un sistema a medida?",
        answer:
          "Depende del alcance, pero conviene empezar con un modulo minimo util. Muchos proyectos pueden iniciar con una primera version operativa en semanas y luego crecer por etapas.",
      },
      {
        question: "Se puede integrar con sistemas existentes?",
        answer:
          "Si. Primero se revisa que datos existen, como se accede a ellos y que nivel de integracion es seguro y conveniente para la operacion.",
      },
      {
        question: "Necesito tener todo definido antes de empezar?",
        answer:
          "No. El trabajo comienza con diagnostico y priorizacion para convertir necesidades operativas en un alcance implementable.",
      },
    ],
    related: ["dashboards-ejecutivos", "automatizacion-de-procesos", "desarrollo-web"],
  },
  "dashboards-ejecutivos": {
    id: "dashboards-ejecutivos",
    path: "/dashboards-ejecutivos/",
    eyebrow: "Dashboards ejecutivos",
    title: "Dashboards ejecutivos para PYMEs en Argentina",
    shortTitle: "Dashboards ejecutivos",
    metaTitle: "Dashboards Ejecutivos para PYMEs en Argentina | Vogel Consultoria",
    metaDescription:
      "Disenamos dashboards ejecutivos para integrar ventas, stock, costos y rentabilidad en indicadores claros para decidir mejor.",
    summary:
      "Vogel Consultoria crea dashboards ejecutivos para convertir datos dispersos en indicadores claros, comparables y accionables.",
    image: dashboardsImage,
    imageAlt: "Dashboard ejecutivo con graficos e indicadores de negocio",
    ctaLabel: "Quiero un dashboard",
    ctaUrl: whatsappUrl("Hola Vogel Consultoria, quiero consultar por un dashboard ejecutivo para mi empresa."),
    problems: [
      "La informacion existe, pero esta dispersa entre planillas, sistemas y reportes manuales.",
      "Los indicadores llegan tarde o con diferencias entre areas.",
      "La direccion no tiene una vista clara de ventas, stock, costos o rentabilidad.",
    ],
    includes: [
      "Definicion de KPIs relevantes para la direccion.",
      "Integracion de fuentes disponibles: Excel, bases de datos o sistemas existentes.",
      "Visualizaciones claras para seguimiento periodico.",
      "Alertas o cortes por periodo, sucursal, vendedor, producto o unidad de negocio cuando aplica.",
    ],
    process: [
      "Seleccion de indicadores y preguntas de negocio.",
      "Revision de fuentes y calidad de datos.",
      "Construccion del tablero inicial.",
      "Ajuste con usuarios y entrega de version operativa.",
    ],
    deliverables: ["Tablero ejecutivo", "KPIs documentados", "Filtros de analisis", "Rutina de actualizacion"],
    faqs: [
      {
        question: "Que datos necesito para empezar un dashboard?",
        answer:
          "Alcanza con identificar las fuentes actuales y las decisiones que se quieren mejorar. Pueden ser planillas, bases de datos o exportaciones de sistemas existentes.",
      },
      {
        question: "El dashboard se actualiza automaticamente?",
        answer:
          "Puede automatizarse si las fuentes lo permiten. Cuando no conviene automatizar todo al inicio, se define una rutina simple y confiable de actualizacion.",
      },
      {
        question: "Sirve para empresas chicas?",
        answer:
          "Si. Un dashboard bien acotado ayuda especialmente cuando la empresa crece y las decisiones ya no pueden depender solo de intuicion o planillas aisladas.",
      },
    ],
    related: ["automatizacion-de-procesos", "sistemas-a-medida", "talleres-ia"],
  },
  "automatizacion-de-procesos": {
    id: "automatizacion-de-procesos",
    path: "/automatizacion-de-procesos/",
    eyebrow: "Automatizacion de procesos",
    title: "Automatizacion de procesos para empresas",
    shortTitle: "Automatizacion de procesos",
    metaTitle: "Automatizacion de Procesos para Empresas | Vogel Consultoria",
    metaDescription:
      "Automatizamos tareas administrativas y operativas para reducir carga manual, errores repetitivos y demoras entre areas.",
    summary:
      "Vogel Consultoria automatiza procesos administrativos y operativos para que los equipos reduzcan tareas repetitivas y trabajen con informacion mas confiable.",
    image: automatizacionImage,
    imageAlt: "Flujo digital de automatizacion de procesos empresariales",
    ctaLabel: "Automatizar un proceso",
    ctaUrl: whatsappUrl("Hola Vogel Consultoria, quiero evaluar la automatizacion de un proceso de mi empresa."),
    problems: [
      "Carga manual repetida en varias herramientas.",
      "Errores por copiar y pegar informacion entre planillas, correos y sistemas.",
      "Demoras porque una tarea depende de avisos o controles manuales.",
    ],
    includes: [
      "Mapa simple del proceso actual y sus puntos de perdida de tiempo.",
      "Priorizacion de automatizaciones por impacto y esfuerzo.",
      "Implementacion de integraciones, alertas, reportes o asistentes internos segun el caso.",
      "Validacion con usuarios para evitar automatizar pasos mal definidos.",
    ],
    process: [
      "Detectar tareas repetitivas y reglas de negocio.",
      "Elegir un flujo acotado para automatizar primero.",
      "Construir y probar con datos reales.",
      "Medir ahorro de tiempo, errores evitados y ajustes necesarios.",
    ],
    deliverables: ["Mapa del proceso", "Automatizacion funcional", "Reglas documentadas", "Indicadores de seguimiento"],
    faqs: [
      {
        question: "Que procesos conviene automatizar primero?",
        answer:
          "Los mejores candidatos son repetitivos, tienen reglas claras y generan costo cuando se hacen tarde o con errores.",
      },
      {
        question: "Automatizar reemplaza al equipo?",
        answer:
          "El objetivo es liberar tiempo de tareas mecanicas para que el equipo pueda controlar, analizar y resolver casos que requieren criterio.",
      },
      {
        question: "Se puede automatizar si usamos Excel?",
        answer:
          "Si. Muchas automatizaciones empiezan conectando planillas existentes y ordenando el flujo antes de pasar a sistemas mas completos.",
      },
    ],
    related: ["dashboards-ejecutivos", "sistemas-a-medida", "talleres-ia"],
  },
  "desarrollo-web": {
    id: "desarrollo-web",
    path: "/desarrollo-web/",
    eyebrow: "Desarrollo web",
    title: "Desarrollo web profesional en Argentina",
    shortTitle: "Desarrollo web",
    metaTitle: "Desarrollo Web Profesional en Argentina | Vogel Consultoria",
    metaDescription:
      "Creamos sitios web institucionales y comerciales con diseno responsive, estructura clara, SEO tecnico y foco en conversion.",
    summary:
      "Vogel Consultoria desarrolla sitios web profesionales para empresas que necesitan presentar servicios, generar confianza y facilitar el contacto comercial.",
    image: webImage,
    imageAlt: "Sitio web profesional responsive orientado a conversion",
    ctaLabel: "Quiero mejorar mi web",
    ctaUrl: whatsappUrl("Hola Vogel Consultoria, quiero consultar por desarrollo o mejora de una pagina web."),
    problems: [
      "El sitio actual no explica claramente que ofrece la empresa.",
      "La experiencia en celular no acompana la forma en que consultan los clientes.",
      "Faltan estructura SEO, llamadas a la accion y contenido confiable.",
    ],
    includes: [
      "Arquitectura de informacion orientada a servicios y conversion.",
      "Diseno responsive alineado a la marca.",
      "Implementacion tecnica con buenas practicas de velocidad y SEO.",
      "Integracion de contacto, WhatsApp, formularios o contenido administrable cuando aplica.",
    ],
    process: [
      "Definir objetivos comerciales y paginas necesarias.",
      "Ordenar contenido y jerarquia visual.",
      "Implementar la web y revisar en desktop/mobile.",
      "Publicar, medir y ajustar mensajes clave.",
    ],
    deliverables: ["Sitio responsive", "Metadatos SEO", "Formulario o CTA", "Publicacion en hosting"],
    faqs: [
      {
        question: "Pueden mejorar una web existente?",
        answer:
          "Si. Primero se audita la estructura actual y se decide si conviene ajustar, redisenar por partes o reconstruir con una base mas mantenible.",
      },
      {
        question: "La web queda preparada para Google?",
        answer:
          "Se implementan bases tecnicas de SEO, metadatos, estructura semantica y velocidad. El posicionamiento tambien depende del contenido, autoridad y competencia.",
      },
      {
        question: "Puedo sumar nuevas paginas despues?",
        answer:
          "Si. La estructura se plantea para crecer con nuevos servicios, casos, recursos o landing pages especificas.",
      },
    ],
    related: ["sistemas-a-medida", "dashboards-ejecutivos", "automatizacion-de-procesos"],
  },
  "talleres-ia": {
    id: "talleres-ia",
    path: "/talleres-ia/",
    eyebrow: "Talleres IA",
    title: "Talleres de IA para empresas y equipos",
    shortTitle: "Talleres IA",
    metaTitle: "Talleres de IA para Empresas y Equipos | Vogel Consultoria",
    metaDescription:
      "Capacitaciones practicas de inteligencia artificial para equipos que quieren aplicar IA con criterio, seguridad y utilidad real.",
    summary:
      "Vogel Consultoria dicta talleres practicos de IA para que equipos y lideres identifiquen usos reales, riesgos y formas responsables de adopcion.",
    image: talleresImage,
    imageAlt: "Capacitacion practica de inteligencia artificial para equipos",
    ctaLabel: "Consultar por un taller",
    ctaUrl: whatsappUrl("Hola Vogel Consultoria, quiero consultar por un taller de IA para mi equipo."),
    problems: [
      "El equipo usa IA de manera aislada, sin criterios comunes.",
      "Hay interes por aplicar IA pero no esta claro donde aporta valor.",
      "Faltan pautas para cuidar datos, revisar resultados y evitar usos riesgosos.",
    ],
    includes: [
      "Introduccion practica adaptada al rubro y nivel del equipo.",
      "Ejercicios con tareas reales de administracion, ventas, analisis o soporte.",
      "Criterios de uso responsable, validacion y proteccion de informacion.",
      "Mapa inicial de oportunidades de IA para seguir trabajando.",
    ],
    process: [
      "Relevar perfil del equipo y objetivos del taller.",
      "Preparar ejemplos cercanos al trabajo real.",
      "Dictar la capacitacion con ejercicios guiados.",
      "Cerrar con oportunidades priorizadas y proximos pasos.",
    ],
    deliverables: ["Taller practico", "Material de apoyo", "Ejercicios aplicados", "Mapa de oportunidades"],
    faqs: [
      {
        question: "El equipo necesita conocimientos tecnicos?",
        answer:
          "No. Los talleres se adaptan al nivel del grupo y priorizan usos practicos, criterios de validacion y formas seguras de trabajo.",
      },
      {
        question: "Puede ser para un area especifica?",
        answer:
          "Si. Puede orientarse a administracion, ventas, direccion, estudios contables, soporte u otros equipos con tareas concretas.",
      },
      {
        question: "Incluye herramientas concretas?",
        answer:
          "Si, pero el foco no es una herramienta aislada. Se trabaja sobre criterios, casos de uso y buenas practicas transferibles.",
      },
    ],
    related: ["automatizacion-de-procesos", "dashboards-ejecutivos", "sistemas-a-medida"],
  },
};

export function getServicePage(id) {
  return servicePages[id] || null;
}

export function getRelatedServices(page) {
  return page.related.map((id) => servicePages[id]).filter(Boolean);
}

export function getServiceUrl(path) {
  return `${siteUrl}${path}`;
}
```

- [ ] **Step 2: Run a syntax check**

Run: `node --check src/data/servicePages.js`

Expected: exits 0 with no output.

- [ ] **Step 3: Commit**

Run:

```bash
git add src/data/servicePages.js
git commit -m "feat: add service page content data"
```

---

### Task 2: Build Reusable Service Page Component

**Files:**
- Create: `src/components/ServicePage.vue`
- Create: `src/service-page.js`

- [ ] **Step 1: Create `src/components/ServicePage.vue`**

Implement a complete page using the existing visual system. The component must accept a `page` prop and render hero, problems, includes, process, deliverables, FAQ, related services, and final CTA.

Key implementation requirements:

```vue
<script setup>
import { computed } from "vue";
import { getRelatedServices } from "../data/servicePages.js";
import FooterSection from "./FooterSection.vue";
import WhatsAppButton from "./WhatsAppButton.vue";

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});

const relatedServices = computed(() => getRelatedServices(props.page));
</script>
```

The template must include:

- `<a href="/" ...>Volver al sitio principal</a>`
- one `<h1>{{ page.title }}</h1>`
- hero image with `:alt="page.imageAlt"`
- CTA anchor with `:href="page.ctaUrl"` and analytics attributes:

```vue
<a
  :href="page.ctaUrl"
  class="..."
  target="_blank"
  rel="noopener noreferrer"
  data-analytics-event="whatsapp_click"
  :data-analytics-label="page.id"
  data-analytics-location="service_page"
>
  {{ page.ctaLabel }}
</a>
```

- FAQ section using native `<details>` / `<summary>` for accessibility.
- related service links using `service.path` and `service.shortTitle`.
- `<FooterSection />` and `<WhatsAppButton />` at the bottom.

- [ ] **Step 2: Create `src/service-page.js`**

```js
import { createApp } from "vue";
import ServicePage from "./components/ServicePage.vue";
import { getServicePage } from "./data/servicePages.js";
import { initAnalytics } from "./lib/analytics.js";
import "./style.css";

const root = document.getElementById("service-app");
const serviceId = root?.dataset.serviceId;
const page = getServicePage(serviceId);

initAnalytics();

if (root && page) {
  createApp(ServicePage, { page }).mount(root);
}
```

- [ ] **Step 3: Run build to catch component errors**

Run: `npm run build`

Expected: build passes. At this point there are no new HTML inputs yet, so this only validates imports.

- [ ] **Step 4: Commit**

Run:

```bash
git add src/components/ServicePage.vue src/service-page.js
git commit -m "feat: add reusable service page component"
```

---

### Task 3: Add Static HTML Entrypoints and Vite Inputs

**Files:**
- Create: `sistemas-a-medida/index.html`
- Create: `dashboards-ejecutivos/index.html`
- Create: `automatizacion-de-procesos/index.html`
- Create: `desarrollo-web/index.html`
- Create: `talleres-ia/index.html`
- Modify: `vite.config.js`

- [ ] **Step 1: Create the five HTML files**

Each file must include:

```html
<div id="service-app" data-service-id="SERVICE_ID"></div>
<script type="module" src="/src/service-page.js"></script>
```

Each file must also include page-specific:

- `<title>`
- `meta name="description"`
- canonical URL
- OG/Twitter metadata
- JSON-LD for `ProfessionalService`, `WebPage`, `Service`, `FAQPage`, and `BreadcrumbList`
- `<noscript>` with H1, summary, service bullets, FAQ, and contact link

Use the approved URLs and titles from the spec.

- [ ] **Step 2: Update Vite inputs**

Modify `vite.config.js`:

```js
input: {
  main: "index.html",
  ia: "ia.html",
  sistemas: "sistemas-a-medida/index.html",
  dashboards: "dashboards-ejecutivos/index.html",
  automatizacion: "automatizacion-de-procesos/index.html",
  web: "desarrollo-web/index.html",
  talleres: "talleres-ia/index.html",
},
```

- [ ] **Step 3: Build and verify dist pages exist**

Run:

```bash
npm run build
Test-Path dist\sistemas-a-medida\index.html
Test-Path dist\dashboards-ejecutivos\index.html
Test-Path dist\automatizacion-de-procesos\index.html
Test-Path dist\desarrollo-web\index.html
Test-Path dist\talleres-ia\index.html
```

Expected: build passes and every `Test-Path` prints `True`.

- [ ] **Step 4: Commit**

Run:

```bash
git add vite.config.js sistemas-a-medida/index.html dashboards-ejecutivos/index.html automatizacion-de-procesos/index.html desarrollo-web/index.html talleres-ia/index.html
git commit -m "feat: add static service page entrypoints"
```

---

### Task 4: Link Service Pages from Home and Update Discovery Files

**Files:**
- Modify: `src/components/ServicesSection.vue`
- Modify: `public/sitemap.xml`
- Modify: `public/llms.txt`

- [ ] **Step 1: Add service paths to home cards**

In `src/components/ServicesSection.vue`, add `href` to the five service objects and `/ia.html` to the IA card:

```js
href: "/sistemas-a-medida/",
href: "/dashboards-ejecutivos/",
href: "/automatizacion-de-procesos/",
href: "/ia.html",
href: "/talleres-ia/",
href: "/desarrollo-web/",
```

Change the card wrapper from `<article>` to a semantic link/card structure. The whole visual card should be clickable:

```vue
<a
  v-for="(service, i) in services"
  :key="service.title"
  :href="service.href"
  class="card-hover reveal group relative isolate min-h-[220px] overflow-hidden p-0"
  :class="[`reveal-d${(i % 3) + 1}`]"
>
  ...
</a>
```

Keep the visual style stable.

- [ ] **Step 2: Link the web block**

In the development web block, add a visible CTA link to `/desarrollo-web/` below the highlights:

```vue
<a href="/desarrollo-web/" class="...">
  Ver servicio de desarrollo web
</a>
```

- [ ] **Step 3: Update sitemap**

Add the five URLs to `public/sitemap.xml` with the current date:

```xml
<url>
  <loc>https://vogelconsultoria.com.ar/dashboards-ejecutivos/</loc>
  <lastmod>2026-05-21</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.80</priority>
</url>
```

Repeat for all five service pages.

- [ ] **Step 4: Update llms.txt**

Add the five URLs under `## Sitio` and add one short service summary per page under `## Servicios principales`.

- [ ] **Step 5: Build**

Run: `npm run build`

Expected: build passes.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/components/ServicesSection.vue public/sitemap.xml public/llms.txt
git commit -m "feat: link and expose service pages"
```

---

### Task 5: Validate JSON-LD, Preview Routes, and Visual Layout

**Files:**
- No source changes expected unless validation finds issues.

- [ ] **Step 1: Validate JSON-LD blocks**

Run a script that reads the five HTML files and parses each `application/ld+json` block:

```powershell
@'
from html.parser import HTMLParser
import json
from pathlib import Path

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_json = False
        self.blocks = []
        self.current = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_json = True
            self.current = []
    def handle_data(self, data):
        if self.in_json:
            self.current.append(data)
    def handle_endtag(self, tag):
        if tag == "script" and self.in_json:
            self.blocks.append("".join(self.current))
            self.in_json = False

for file in [
    "sistemas-a-medida/index.html",
    "dashboards-ejecutivos/index.html",
    "automatizacion-de-procesos/index.html",
    "desarrollo-web/index.html",
    "talleres-ia/index.html",
]:
    parser = Parser()
    parser.feed(Path(file).read_text(encoding="utf-8"))
    assert parser.blocks, f"{file}: no JSON-LD found"
    for block in parser.blocks:
        json.loads(block)
    print(f"{file}: {len(parser.blocks)} JSON-LD block(s) OK")
'@ | python -
```

Expected: all five files print `OK`.

- [ ] **Step 2: Start preview**

Run: `npm run preview -- --host 127.0.0.1 --port 4173`

Expected: preview is available at `http://127.0.0.1:4173/`.

- [ ] **Step 3: Check routes**

Run:

```powershell
foreach ($path in "/", "/sistemas-a-medida/", "/dashboards-ejecutivos/", "/automatizacion-de-procesos/", "/desarrollo-web/", "/talleres-ia/", "/llms.txt", "/sitemap.xml") {
  $status = (Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:4173$path").StatusCode
  "$path $status"
}
```

Expected: every route returns `200`.

- [ ] **Step 4: Capture visual checks**

Use Chrome or the available browser tool to capture:

- desktop `http://127.0.0.1:4173/dashboards-ejecutivos/`
- mobile `http://127.0.0.1:4173/dashboards-ejecutivos/`
- desktop `http://127.0.0.1:4173/desarrollo-web/`

Expected: no horizontal overflow, hero content visible, CTAs readable, FAQ usable, related service cards not clipped.

- [ ] **Step 5: Commit fixes if needed**

If validation finds issues, fix only the failing files and commit:

```bash
git add <fixed-files>
git commit -m "fix: polish service page validation"
```

---

### Task 6: Final Branch Verification and Push

**Files:**
- No source changes expected.

- [ ] **Step 1: Final build**

Run: `npm run build`

Expected: build passes.

- [ ] **Step 2: Confirm git status**

Run: `git status --short --branch`

Expected: clean branch `codex/vogel-tanda-b`.

- [ ] **Step 3: Push branch**

Run:

```bash
git push -u origin codex/vogel-tanda-b
```

Expected: branch is pushed and ready to merge after review.

---

## Self-Review

- Spec coverage: the plan covers reusable layout, five pages, metadata, schema, sitemap, llms.txt, home links, analytics, accessibility, and verification.
- Red-flag scan: no incomplete markers are present.
- Type consistency: `id`, `path`, `shortTitle`, `ctaUrl`, `faqs`, and `related` are defined in Task 1 and consumed consistently in subsequent tasks.
