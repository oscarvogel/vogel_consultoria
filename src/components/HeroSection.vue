<template>
  <section
    id="inicio"
    class="relative isolate overflow-hidden pb-24 pt-16 sm:pt-24"
    data-analytics-view="home_entry"
    data-analytics-funnel="lead_journey"
    data-analytics-step="home"
  >
    <img
      :src="networkHero"
      alt=""
      class="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      aria-hidden="true"
      fetchpriority="high"
      decoding="async"
    />
    <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,42,68,0.97)_0%,rgba(15,42,68,0.86)_43%,rgba(11,32,53,0.28)_100%)]"></div>
    <div class="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-vogel-deep to-transparent"></div>

    <div class="section-shell grid min-w-0 items-center gap-14 lg:grid-cols-2">
      <div class="fade-up min-w-0">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-vogel-amber">Consultoría tecnológica premium</p>
        <h1 class="max-w-[10.4em] text-[2.2rem] font-bold leading-[1.08] text-white sm:max-w-none sm:text-5xl lg:text-[3.5rem]">
          Sistemas, automatización e IA para aumentar rentabilidad
        </h1>
        <p class="mt-6 max-w-[34ch] text-base leading-relaxed text-vogel-gray/90 sm:max-w-2xl sm:text-lg">
          Implementamos soluciones concretas para ordenar operaciones, ahorrar tiempo y decidir con datos confiables.
        </p>

        <div class="mt-9 flex flex-wrap items-center gap-4">
          <ActionButton
            label="Ver soluciones"
            href="#soluciones"
            data-analytics-cta="hero_view_solutions"
            data-analytics-funnel="lead_journey"
            data-analytics-step="home"
          />
          <ActionButton
            label="Hablar por WhatsApp"
            href="https://wa.me/543743667526"
            :external="true"
            variant="secondary"
            data-analytics-cta="hero_whatsapp"
            data-analytics-funnel="lead_journey"
            data-analytics-step="home"
          />
        </div>
      </div>

      <div class="fade-up-delay relative min-w-0 overflow-hidden">
        <div class="glass-panel overflow-hidden rounded-3xl p-3 shadow-glow sm:p-4">
          <img
            :src="dashboardMockup"
            alt="Dashboard ejecutivo con indicadores, gráficos y alertas de negocio"
            class="aspect-[4/3] w-full rounded-2xl object-cover"
            loading="lazy"
            decoding="async"
          />
          <div class="mt-4 rounded-2xl border border-vogel-blue/40 bg-gradient-to-r from-vogel-blue/25 to-vogel-amber/10 p-5">
            <p class="text-sm font-semibold text-vogel-amber">Visión 360 del negocio</p>
            <p class="mt-2 text-sm leading-relaxed text-vogel-gray/90">
              Integración de datos, seguimiento de KPIs y automatización en una misma plataforma para decisiones rápidas y confiables.
            </p>
          </div>
        </div>

        <div class="pulse-ring absolute -bottom-4 -left-4 h-14 w-14 rounded-full bg-vogel-amber/20"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ActionButton from "./ActionButton.vue";
import networkHero from "../assets/hero/network-intelligence.webp";
import dashboardMockup from "../assets/hero/dashboard-mockup.webp";
</script>
