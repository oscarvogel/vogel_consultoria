# Vogel Tanda A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Vogel's current site foundation by fixing the event modal experience, optimizing public images, strengthening SEO/GEO metadata, adding `llms.txt`, and improving no-JavaScript fallback content.

**Architecture:** Keep the current Vue 3 + Vite + Tailwind architecture. Make localized changes in the modal component, entry HTML files, and public assets; avoid new dependencies and avoid redesigning the home page.

**Tech Stack:** Vue 3, Vite 5, Tailwind CSS, Sharp, static HTML entry files.

---

## Files

- Modify: `src/components/EventModal.vue`
  - Owns the promotional event modal, Escape handling, visibility, expiry, and responsive layout.
- Modify: `src/components/EventProgramSection.vue`
  - Owns the visible event section copy; only text accents/tildes are in scope.
- Modify: `index.html`
  - Owns home SEO metadata, JSON-LD, and `noscript` fallback.
- Modify: `ia.html`
  - Owns IA page SEO metadata, JSON-LD, and `noscript` fallback.
- Create: `public/llms.txt`
  - Provides AI crawler-friendly site summary and canonical URLs.
- Modify: `public/og-image.png`, `public/og-ia.png`, `public/logo-vogel.png`
  - Optimized public preview/logo assets.
- Optional Modify: `.gitignore`
  - Add `.superpowers/` only if the current untracked brainstorming folder should stay local.

## Task 1: Modal Expiry And Responsive Accessibility

**Files:**
- Modify: `src/components/EventModal.vue`

- [ ] **Step 1: Replace the modal script with expiry, focus, and Escape handling**

Use this implementation:

```vue
<script setup>
import { nextTick, onMounted, onUnmounted, shallowRef } from "vue";

const emit = defineEmits(["close", "showProgram"]);

const EVENT_EXPIRES_AT = new Date("2026-05-28T00:00:00-03:00");
const isVisible = shallowRef(false);
const modalRef = shallowRef(null);
let previousActiveElement = null;

function shouldShowModal() {
  return new Date() < EVENT_EXPIRES_AT;
}

function restoreFocus() {
  if (previousActiveElement instanceof HTMLElement) {
    previousActiveElement.focus({ preventScroll: true });
  }
}

function closeModal() {
  if (!isVisible.value) return;
  isVisible.value = false;
  emit("close");
  nextTick(restoreFocus);
}

function showProgram() {
  if (!isVisible.value) return;
  isVisible.value = false;
  emit("showProgram");
  nextTick(restoreFocus);
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

onMounted(async () => {
  if (!shouldShowModal()) return;

  previousActiveElement = document.activeElement;
  isVisible.value = true;
  document.addEventListener("keydown", handleKeydown);
  await nextTick();
  modalRef.value?.focus({ preventScroll: true });
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>
```

- [ ] **Step 2: Update the overlay/article markup**

Keep the existing content, but change the outer wrapper and article to:

```vue
<div
  v-if="isVisible"
  class="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto overflow-x-hidden bg-vogel-navy/85 px-4 py-5 backdrop-blur-md sm:items-center sm:py-10"
  role="dialog"
  aria-modal="true"
  aria-labelledby="event-modal-title"
  aria-describedby="event-modal-description"
  tabindex="-1"
  ref="modalRef"
>
  <button
    type="button"
    class="fixed inset-0 cursor-default"
    aria-label="Cerrar aviso de charla"
    @click="closeModal"
  ></button>

  <article class="relative my-auto w-full max-w-[min(48rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-vogel-amber/35 bg-vogel-deep shadow-glow-lg sm:rounded-[2rem]">
```

Keep the close button, logo column, content and action buttons inside the article.

- [ ] **Step 3: Tighten mobile text/button layout**

Inside `EventModal.vue`, adjust these classes:

```vue
<div class="p-5 sm:p-8 lg:p-10">
```

