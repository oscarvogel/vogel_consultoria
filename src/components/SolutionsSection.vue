<template>
  <section id="soluciones" class="py-20 sm:py-24" aria-labelledby="soluciones-heading">
    <div class="section-shell">
      <SectionHeading
        id="soluciones-heading"
        eyebrow="Soluciones"
        title="Resultados medibles para un negocio más ordenado y rentable"
        description="Diseñamos soluciones con foco en control operativo, eficiencia y crecimiento sostenido."
      />

      <div class="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(solution, i) in solutions"
          :key="solution"
          class="reveal card-hover rounded-2xl p-6"
          :class="`reveal-d${(i % 3) + 1}`"
        >
          <p class="text-base font-semibold text-white">{{ solution }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from "./SectionHeading.vue";

const solutions = [
  "Control total del negocio en un solo dashboard",
  "Procesos automatizados y ordenados",
  "Información en tiempo real",
  "Reportes gerenciales claros",
  "IA aplicada a ventas, administración y operaciones",
];
</script>
