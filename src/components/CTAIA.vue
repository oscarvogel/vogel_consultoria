<template>
  <section class="pb-24 pt-10">
    <div class="section-shell">
      <div class="relative overflow-hidden rounded-3xl border border-vogel-amber/30 px-6 py-16 text-center sm:px-10 sm:py-20">
        <div class="ambient-blob h-80 w-80 bg-vogel-blue/30" style="top: -80px; left: -80px;"></div>
        <div class="ambient-blob h-60 w-60 bg-vogel-amber/20" style="bottom: -50px; right: -50px;"></div>
        <div class="absolute inset-0 -z-10 bg-gradient-to-br from-vogel-blue/30 via-vogel-deep to-vogel-navy"></div>

        <div class="relative reveal">
          <p class="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-vogel-amber">Tu próximo paso</p>
          <h2 class="mx-auto max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            La IA no es el futuro.<br class="hidden sm:block" />
            <span class="text-vogel-amber">Es una ventaja competitiva hoy.</span>
          </h2>
          <a
            :href="waLink"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-10 inline-flex rounded-full border border-vogel-amber bg-vogel-amber px-8 py-3.5 text-base font-semibold text-vogel-deep transition hover:-translate-y-0.5 hover:bg-white"
            data-analytics-cta="ia_final_whatsapp"
            data-analytics-funnel="lead_journey"
            data-analytics-step="ia"
          >
            Hablar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const waLink = "https://wa.me/543743667526?text=Hola%20quiero%20implementar%20IA%20en%20mi%20empresa";
</script>