```vue
<h2 id="event-modal-title" class="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
  IA para Profesionales en Ciencias Económicas
</h2>
```

```vue
<p id="event-modal-description" class="mt-4 text-sm leading-relaxed text-vogel-gray sm:text-base">
  Un encuentro práctico para contadores matriculados en el CPCEM: NotebookLM, Codex, Excel/Copilot y criterios de uso responsable en estudios contables.
</p>
```

```vue
<dd class="text-base font-semibold leading-snug text-white sm:text-lg">
```

```vue
<div class="mt-7 flex flex-col gap-3 sm:flex-row">
```

Ensure the second action link has centered text:

```vue
class="inline-flex items-center justify-center rounded-full border border-vogel-gray/35 px-5 py-3 text-center text-sm font-semibold text-vogel-gray transition hover:border-vogel-amber hover:text-vogel-amber"
```

- [ ] **Step 4: Fix modal accent text**

Replace:

```text
Modalidad hibrida para contadores matriculados en el CPCEM.
IA para Profesionales en Ciencias Economicas
Un encuentro practico...
```

With:

```text
Modalidad híbrida para contadores matriculados en el CPCEM.
IA para Profesionales en Ciencias Económicas
Un encuentro práctico...
```

- [ ] **Step 5: Run build check**

Run:

```powershell
npm run build
```

Expected: Vite build exits `0`.

## Task 2: Event Section Copy Polish

**Files:**
- Modify: `src/components/EventProgramSection.vue`

- [ ] **Step 1: Correct Spanish accents in event section constants**

Update the affected strings:

```js
const programBlocks = [
  {
    title: "Panorama 2026",
    description: "IA aplicada al trabajo profesional contable: modelos más capaces, contexto largo, multimodalidad, herramientas integradas y agentes.",
  },
  {
    title: "Método profesional",
    description: "Prompts con rol, contexto, fuentes, formato de salida, restricciones y checklist de verificación para no perder control.",
  },
  {
    title: "NotebookLM para contadores",
    description: "Cuadernos con leyes, instructivos, PDFs, estados contables, actas y material del cliente; consultas con citas, briefing, FAQ y tablas.",
  },
  {
    title: "Laboratorio NotebookLM",
    description: "De carpeta documental a informe: resumen ejecutivo, temas pendientes, preguntas para el cliente y tabla de acciones exportable.",
  },
  {
    title: "Codex y agentes",
    description: "Del prompt a la tarea ejecutada: scripts, limpieza de datos, análisis de archivos, dashboards, reportes repetibles y evidencia verificable.",
  },
  {
    title: "Riesgos y gobierno de IA",
    description: "Datos fiscales, secreto profesional, permisos, trazabilidad, sesgos, alucinaciones, revisión humana y política interna mínima.",
  },
];
```

Update the `SectionHeading` description:

```vue
description="Encuentro híbrido para matriculados en el CPCEM, con herramientas prácticas para documentación, planillas, reportes y automatizaciones controladas."
```

Update the contact CTA text:

```vue
Consultar inscripción
```

- [ ] **Step 2: Run build check**

Run:

```powershell
npm run build
```

Expected: Vite build exits `0`.

## Task 3: JSON-LD And Noscript Fallbacks

**Files:**
- Modify: `index.html`
- Modify: `ia.html`

- [ ] **Step 1: Replace home JSON-LD graph**

