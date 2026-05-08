<template>
  <section class="py-18 sm:py-22">
    <div class="section-shell">
      <div class="relative overflow-hidden rounded-3xl border border-vogel-amber/40 px-6 py-12 sm:px-10 sm:py-14">
        <img
          :src="diagnosticRoadmap"
          alt=""
          class="absolute inset-0 -z-10 h-full w-full object-cover opacity-55"
          aria-hidden="true"
        />
        <div class="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(30,95,168,0.58),rgba(15,42,68,0.86)_48%,rgba(11,32,53,0.9))]"></div>

        <div class="relative reveal max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.14em] text-vogel-amber">Oferta</p>
          <h2 class="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Diagnóstico de IA para tu empresa</h2>
          <ul class="mt-7 grid gap-3 sm:grid-cols-2">
            <li v-for="(item, i) in offerItems" :key="item" class="reveal rounded-lg border border-vogel-gray/20 bg-white/10 p-3 text-sm text-vogel-muted" :class="`reveal-d${(i % 3) + 1}`">
              <span class="mr-2 text-vogel-amber">✓</span>{{ item }}
            </li>
          </ul>
          <a
            :href="waLink"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 inline-flex rounded-full border border-vogel-amber bg-vogel-amber px-7 py-3 text-sm font-semibold text-vogel-deep transition hover:-translate-y-0.5 hover:bg-white"
          >
            Solicitar diagnóstico por WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import diagnosticRoadmap from "../assets/ia/ai-diagnostic-roadmap.png";

const waLink = "https://wa.me/543743667526?text=Hola%20quiero%20implementar%20IA%20en%20mi%20empresa";

const offerItems = [
  "Reunión 1 a 1",
  "Identificación de oportunidades",
  "Casos concretos aplicables",
  "Recomendación de herramientas",
  "Propuesta de implementación",
];
</script>
