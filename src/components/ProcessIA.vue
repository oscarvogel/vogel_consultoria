<template>
  <section class="py-18 sm:py-22" aria-labelledby="proceso-ia-heading">
    <div class="section-shell">
      <h2 id="proceso-ia-heading" class="reveal font-display text-3xl font-bold text-white sm:text-4xl">Método de implementación</h2>

      <ol class="mt-10 grid gap-5 md:grid-cols-5">
        <li
          v-for="(step, index) in steps"
          :key="step"
          class="reveal card-hover rounded-2xl p-5"
          :class="`reveal-d${(index % 5) + 1}`"
        >
          <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-vogel-blue font-display text-sm font-bold text-white shadow-glow transition duration-300 hover:shadow-glow-amber">
            {{ String(index + 1).padStart(2, '0') }}
          </div>
          <p class="text-sm font-semibold leading-relaxed text-white">{{ step }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
const steps = [
  "Diagnóstico del negocio",
  "Identificación de oportunidades de IA",
  "Diseño de solución simple",
  "Implementación rápida",
  "Mejora continua",
];
</script>