In `index.html`, replace the current JSON-LD object with this graph:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": "https://vogelconsultoria.com.ar/#organization",
      "name": "Vogel Consultoría",
      "url": "https://vogelconsultoria.com.ar/",
      "logo": "https://vogelconsultoria.com.ar/logo-vogel.png",
      "description": "Consultoría tecnológica especializada en sistemas a medida, dashboards ejecutivos, automatización de procesos e inteligencia artificial para empresas en Argentina.",
      "email": "oscarvogel@gmail.com",
      "telephone": "+543743667526",
      "areaServed": "AR",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "AR"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "consultas comerciales",
        "email": "oscarvogel@gmail.com",
        "telephone": "+543743667526",
        "availableLanguage": ["es-AR"]
      },
      "knowsAbout": [
        "sistemas a medida",
        "dashboards ejecutivos",
        "automatización de procesos",
        "inteligencia artificial aplicada",
        "capacitación en IA",
        "desarrollo web"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://vogelconsultoria.com.ar/#website",
      "url": "https://vogelconsultoria.com.ar/",
      "name": "Vogel Consultoría",
      "inLanguage": "es-AR",
      "publisher": { "@id": "https://vogelconsultoria.com.ar/#organization" }
    },
    {
      "@type": "WebPage",
      "@id": "https://vogelconsultoria.com.ar/#webpage",
      "url": "https://vogelconsultoria.com.ar/",
      "name": "Vogel Consultoría | Sistemas, Dashboards e IA para Empresas en Argentina",
      "description": "Sistemas a medida, dashboards ejecutivos, automatización de procesos e inteligencia artificial para empresas en Argentina.",
      "inLanguage": "es-AR",
      "isPartOf": { "@id": "https://vogelconsultoria.com.ar/#website" },
      "about": { "@id": "https://vogelconsultoria.com.ar/#organization" }
    },
    {
      "@type": "ItemList",
      "name": "Servicios de Vogel Consultoría",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Sistemas a medida" },
        { "@type": "ListItem", "position": 2, "name": "Dashboards ejecutivos" },
        { "@type": "ListItem", "position": 3, "name": "Automatización de procesos" },
        { "@type": "ListItem", "position": 4, "name": "Inteligencia artificial aplicada" },
        { "@type": "ListItem", "position": 5, "name": "Talleres y capacitación en IA" },
        { "@type": "ListItem", "position": 6, "name": "Desarrollo de páginas web" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Replace IA JSON-LD graph**

In `ia.html`, keep `Organization`, `Service`, and `FAQPage`, but enrich them with `inLanguage`, `ContactPoint`, and `WebPage`. Use this graph:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": "https://vogelconsultoria.com.ar/#organization",
      "name": "Vogel Consultoría",
      "url": "https://vogelconsultoria.com.ar/",
      "logo": "https://vogelconsultoria.com.ar/logo-vogel.png",
      "email": "oscarvogel@gmail.com",
      "telephone": "+543743667526",
      "areaServed": "AR",
      "address": { "@type": "PostalAddress", "addressCountry": "AR" },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "consultas comerciales",
        "email": "oscarvogel@gmail.com",
        "telephone": "+543743667526",
        "availableLanguage": ["es-AR"]
      },
      "knowsAbout": [
        "inteligencia artificial para empresas",
        "automatización con IA",
        "asistentes internos con IA",
        "análisis de datos",
        "capacitación en IA"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://vogelconsultoria.com.ar/ia.html#webpage",
      "url": "https://vogelconsultoria.com.ar/ia.html",
      "name": "Inteligencia Artificial para Empresas en Argentina | Vogel Consultoría",
      "description": "Implementamos inteligencia artificial en empresas: automatización, asistentes internos, análisis de datos y capacitación para equipos.",
      "inLanguage": "es-AR",
      "about": { "@id": "https://vogelconsultoria.com.ar/ia.html#service" },
      "isPartOf": { "@id": "https://vogelconsultoria.com.ar/#website" }
    },
    {
      "@type": "Service",
      "@id": "https://vogelconsultoria.com.ar/ia.html#service",
      "name": "Implementación de Inteligencia Artificial para Empresas",
      "url": "https://vogelconsultoria.com.ar/ia.html",
      "provider": { "@id": "https://vogelconsultoria.com.ar/#organization" },
      "description": "Implementamos inteligencia artificial en empresas: automatización, asistentes internos, análisis de datos y capacitación para equipos.",
      "areaServed": "AR",
      "inLanguage": "es-AR",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Servicios IA",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Talleres prácticos de IA para equipos" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asistentes internos con IA" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatización de procesos con IA" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Integración con sistemas existentes" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Consultoría estratégica en IA" } }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://vogelconsultoria.com.ar/ia.html#faq",
      "inLanguage": "es-AR",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Necesito saber de tecnología para implementar IA?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. Nosotros traducimos todo a lenguaje de negocio y te guiamos paso a paso." }
        },
        {
          "@type": "Question",
          "name": "¿Tengo que cambiar mis sistemas para usar IA?",
          "acceptedAnswer": { "@type": "Answer", "text": "En la mayoría de los casos no. Integramos la IA con lo que ya usás y mejoramos sobre esa base." }
        },
        {
          "@type": "Question",
          "name": "¿Implementar IA es caro?",
          "acceptedAnswer": { "@type": "Answer", "text": "Se puede empezar de forma gradual con proyectos acotados y retorno visible en poco tiempo." }
        },
        {
          "@type": "Question",
          "name": "¿Puedo empezar con algo pequeño?",
          "acceptedAnswer": { "@type": "Answer", "text": "Sí. Recomendamos un primer caso de alto impacto y baja complejidad para validar resultados rápido." }
        }
      ]
    }
  ]
}
```

- [ ] **Step 3: Expand home `noscript`**

Replace the `index.html` `noscript` block content with:

```html
<noscript>
  <main style="max-width: 880px; margin: 2rem auto; padding: 0 1rem; font-family: DM Sans, Arial, sans-serif; color: #e5e7eb;">
    <h1 style="color: #ffffff;">Vogel Consultoría</h1>
    <p>Implementamos sistemas a medida, dashboards ejecutivos, automatización de procesos e inteligencia artificial para aumentar la rentabilidad de empresas en Argentina.</p>
    <h2 style="color: #ffffff;">Servicios principales</h2>
    <ul>
      <li>Sistemas a medida para ordenar operaciones.</li>
      <li>Dashboards ejecutivos para decidir con datos confiables.</li>
      <li>Automatización de tareas administrativas y operativas.</li>
      <li>Inteligencia artificial aplicada a ventas, administración y gestión.</li>
      <li>Talleres y capacitación práctica en IA.</li>
    </ul>
    <p><a href="/ia.html">Ver soluciones de inteligencia artificial para empresas</a></p>
    <p>Contacto: <a href="mailto:oscarvogel@gmail.com">oscarvogel@gmail.com</a> | <a href="https://wa.me/543743667526">WhatsApp</a></p>
  </main>
