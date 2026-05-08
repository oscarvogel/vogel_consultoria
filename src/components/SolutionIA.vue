<template>
  <section class="py-18 sm:py-22">
    <div class="section-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div class="reveal">
        <p class="text-sm font-semibold uppercase tracking-[0.15em] text-vogel-amber">Solución</p>
        <h2 class="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
          Llevamos la inteligencia artificial a tu negocio de forma simple y aplicada
        </h2>
        <p class="mt-5 max-w-2xl text-base leading-relaxed text-vogel-muted sm:text-lg">
          No hablamos de herramientas. Diseñamos soluciones concretas para tu operación.
        </p>
      </div>

      <div class="reveal reveal-d2 overflow-hidden rounded-3xl border border-vogel-gray/20 bg-white/5 p-3 shadow-glow">
        <img
          :src="automationAssistant"
          alt="Asistente interno con IA coordinando automatizaciones, respuestas y sistemas conectados"
          class="aspect-[16/10] w-full rounded-2xl object-cover"
        />
        <div class="p-4">
          <h3 class="font-display text-lg font-semibold text-white">Enfoque de negocio</h3>
          <p class="mt-3 text-sm leading-relaxed text-vogel-muted">
            Definimos primero el resultado que necesitás lograr y recién después elegimos la tecnología necesaria para conseguirlo.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import automationAssistant from "../assets/ia/ai-automation-assistant.png";
</script>
