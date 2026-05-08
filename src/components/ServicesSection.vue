<template>
  <section id="servicios" class="py-20 sm:py-24" aria-labelledby="servicios-heading">
    <div class="section-shell">
      <div class="grid items-center gap-10 lg:grid-cols-[0.86fr_1.14fr]">
        <SectionHeading
          id="servicios-heading"
          eyebrow="Servicios"
          title="Soluciones integrales para transformar operación y resultados"
          description="Combinamos tecnología y visión de negocio para resolver cuellos de botella, ordenar información y acelerar decisiones estratégicas."
          class="reveal"
        />

        <div class="reveal reveal-d1 relative overflow-hidden rounded-3xl border border-vogel-gray/20 bg-white/5 p-3 shadow-glow">
          <img
            :src="servicesOverview"
            alt="Servicios integrales conectando sistemas a medida, dashboards, automatizaciones, inteligencia artificial y capacitación"
            class="aspect-[16/10] w-full rounded-2xl object-cover"
          />
          <div class="pointer-events-none absolute inset-3 rounded-2xl bg-gradient-to-t from-vogel-deep/55 via-transparent to-transparent"></div>
        </div>
      </div>

      <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(service, i) in services"
          :key="service.title"
          class="card-hover reveal group p-6"
          :class="[`reveal-d${(i % 3) + 1}`]"
        >
          <div
            class="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-vogel-blue/50 text-vogel-amber transition duration-300 group-hover:border-vogel-amber/70 group-hover:bg-vogel-amber/10"
          >
            <component :is="service.icon" class="h-5 w-5" />
          </div>
          <h3 class="font-display text-lg font-bold text-white">{{ service.title }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-vogel-muted">{{ service.description }}</p>
        </article>
      </div>

      <div class="mt-16 overflow-hidden rounded-3xl border border-vogel-gray/20 bg-vogel-deep/45 p-5 shadow-glow reveal sm:p-7 lg:p-8">
        <div class="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Desarrollo web</p>
            <h3 class="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              Páginas web claras, rápidas y preparadas para vender mejor
            </h3>
            <p class="mt-4 text-sm leading-relaxed text-vogel-muted sm:text-base">
              Diseñamos sitios institucionales, portales y experiencias digitales a medida,
              con estructura comercial, optimización responsive, integración de contenidos y
              una base técnica lista para crecer.
            </p>
            <div class="mt-6 grid gap-3 text-sm text-vogel-muted sm:grid-cols-2 lg:grid-cols-1">
              <div
                v-for="highlight in webHighlights"
                :key="highlight"
                class="flex items-center gap-3 rounded-2xl border border-vogel-gray/15 bg-white/5 px-4 py-3"
              >
                <span class="h-2 w-2 shrink-0 rounded-full bg-vogel-amber"></span>
                <span>{{ highlight }}</span>
              </div>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <a
              v-for="(example, i) in webExamples"
              :key="example.url"
              :href="example.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group rounded-2xl border border-vogel-gray/20 bg-white/[0.04] p-4 transition duration-300 hover:-translate-y-1 hover:border-vogel-amber/50 hover:bg-vogel-amber/5"
              :class="`reveal-d${(i % 3) + 1}`"
              :aria-label="`Abrir ejemplo web ${example.name}`"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-display text-base font-bold text-white">{{ example.name }}</p>
                  <p class="mt-1 text-xs uppercase tracking-[0.16em] text-vogel-blue-light">{{ example.type }}</p>
                </div>
                <span
                  class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-vogel-blue/40 text-vogel-amber transition duration-300 group-hover:border-vogel-amber/70 group-hover:bg-vogel-amber/10"
                  aria-hidden="true"
                >
                  <IconExternal class="h-4 w-4" />
                </span>
              </div>
              <p class="mt-4 break-words text-sm text-vogel-muted">{{ example.domain }}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from "./SectionHeading.vue";
import servicesOverview from "../assets/services/services-overview.png";

const IconCode = {
  template:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/><path d="M13 5l-2 14"/></svg>',
};
const IconChart = {
  template:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19h16"/><path d="M7 15V9"/><path d="M12 15V5"/><path d="M17 15v-3"/></svg>',
};
const IconFlow = {
  template:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h7"/><path d="M13 6h7"/><path d="M8 6v12"/><path d="M8 18h12"/></svg>',
};
const IconAi = {
  template:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.9 4.9l2.8 2.8"/><path d="M16.3 16.3l2.8 2.8"/><path d="M2 12h4"/><path d="M18 12h4"/><circle cx="12" cy="12" r="4"/></svg>',
};
const IconWorkshop = {
  template:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 20h8"/><path d="M12 17v3"/></svg>',
};
const IconWeb = {
  template:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></svg>',
};
const IconExternal = {
  template:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>',
};

const services = [
  {
    title: "Sistemas a medida",
    description: "Plataformas diseñadas para tu operación, eliminando fricción entre áreas y mejorando trazabilidad.",
    icon: IconCode,
  },
  {
    title: "Dashboards ejecutivos",
    description: "Indicadores críticos del negocio en una sola vista para decidir con rapidez y precisión.",
    icon: IconChart,
  },
  {
    title: "Automatización de procesos",
    description: "Menos tareas repetitivas y más foco en trabajo de valor para equipos administrativos y operativos.",
    icon: IconFlow,
  },
  {
    title: "Inteligencia artificial aplicada",
    description: "Modelos y asistentes que optimizan ventas, soporte, análisis y gestión interna en contextos reales.",
    icon: IconAi,
  },
  {
    title: "Talleres y capacitación IA",
    description: "Entrenamiento práctico para líderes y equipos con adopción gradual y resultados concretos.",
    icon: IconWorkshop,
  },
  {
    title: "Desarrollo de páginas web",
    description: "Sitios institucionales y comerciales con diseño responsive, foco en conversión y administración simple.",
    icon: IconWeb,
  },
];

const webHighlights = [
  "Diseño responsive para celular, tablet y escritorio",
  "Arquitectura clara para presentar servicios, equipo y contacto",
  "Implementación optimizada para velocidad, SEO y mantenimiento",
];

const webExamples = [
  {
    name: "AN Asociados",
    type: "Institucional",
    domain: "anasociados.com.ar",
    url: "https://anasociados.com.ar/",
  },
  {
    name: "Indufor",
    type: "Industrial",
    domain: "indufor.com.ar",
    url: "https://indufor.com.ar/",
  },
  {
    name: "Forestal Paraguay",
    type: "Forestal",
    domain: "forestalparaguay.com",
    url: "https://forestalparaguay.com/",
  },
  {
    name: "Servin LGSM",
    type: "Servicios",
    domain: "servinlgsm.com.ar",
    url: "https://servinlgsm.com.ar/",
  },
  {
    name: "H21",
    type: "Comercial",
    domain: "h21.ar",
    url: "https://h21.ar/",
  },
  {
    name: "Amitrac",
    type: "Transporte",
    domain: "amitrac.ar",
    url: "https://amitrac.ar/",
  },
  {
    name: "Municipalidad de Garuhape",
    type: "Gobierno",
    domain: "garuhape.gob.ar",
    url: "https://garuhape.gob.ar/",
  },
];
</script>