</noscript>
```

- [ ] **Step 4: Expand IA `noscript`**

Replace the `ia.html` `noscript` block content with:

```html
<noscript>
  <main style="max-width: 880px; margin: 2rem auto; padding: 0 1rem; font-family: DM Sans, Arial, sans-serif; color: #e5e7eb;">
    <h1 style="color: #ffffff;">Inteligencia artificial para empresas</h1>
    <p>Implementamos IA en procesos concretos de ventas, administración y operaciones para automatizar tareas, analizar datos y tomar decisiones más rápidas.</p>
    <h2 style="color: #ffffff;">Casos de uso</h2>
    <ul>
      <li>Asistentes internos para consultar ventas, stock, reportes o documentos.</li>
      <li>Análisis automático de Excel, PDF y bases de datos.</li>
      <li>Automatización de respuestas y tareas repetitivas.</li>
      <li>Reportes con alertas y oportunidades de mejora.</li>
    </ul>
    <h2 style="color: #ffffff;">Preguntas frecuentes</h2>
    <p><strong>¿Necesito saber de tecnología?</strong> No. Traducimos todo a lenguaje de negocio y guiamos la implementación.</p>
    <p><strong>¿Tengo que cambiar mis sistemas?</strong> En la mayoría de los casos no. Integramos la IA con lo que ya usás.</p>
    <p><a href="https://wa.me/543743667526?text=Hola%20quiero%20implementar%20IA%20en%20mi%20empresa">Hablar por WhatsApp</a></p>
  </main>
