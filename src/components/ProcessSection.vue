<template>
  <section class="py-20 sm:py-24" aria-labelledby="proceso-heading">
    <div class="section-shell">
      <SectionHeading
        id="proceso-heading"
        eyebrow="Cómo trabajamos"
        title="Metodología clara para implementar con foco en impacto"
        class="reveal"
      />

      <div class="relative mt-14">
        <!-- Connecting line desktop -->
        <div
          class="absolute left-0 right-0 top-[2.4rem] hidden h-px bg-gradient-to-r from-transparent via-vogel-blue/50 to-transparent md:block"
          aria-hidden="true"
        ></div>

        <ol class="grid gap-6 md:grid-cols-4">
          <li
            v-for="(step, index) in steps"
            :key="step.label"
            class="reveal group relative flex flex-col items-start"
            :class="`reveal-d${index + 1}`"
          >
            <div
              class="relative z-10 mb-5 flex h-[4.8rem] w-[4.8rem] items-center justify-center rounded-full border-2 border-vogel-blue bg-vogel-navy font-display text-lg font-bold text-white shadow-glow transition duration-300 group-hover:border-vogel-amber group-hover:shadow-glow-amber"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </div>

            <div class="w-full rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-5 transition duration-300 group-hover:border-vogel-blue/50">
              <p class="text-xs font-semibold uppercase tracking-[0.1em] text-vogel-amber">{{ step.eyebrow }}</p>
              <h3 class="mt-1 font-display text-base font-bold text-white">{{ step.label }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-vogel-muted">{{ step.description }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from "./SectionHeading.vue";

const steps = [
  {
    eyebrow: "Paso 01",
    label: "Diagnóstico",
    description: "Entendemos tu operación, detectamos fricciones y priorizamos oportunidades de impacto.",
  },
  {
    eyebrow: "Paso 02",
    label: "Diseño de solución",
    description: "Definimos la arquitectura y el enfoque antes de escribir una línea de código.",
  },
  {
    eyebrow: "Paso 03",
    label: "Implementación",
    description: "Desarrollamos, integramos y desplegamos con ciclos cortos y feedback continuo.",
  },
  {
    eyebrow: "Paso 04",
    label: "Mejora continua",
    description: "Medimos resultados, ajustamos y escalamos la solución con el crecimiento del negocio.",
  },
];
</script>
