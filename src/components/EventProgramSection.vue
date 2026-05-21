<script setup>
import SectionHeading from "./SectionHeading.vue";

const eventDetails = [
  { label: "Fecha", value: "Miércoles 27/05/2026" },
  { label: "Horario", value: "18:00 - 20:00" },
  { label: "Modalidad", value: "Híbrida: presencial y virtual" },
  { label: "Audiencia", value: "Contadores matriculados en el CPCEM" },
];

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
</script>

<template>
  <section id="charla-ia-2026" class="relative scroll-mt-24 py-18 sm:py-22" aria-labelledby="charla-ia-heading">
    <div class="section-shell">
      <div class="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div class="reveal">
          <SectionHeading
            id="charla-ia-heading"
            eyebrow="Charla IA 2026"
            title="Inteligencia Artificial para contadores"
            description="Encuentro híbrido para matriculados en el CPCEM, con herramientas prácticas para documentación, planillas, reportes y automatizaciones controladas."
          />

          <div class="mt-7 grid gap-3">
            <div
              v-for="detail in eventDetails"
              :key="detail.label"
              class="rounded-2xl border border-vogel-gray/15 bg-white/5 p-4"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-vogel-muted">{{ detail.label }}</p>
              <p class="mt-1 text-lg font-semibold text-white">{{ detail.value }}</p>
            </div>
          </div>

          <div class="mt-7 flex flex-wrap gap-3">
            <a
              href="/estado-whatsapp-charla-ia-2026.png"
              class="inline-flex items-center justify-center rounded-full border border-vogel-blue bg-vogel-blue px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-vogel-amber hover:bg-vogel-amber hover:text-vogel-deep"
              data-analytics-cta="event_program_state_image"
              data-analytics-funnel="lead_journey"
              data-analytics-step="home"
            >
              Imagen para WhatsApp
            </a>
            <a
              href="#contacto"
              class="inline-flex items-center justify-center rounded-full border border-vogel-gray/40 px-5 py-3 text-sm font-semibold text-vogel-gray transition hover:border-vogel-amber hover:text-vogel-amber"
              data-analytics-cta="event_program_contact"
              data-analytics-funnel="lead_journey"
              data-analytics-step="home"
            >
              Consultar inscripción
            </a>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <article
            v-for="(block, index) in programBlocks"
            :key="block.title"
            class="reveal rounded-2xl border border-vogel-gray/15 bg-vogel-navy/55 p-5 transition hover:border-vogel-amber/45 hover:bg-vogel-blue/10"
            :class="`reveal-d${(index % 3) + 1}`"
          >
            <p class="text-sm font-semibold text-vogel-amber">0{{ index + 1 }}</p>
            <h3 class="mt-3 font-display text-xl font-bold leading-tight text-white">{{ block.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-vogel-gray/85">{{ block.description }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