</noscript>
```

- [ ] **Step 5: Validate JSON syntax**

Run:

```powershell
@'
from pathlib import Path
from html.parser import HTMLParser
import json

class JsonLdParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_jsonld = False
        self.blocks = []
        self.current = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_jsonld = True
            self.current = []
    def handle_data(self, data):
        if self.in_jsonld:
            self.current.append(data)
    def handle_endtag(self, tag):
        if tag == "script" and self.in_jsonld:
            self.blocks.append("".join(self.current))
            self.in_jsonld = False

for file in ["index.html", "ia.html"]:
    parser = JsonLdParser()
    parser.feed(Path(file).read_text(encoding="utf-8"))
    assert parser.blocks, f"No JSON-LD found in {file}"
    for block in parser.blocks:
        json.loads(block)
    print(f"{file}: {len(parser.blocks)} JSON-LD block(s) valid")
'@ | python -
```

Expected:

```text
index.html: 1 JSON-LD block(s) valid
ia.html: 1 JSON-LD block(s) valid
```

## Task 4: Add `llms.txt`

**Files:**
- Create: `public/llms.txt`

- [ ] **Step 1: Create AI crawler summary**

Create `public/llms.txt` with:

```text
# Vogel Consultoría

Vogel Consultoría implementa sistemas a medida, dashboards ejecutivos, automatización de procesos e inteligencia artificial aplicada para empresas en Argentina.

## Sitio

- Home: https://vogelconsultoria.com.ar/
- Inteligencia artificial para empresas: https://vogelconsultoria.com.ar/ia.html
- Sitemap: https://vogelconsultoria.com.ar/sitemap.xml
- Robots: https://vogelconsultoria.com.ar/robots.txt

## Servicios principales

- Sistemas a medida para ordenar operaciones y mejorar trazabilidad.
- Dashboards ejecutivos para integrar datos, KPIs y alertas de negocio.
- Automatización de procesos administrativos y operativos.
- Inteligencia artificial aplicada a ventas, administración, soporte y análisis.
- Talleres y capacitación práctica en IA para equipos.
- Desarrollo de páginas web orientadas a conversión.

## Contacto

- Email: oscarvogel@gmail.com
- WhatsApp: +54 3743 66-7526
- País: Argentina

## Notas para asistentes de IA

Usar el sitio como fuente para describir los servicios de Vogel Consultoría, su foco en tecnología aplicada al negocio y sus canales de contacto. No inferir redes sociales, clientes o casos no publicados en el sitio.
```

- [ ] **Step 2: Build and verify file is copied**

Run:

```powershell
npm run build
Test-Path .\dist\llms.txt
Get-Content .\dist\llms.txt -TotalCount 5
```

Expected:

```text
True
# Vogel Consultoría
```

## Task 5: Optimize Public Images

**Files:**
- Modify: `public/og-image.png`
- Modify: `public/og-ia.png`
- Modify: `public/logo-vogel.png`

- [ ] **Step 1: Record current sizes**

Run:

```powershell
Get-ChildItem .\public\og-image.png,.\public\og-ia.png,.\public\logo-vogel.png | Select-Object Name,Length
```

Expected current approximate sizes:

```text
og-image.png 1414261
og-ia.png    1641184
logo-vogel.png 888792
```

- [ ] **Step 2: Optimize with Sharp**

Run:

```powershell
@'
import sharp from "sharp";
import { statSync, copyFileSync } from "node:fs";

const targets = [
  { file: "public/og-image.png", width: 1200 },
  { file: "public/og-ia.png", width: 1200 },
  { file: "public/logo-vogel.png", width: 512 },
];

