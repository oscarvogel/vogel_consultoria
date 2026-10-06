<script setup>
import { computed } from "vue";
import { useScrollReveal } from "../composables/useScrollReveal.js";
useScrollReveal();
import { getRelatedServices } from "../data/servicePages.js";
import ProcessFlowDiagram from "./ProcessFlowDiagram.vue";
import Navbar from "./Navbar.vue";
import FooterSection from "./FooterSection.vue";
import WhatsAppButton from "./WhatsAppButton.vue";

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});

const relatedServices = computed(() => getRelatedServices(props.page));
const serviceFlows = {
  "sistemas-a-medida": {
    title: "De los datos separados a una operación compartida.",
    nodes: [
      { title: "Fuentes", description: "Ventas, existencias y clientes." },
      { title: "Reglas", description: "Permisos y validaciones del proceso." },
      { title: "Operación", description: "Tareas con contexto y trazabilidad." },
    ],
  },
  "dashboards-ejecutivos": {
    title: "De la fuente a una lectura que la dirección puede usar.",
    nodes: [
      { title: "Fuentes", description: "Planillas y sistemas disponibles." },
      { title: "Indicadores", description: "Criterios definidos con el negocio." },
      { title: "Lectura", description: "Una vista comparable para decidir." },
    ],
  },
  "automatizacion-de-procesos": {
    title: "Una tarea repetida convertida en un flujo revisable.",
    nodes: [
      { title: "Evento", description: "Qué inicia el trabajo." },
      { title: "Reglas", description: "Qué se procesa y qué se deriva." },
      { title: "Revisión", description: "Cómo se valida el resultado." },
    ],
  },
  "contaflow-api-facturacion-electronica": {
    title: "Una solicitud. Una respuesta fiscal normalizada.",
    nodes: [
      { title: "Solicitud", description: "Datos del comprobante." },
      { title: "AFIP / ARCA", description: "Autorización o rechazo." },
      { title: "Respuesta", description: "CAE, vencimiento o error." },
    ],
  },
  "desarrollo-web": {
    title: "De una propuesta clara a una consulta.",
    nodes: [
      { title: "Propuesta", description: "Qué ofrece la organización." },
      { title: "Contenido", description: "Servicios y evidencia." },
      { title: "Consulta", description: "Contacto desde cada pantalla." },
    ],
  },
  "talleres-ia": {
    title: "Una tarea cotidiana, practicada con criterio.",
    nodes: [
      { title: "Tarea", description: "Un ejercicio del trabajo real." },
      { title: "Práctica", description: "Herramientas y fuentes." },
      { title: "Criterio", description: "Revisión y buenas prácticas." },
    ],
  },
  "mantenimiento-de-equipos": {
    title: "De cada equipo a un trabajo de mantenimiento trazable.",
    nodes: [
      { title: "Equipo", description: "Lecturas y vencimientos." },
      { title: "Plan", description: "Mantenimiento preventivo." },
      { title: "Trabajo", description: "Solicitudes y órdenes." },
    ],
  },
  "integraciones-whatsapp": {
    title: "Un contacto que conserva el contexto operativo.",
    nodes: [
      { title: "Evento", description: "Qué inicia la conversación." },
      { title: "Mensaje", description: "La información que necesita cada parte." },
      { title: "Registro", description: "La respuesta queda en el proceso." },
    ],
  },
};
const processDiagram = computed(() => serviceFlows[props.page.id] || {
  title: "Del proceso actual a una salida revisable.",
  nodes: [
    { title: "Contexto", description: "Información y tareas." },
    { title: "Solución", description: "Alcance acordado." },
    { title: "Revisión", description: "Validación con el equipo." },
  ],
});
</script>

