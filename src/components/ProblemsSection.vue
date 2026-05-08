<template>
  <section class="py-20 sm:py-24" aria-labelledby="problemas-heading">
    <div class="section-shell rounded-3xl border border-vogel-gray/15 bg-vogel-navy/70 p-7 sm:p-10">
      <SectionHeading
        id="problemas-heading"
        eyebrow="Problemas que resolvemos"
        title="Si te pasa esto, podemos ayudarte"
        description="Detectamos el origen de los cuellos de botella y transformamos datos aislados en información accionable."
      />

      <ul class="mt-10 grid gap-4 sm:grid-cols-2">
        <li
          v-for="(problem, i) in problems"
          :key="problem"
          class="reveal rounded-xl border border-vogel-gray/20 bg-vogel-deep/45 p-4 text-sm leading-relaxed text-vogel-muted transition duration-300 hover:border-vogel-amber/40"
          :class="`reveal-d${(i % 3) + 1}`"
        >
          <span class="mr-2 text-vogel-amber">●</span>{{ problem }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from "./SectionHeading.vue";

const problems = [
  "Dependés demasiado de planillas Excel",
  "No tenés información clara para decidir",
  "Perdés tiempo en tareas repetitivas",
  "No sabés dónde se pierde dinero",
  "Tus sistemas no se comunican entre sí",
  "Querés usar IA pero no sabés por dónde empezar",
];
</script>
