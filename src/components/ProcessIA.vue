<template>
  <section class="py-18 sm:py-22" aria-labelledby="proceso-ia-heading">
    <div class="section-shell">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-vogel-amber">Implementación</p>
      <h2 id="proceso-ia-heading" class="reveal mt-3 max-w-3xl font-display text-3xl font-bold text-white sm:text-4xl">Pruebas acotadas, con criterios de revisión definidos.</h2>

      <ol class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="(step, index) in steps"
          :key="step"
          class="reveal border-t border-vogel-gray/20 py-5"
          :class="`reveal-d${(index % 4) + 1}`"
        >
          <div class="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-vogel-amber/50 font-display text-sm font-semibold text-vogel-amber">
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
  "Elegir una tarea prioritaria y acordar quién la revisa.",
  "Definir las fuentes disponibles, los permisos y los límites.",
  "Probar la asistencia con ejemplos representativos.",
  "Validar con el equipo y acordar los siguientes ajustes.",
];
</script>