<template>
  <div class="relative min-h-screen service-page">
    <a class="skip-link" href="#service-content">Saltar al contenido principal</a>

    <Navbar />
    <main id="service-content" tabindex="-1">
      <section data-chapter="neutral" class="relative isolate overflow-hidden py-6 sm:py-10 lg:py-12">

        <div class="section-shell" data-hero-stage>
          <nav aria-label="Ruta de navegación" class="service-breadcrumb text-sm text-vogel-muted">
            <ol class="flex flex-wrap items-center gap-2">
              <li><a href="/" class="transition hover:text-white">Inicio</a></li>
              <li aria-hidden="true">/</li>
              <li><a href="/#servicios" class="transition hover:text-white">Servicios</a></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" class="text-vogel-gray">{{ page.shortTitle }}</li>
            </ol>
          </nav>

          <div class="grid min-w-0 gap-6 pt-8 sm:gap-10 sm:pt-12 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:pt-16">
            <div class="min-w-0 max-w-3xl">
              <p class="text-xs font-bold uppercase tracking-[0.32em] text-vogel-amber">{{ page.eyebrow }}</p>
              <h1 class="mt-4 max-w-full break-words font-display text-[clamp(2.15rem,8vw,3.5rem)] font-bold leading-[1.04] text-white sm:mt-5 sm:text-5xl lg:text-6xl">
                {{ page.title }}
              </h1>
              <p class="mt-4 max-w-2xl text-base leading-relaxed text-vogel-gray sm:mt-6 sm:text-xl">
                {{ page.summary }}
              </p>
              <p v-if="page.intro" class="mt-3 max-w-2xl text-sm leading-relaxed text-vogel-muted sm:mt-4 sm:text-lg">
                {{ page.intro }}
              </p>

              <div class="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <a
                  :href="page.ctaUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="action-button action-primary service-main-cta"
                  data-analytics-event="whatsapp_click"
                  :data-analytics-label="page.id"
                  data-analytics-location="service_page"
                >
                  {{ page.ctaLabel }}
                </a>
                <a
                  :href="page.secondaryCtaUrl || '/#contacto'"
                  class="inline-flex items-center justify-center rounded-full border border-vogel-gray/25 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:border-vogel-blue/70 hover:bg-vogel-blue/15"
                >
                  {{ page.secondaryCtaLabel || "Agendar diagnóstico" }}
                </a>
              </div>
            </div>

            <div class="relative min-w-0 max-w-full service-diagram">
              <ProcessFlowDiagram
                :title="processDiagram.title"
                description="Esquema orientativo. Los pasos y el alcance se definen con cada organización."
                :nodes="processDiagram.nodes"
              />
            </div>
          </div>
        </div>
      </section>

      <div class="service-story-core"  data-chapter="connect">
      <div class="chapter-copy" >
      <section  class="py-16 sm:py-20" aria-labelledby="problemas-heading">
        <div class="section-shell">
          <div class="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Problemas que resolvemos</p>
              <h2 id="problemas-heading" class="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Menos fricción, más información útil
              </h2>
            </div>
            <div class="grid gap-4 sm:grid-cols-3">
              <article
                v-for="problem in page.problems"
                :key="problem"
                class="rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-5 text-sm leading-relaxed text-vogel-gray"
              >
                {{ problem }}
              </article>
            </div>
          </div>
        </div>
      </section>

      <section data-story-reveal v-if="page.benefits" class="py-8 sm:py-12" aria-labelledby="beneficios-heading">
        <div class="section-shell">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Beneficios</p>
              <h2 id="beneficios-heading" class="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Una capa fiscal pensada para equipos técnicos
              </h2>
            </div>
          </div>
          <div class="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="benefit in page.benefits"
              :key="benefit.title"
              class="rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-5 transition hover:border-vogel-blue/45 hover:bg-vogel-blue/10"
            >
              <p class="font-display text-lg font-bold text-white">{{ benefit.title }}</p>
              <p class="mt-3 text-sm leading-relaxed text-vogel-muted">{{ benefit.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section data-story-reveal v-if="page.apiExamples" id="documentacion-tecnica" class="py-8 sm:py-12" aria-labelledby="api-heading">
        <div class="section-shell">
          <div class="grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-blueLight">Respuesta API</p>
              <h2 id="api-heading" class="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Mandá el comprobante. Recibí una respuesta lista para usar.
              </h2>
              <p class="mt-4 text-sm leading-relaxed text-vogel-muted sm:text-base">
                La documentación técnica queda preparada para revisar el caso de uso, validar el circuito de emisión y definir los campos necesarios antes de integrar.
              </p>
            </div>

            <div class="grid gap-4">
              <article class="overflow-hidden rounded-2xl border border-vogel-blue/35 bg-vogel-navy/70 shadow-glow">
                <div class="flex items-center justify-between border-b border-vogel-gray/10 px-4 py-3">
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-vogel-amber">Autorizado</p>
                  <span class="rounded-full border border-vogel-blue/35 px-3 py-1 text-xs font-semibold text-vogel-blueLight">200 OK</span>
                </div>
                <pre class="overflow-x-auto p-4 text-xs leading-relaxed text-vogel-gray sm:text-sm"><code>{{ page.apiExamples.success }}</code></pre>
              </article>

              <article class="overflow-hidden rounded-2xl border border-vogel-gray/20 bg-white/[0.04]">
                <div class="flex items-center justify-between border-b border-vogel-gray/10 px-4 py-3">
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-vogel-amber">Rechazado</p>
                  <span class="rounded-full border border-vogel-gray/20 px-3 py-1 text-xs font-semibold text-vogel-muted">Error detallado</span>
                </div>
                <pre class="overflow-x-auto p-4 text-xs leading-relaxed text-vogel-gray sm:text-sm"><code>{{ page.apiExamples.error }}</code></pre>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section  class="py-8 sm:py-12" aria-labelledby="incluye-heading">
        <div class="section-shell">
          <div class="grid gap-5 lg:grid-cols-2">
            <article class="rounded-3xl border border-vogel-gray/20 bg-vogel-deep/55 p-6 shadow-glow sm:p-8">
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Qué incluye</p>
              <h2 id="incluye-heading" class="mt-3 font-display text-3xl font-bold text-white">Trabajo concreto, no diagnóstico eterno</h2>
              <ul class="mt-6 space-y-4">
                <li v-for="item in page.includes" :key="item" class="flex gap-3 text-sm leading-relaxed text-vogel-gray">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-vogel-amber"></span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </article>

            <article class="rounded-3xl border border-vogel-gray/20 bg-white/[0.04] p-6 sm:p-8">
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-blueLight">Proceso</p>
              <h2 class="mt-3 font-display text-3xl font-bold text-white">Cómo avanzamos</h2>
              <ol class="mt-6 space-y-4">
                <li v-for="(step, index) in page.process" :key="step" class="flex gap-4">
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-vogel-amber/45 bg-vogel-amber/10 text-sm font-bold text-vogel-amber">
                    {{ index + 1 }}
                  </span>
                  <span class="pt-1 text-sm leading-relaxed text-vogel-gray">{{ step }}</span>
                </li>
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section  class="py-12 sm:py-16" aria-labelledby="entregables-heading">
        <div class="section-shell">
          <div class="rounded-3xl border border-vogel-gray/15 bg-vogel-navy/55 p-6 sm:p-8">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Entregables</p>
                <h2 id="entregables-heading" class="mt-3 font-display text-3xl font-bold text-white">Qué queda funcionando</h2>
              </div>
              <a
                :href="page.ctaUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center rounded-full border border-vogel-amber/50 px-5 py-2.5 text-sm font-bold text-vogel-amber transition hover:bg-vogel-amber hover:text-vogel-navy"
                data-analytics-event="whatsapp_click"
                :data-analytics-label="page.id"
                data-analytics-location="service_page_deliverables"
              >
                Consultar alcance
              </a>
            </div>
            <div class="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div
                v-for="deliverable in page.deliverables"
                :key="deliverable"
                class="rounded-2xl border border-vogel-gray/15 bg-white/5 px-4 py-4 text-sm font-semibold text-white"
              >
                {{ deliverable }}
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>

      </div>

      <section data-chapter="neutral" class="py-12 sm:py-16" aria-labelledby="faq-heading">
        <div class="section-shell max-w-5xl">
          <p class="text-center text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Preguntas frecuentes</p>
          <h2 id="faq-heading" class="mt-3 text-center font-display text-3xl font-bold text-white sm:text-4xl">
            Antes de empezar
          </h2>
          <div class="mt-8 space-y-3">
            <details
              v-for="faq in page.faqs"
              :key="faq.question"
              class="group rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-5"
            >
              <summary class="cursor-pointer list-none font-display text-lg font-bold text-white">
                <span class="flex items-center justify-between gap-4">
                  {{ faq.question }}
                  <span class="text-vogel-amber transition group-open:rotate-45" aria-hidden="true">+</span>
                </span>
              </summary>
              <p class="mt-4 text-sm leading-relaxed text-vogel-gray">{{ faq.answer }}</p>
            </details>
          </div>
        </div>
      </section>

      <section data-story-reveal class="py-12 sm:py-16" aria-labelledby="relacionados-heading">
        <div class="section-shell">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-blueLight">Servicios relacionados</p>
              <h2 id="relacionados-heading" class="mt-3 font-display text-3xl font-bold text-white">También puede servirte</h2>
            </div>
          </div>
          <div class="mt-7 grid gap-4 sm:grid-cols-3">
            <a
              v-for="service in relatedServices"
              :key="service.id"
              :href="service.path"
              class="rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-vogel-amber/50 hover:bg-vogel-amber/5"
            >
              <p class="font-display text-lg font-bold text-white">{{ service.shortTitle }}</p>
              <p class="mt-3 text-sm leading-relaxed text-vogel-muted">{{ service.summary }}</p>
            </a>
          </div>
        </div>
      </section>

      <section data-story-reveal class="py-16 sm:py-20" aria-labelledby="cta-heading">
        <div class="section-shell">
          <div class="rounded-3xl border border-vogel-amber/25 bg-vogel-navy p-7 text-center shadow-glow sm:p-10">
            <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Próximo paso</p>
            <h2 id="cta-heading" class="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold text-white sm:text-4xl">
              Veamos si este servicio encaja con tu situación actual
            </h2>
            <p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-vogel-gray sm:text-base">
              Una conversación inicial alcanza para ordenar el problema, detectar oportunidades y definir si conviene avanzar con un diagnóstico más concreto.
            </p>
            <a
              :href="page.ctaUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-7 inline-flex items-center justify-center rounded-full bg-vogel-amber px-7 py-3 text-sm font-bold text-vogel-navy transition hover:-translate-y-0.5 hover:bg-white"
              data-analytics-event="whatsapp_click"
              :data-analytics-label="page.id"
              data-analytics-location="service_page_final"
            >
              {{ page.ctaLabel }}
            </a>
          </div>
        </div>
      </section>
    </main>

    <FooterSection />
    <WhatsAppButton />
  </div>
</template>
