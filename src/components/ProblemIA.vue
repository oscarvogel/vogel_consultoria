<template>
  <section class="py-18 sm:py-22" aria-labelledby="problema-ia-heading">
    <div class="section-shell rounded-3xl border border-vogel-gray/15 bg-vogel-navy/75 p-7 sm:p-10">
      <h2 id="problema-ia-heading" class="reveal font-display text-3xl font-bold text-white sm:text-4xl">Si te pasa esto, la IA ya puede ayudarte</h2>

      <ul class="mt-8 grid gap-4 sm:grid-cols-2">
        <li
          v-for="(item, i) in problems"
          :key="item"
          class="reveal rounded-xl border border-vogel-gray/20 bg-vogel-deep/45 p-4 text-sm leading-relaxed text-vogel-muted transition duration-300 hover:border-vogel-amber/40"
          :class="`reveal-d${(i % 3) + 1}`"
        >
          <span class="mr-2 text-vogel-amber">●</span>{{ item }}
        </li>
      </ul>

      <p class="reveal reveal-d3 mt-8 border-l-4 border-vogel-amber pl-4 text-lg font-semibold leading-relaxed text-white sm:text-xl">
        Hoy las empresas que no usan IA están tomando decisiones más lentas, más caras y menos precisas.
      </p>
    </div>
  </section>
</template>

<script setup>
const problems = [
  "Tenés datos pero no sabés qué decisiones tomar",
  "Dependés demasiado de Excel",
  "Tu equipo pierde tiempo en tareas repetitivas",
  "Necesitás respuestas rápidas y no llegan",
  "Querés usar IA pero no sabés por dónde empezar",
];
</script>
