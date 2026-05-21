<template>
  <section id="ia" class="py-20 sm:py-24" aria-labelledby="ia-heading">
    <div class="section-shell">
      <div class="grid overflow-hidden rounded-3xl border border-vogel-blue/40 bg-vogel-navy shadow-glow lg:grid-cols-[0.95fr_1.05fr]">
        <div class="px-6 py-10 sm:px-10">
          <SectionHeading
            eyebrow="IA para empresas"
            title="Inteligencia artificial aplicada al negocio real"
            description="Implementamos IA donde realmente genera valor: análisis de datos, asistentes internos, automatización de tareas, atención al cliente y apoyo a la toma de decisiones."
          />

          <div class="mt-10 grid gap-4 sm:grid-cols-2">
            <article
              v-for="item in aiCases"
              :key="item"
              class="rounded-xl border border-vogel-gray/20 bg-vogel-deep/70 p-4 text-sm font-medium text-vogel-gray transition hover:-translate-y-1 hover:border-vogel-blue/70 hover:bg-vogel-deep"
            >
              {{ item }}
            </article>
          </div>
        </div>

        <div class="relative min-h-80 overflow-hidden border-t border-vogel-gray/10 lg:border-l lg:border-t-0">
          <img
            :src="aiOperations"
            alt="Flujo de inteligencia artificial conectando reportes, planillas, dashboards y automatizaciones"
            class="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-vogel-navy/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-vogel-navy/20"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from "./SectionHeading.vue";
import aiOperations from "../assets/ia/ai-operations.webp";

const aiCases = [
  "Chatbots internos",
  "Análisis de Excel, PDF y bases de datos",
  "Automatización de respuestas",
  "Asistentes para gerentes",
  "Talleres prácticos para equipos",
];
</script>
