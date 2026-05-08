<template>
  <section id="hero" class="relative isolate overflow-hidden pb-20 pt-14 sm:pt-20">
    <img
      :src="aiOperations"
      alt=""
      class="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      aria-hidden="true"
    />
    <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,42,68,0.98)_0%,rgba(15,42,68,0.82)_48%,rgba(11,32,53,0.18)_100%)]"></div>
    <div class="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-vogel-deep to-transparent"></div>

    <div class="section-shell">
      <a href="/" class="inline-flex items-center text-sm font-medium text-vogel-gray hover:text-white">← Volver al sitio principal</a>

      <div class="mt-8 grid min-w-0 items-center gap-12 lg:grid-cols-2">
        <div class="fade-up min-w-0">
          <p class="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-vogel-amber">vogelconsultoria.com.ar/ia</p>
          <h1 class="max-w-[10.4em] text-[2.15rem] font-bold leading-[1.08] text-white sm:max-w-none sm:text-5xl lg:text-6xl">
            Implementá inteligencia artificial en tu empresa sin complicarte con tecnología
          </h1>
          <p class="mt-6 max-w-[34ch] text-base leading-relaxed text-vogel-gray/90 sm:max-w-xl sm:text-lg">
            Automatizá tareas, analizá tus datos y tomá mejores decisiones con soluciones reales, no teoría.
          </p>
          <a
            :href="waLink"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 inline-flex rounded-full border border-vogel-blue bg-vogel-blue px-7 py-3.5 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:border-vogel-amber hover:bg-vogel-amber hover:text-vogel-deep"
          >
            Hablar por WhatsApp
          </a>
        </div>

        <div class="fade-up-delay min-w-0 rounded-3xl border border-vogel-gray/20 bg-vogel-deep/55 p-6 shadow-glow backdrop-blur sm:p-8">
          <div class="grid gap-4 sm:grid-cols-2">
            <article v-for="kpi in kpis" :key="kpi.label" class="rounded-2xl border border-vogel-gray/15 bg-vogel-navy/70 p-4">
              <p class="text-xs uppercase tracking-[0.08em] text-vogel-gray/75">{{ kpi.label }}</p>
              <p class="mt-2 text-2xl font-semibold text-white">{{ kpi.value }}</p>
            </article>
          </div>
          <p class="mt-6 rounded-xl border border-vogel-blue/30 bg-vogel-blue/10 p-4 text-sm leading-relaxed text-vogel-gray/90">
            Aplicamos IA en procesos concretos de ventas, administración y operaciones para lograr impacto real en semanas.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import aiOperations from "../assets/ia/ai-operations.png";

const waLink = "https://wa.me/543743667526?text=Hola%20quiero%20implementar%20IA%20en%20mi%20empresa";

const kpis = [
  { label: "Tiempo en tareas manuales", value: "-40%" },
  { label: "Velocidad de análisis", value: "x3" },
  { label: "Visibilidad del negocio", value: "Tiempo real" },
  { label: "Decisiones accionables", value: "Más claras" },
];
</script>
