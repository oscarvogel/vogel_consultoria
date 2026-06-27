<script setup>
import SectionHeading from "./SectionHeading.vue";

const programBlocks = [
  {
    title: "IA aplicada al trabajo profesional",
    description: "Herramientas concretas para documentacion, planillas, reportes, investigacion y automatizaciones controladas.",
  },
  {
    title: "Metodo y criterio de uso",
    description: "Prompts con contexto, fuentes, formato de salida, restricciones y checklist de verificacion para no perder control.",
  },
  {
    title: "Taller practico adaptable",
    description: "El contenido se ajusta al publico: profesionales, equipos administrativos, instituciones, camaras o empresas.",
  },
];
</script>

<template>
  <section id="charla-ia-2026" class="relative scroll-mt-24 py-14 sm:py-18" aria-labelledby="charla-ia-heading">
    <div class="section-shell">
      <div class="grid gap-8 rounded-2xl border border-vogel-gray/15 bg-vogel-navy/45 p-5 sm:p-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div class="reveal">
          <SectionHeading
            id="charla-ia-heading"
            eyebrow="Charlas y capacitaciones"
            title="IA practica para instituciones y empresas"
            description="Dictamos encuentros aplicados para equipos que necesitan entender, probar y usar inteligencia artificial con criterio profesional."
          />

          <div class="mt-6 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.045] p-4 sm:flex-row sm:items-center">
            <a
              href="https://www.consejomisiones.org.ar/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-14 w-24 shrink-0 items-center justify-center rounded-md bg-white p-2.5 transition hover:bg-vogel-gray"
              aria-label="Visitar sitio del CPCE Misiones"
            >
              <img src="/logo-cpce.png" alt="Logo CPCE Misiones" class="max-h-9 w-auto" loading="lazy" decoding="async" />
            </a>
            <p class="text-sm leading-6 text-vogel-gray/90">
              Ya dictamos esta charla para profesionales en Ciencias Economicas junto al CPCE Misiones.
            </p>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <a
              href="https://wa.me/543743667526?text=Hola%20Oscar%2C%20quiero%20recibir%20informacion%20para%20dictar%20una%20charla%20de%20IA%20para%20una%20institucion%20o%20empresa"
              class="inline-flex items-center justify-center rounded-full border border-vogel-blue bg-vogel-blue px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-vogel-amber hover:bg-vogel-amber hover:text-vogel-deep"
              data-analytics-cta="event_program_request_talk"
              data-analytics-funnel="lead_journey"
              data-analytics-step="home"
            >
              Solicitar informacion
            </a>
            <a
              href="#contacto"
              class="inline-flex items-center justify-center rounded-full border border-vogel-gray/40 px-5 py-3 text-sm font-semibold text-vogel-gray transition hover:border-vogel-amber hover:text-vogel-amber"
              data-analytics-cta="event_program_contact"
              data-analytics-funnel="lead_journey"
              data-analytics-step="home"
            >
              Coordinar una llamada
            </a>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <article
            v-for="(block, index) in programBlocks"
            :key="block.title"
            class="reveal rounded-xl border border-vogel-gray/15 bg-white/[0.04] p-5 transition hover:border-vogel-amber/45 hover:bg-vogel-blue/10"
            :class="`reveal-d${(index % 3) + 1}`"
          >
            <p class="text-sm font-semibold text-vogel-amber">0{{ index + 1 }}</p>
            <h3 class="mt-3 text-lg font-bold leading-tight text-white">{{ block.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-vogel-gray/85">{{ block.description }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
