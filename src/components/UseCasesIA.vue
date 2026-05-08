<template>
  <section class="py-18 sm:py-22" aria-labelledby="casos-ia-heading">
    <div class="section-shell">
      <div class="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <h2 id="casos-ia-heading" class="reveal font-display text-3xl font-bold text-white sm:text-4xl">Casos de uso que un dueño entiende al instante</h2>
          <div class="mt-10 grid gap-5 md:grid-cols-2">
            <article
              v-for="(item, i) in useCases"
              :key="item"
              class="reveal card-hover rounded-2xl p-5"
              :class="`reveal-d${(i % 3) + 1}`"
            >
              <p class="text-base font-semibold leading-relaxed text-white">{{ item }}</p>
            </article>
          </div>
        </div>

        <div class="reveal reveal-d2 relative overflow-hidden rounded-3xl border border-vogel-blue/35 bg-white/5 p-3 shadow-glow">
          <img
            :src="useCasesImage"
            alt="IA analizando Excel, PDF, bases de datos y reportes para generar alertas e indicadores"
            class="aspect-[16/10] w-full rounded-2xl object-cover"
          />
          <div class="pointer-events-none absolute inset-3 rounded-2xl bg-gradient-to-t from-vogel-deep/65 via-transparent to-transparent"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import useCasesImage from "../assets/ia/ai-use-cases.png";

const useCases = [
  "Consultás tus ventas y la IA te responde en segundos",
  "Subís un Excel o PDF y obtenés análisis automático",
  "Automatizás respuestas a clientes",
  "Recibís reportes con alertas y oportunidades",
  "Tenés un asistente que responde como un analista",
];
</script>