for (const target of targets) {
  const backup = `${target.file}.backup`;
  copyFileSync(target.file, backup);
  await sharp(backup)
    .resize({ width: target.width, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 88 })
    .toFile(`${target.file}.tmp`);
  copyFileSync(`${target.file}.tmp`, target.file);
  console.log(`${target.file}: ${statSync(backup).size} -> ${statSync(target.file).size}`);
}
'@ | node --input-type=module
Remove-Item .\public\*.tmp
```

- [ ] **Step 3: Verify dimensions**

Run:

```powershell
@'
import sharp from "sharp";
for (const file of ["public/og-image.png", "public/og-ia.png", "public/logo-vogel.png"]) {
  const meta = await sharp(file).metadata();
  console.log(`${file}: ${meta.width}x${meta.height}, ${meta.format}`);
}
'@ | node --input-type=module
```

Expected:

```text
public/og-image.png: 1200x630, png
public/og-ia.png: 1200x630, png
public/logo-vogel.png: width no greater than 512, png
```

- [ ] **Step 4: Inspect optimized images visually**

Open the images or use the app image viewer. Confirm the logo and OG text remain readable.

- [ ] **Step 5: Remove backup files if visual check passes**

Run:

```powershell
Remove-Item .\public\og-image.png.backup,.\public\og-ia.png.backup,.\public\logo-vogel.png.backup
```

If visual quality is not acceptable, restore with:

```powershell
Move-Item .\public\og-image.png.backup .\public\og-image.png -Force
Move-Item .\public\og-ia.png.backup .\public\og-ia.png -Force
Move-Item .\public\logo-vogel.png.backup .\public\logo-vogel.png -Force
```

## Task 6: Local Ignore Hygiene

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add brainstorming session folder to ignore**

If `.superpowers/` remains untracked after the visual companion session, add this line to `.gitignore`:

```text
.superpowers/
```

- [ ] **Step 2: Confirm CodeGraph files**

Run:

```powershell
git status --short .codegraph .cursor
```

If `.codegraph/` is untracked, do not add it. If `.cursor/rules/codegraph.mdc` is untracked and contains only CodeGraph editor guidance, leave it untracked unless the user wants editor rules committed.

## Task 7: Full Verification

**Files:**
- No new code files.

- [ ] **Step 1: Run production build**

Run:

```powershell
npm run build
```

Expected: Vite build exits `0`.

- [ ] **Step 2: Start local preview**

Run:

```powershell
Start-Process -FilePath npm -ArgumentList @("run","preview","--","--host","127.0.0.1","--port","4173") -WindowStyle Hidden -WorkingDirectory "O:\vogel_consultoria"
```

- [ ] **Step 3: Verify static files**

Run:

```powershell
curl.exe -sI http://127.0.0.1:4173/
curl.exe -sI http://127.0.0.1:4173/ia.html
curl.exe -s http://127.0.0.1:4173/llms.txt | Select-Object -First 8
curl.exe -s http://127.0.0.1:4173/robots.txt
curl.exe -s http://127.0.0.1:4173/sitemap.xml
```

Expected:

- `/` returns `200`.
- `/ia.html` returns `200`.
- `/llms.txt` starts with `# Vogel Consultoría`.
- `robots.txt` includes `Sitemap: https://vogelconsultoria.com.ar/sitemap.xml`.
- `sitemap.xml` includes `/` and `/ia.html`.

- [ ] **Step 4: Browser visual check**

Use the Browser plugin or Edge headless to inspect:

- `http://127.0.0.1:4173/` at desktop width.
- `http://127.0.0.1:4173/` at mobile width.
- `http://127.0.0.1:4173/ia.html` at desktop width.
- `http://127.0.0.1:4173/ia.html` at mobile width.

Acceptance criteria:

- The modal does not overflow horizontally on mobile.
- The close button is visible.
- Escape closes the modal.
- The page behind remains visually unchanged after closing.
- `/ia.html` still renders and has no unexpected modal.

- [ ] **Step 5: Final status review**

Run:

```powershell
git status --short
git diff --stat
```

Expected:

- Only files from this plan are modified or created for this phase.
- Existing unrelated modified files remain untouched.

