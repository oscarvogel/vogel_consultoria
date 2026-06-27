<script setup>
import { resources } from "../data/resources.js";
</script>

<template>
  <section id="recursos" class="py-16 sm:py-20" aria-labelledby="recursos-heading">
    <div class="section-shell">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="max-w-3xl">
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Recursos</p>
          <h2 id="recursos-heading" class="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Guias para decidir mejor antes de invertir
          </h2>
          <p class="mt-4 text-base leading-relaxed text-vogel-gray sm:text-lg">
            Contenido practico para detectar oportunidades, ordenar procesos y priorizar tecnologia con impacto real.
          </p>
        </div>
        <a
          href="/recursos/"
          class="inline-flex items-center justify-center rounded-full border border-vogel-amber/45 px-5 py-2.5 text-sm font-bold text-vogel-amber transition hover:bg-vogel-amber hover:text-vogel-navy"
          data-analytics-cta="home_resources_index"
          data-analytics-funnel="content_discovery"
          data-analytics-step="home"
        >
          Ver recursos
        </a>
      </div>

      <div class="mt-8 grid gap-4 lg:grid-cols-3">
        <article
          v-for="resource in resources"
          :key="resource.id"
          class="rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-vogel-amber/50 hover:bg-vogel-amber/5"
        >
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-vogel-blueLight">{{ resource.eyebrow }}</p>
          <h3 class="mt-4 font-display text-xl font-bold leading-tight text-white">
            <a :href="resource.path">{{ resource.shortTitle }}</a>
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-vogel-muted">{{ resource.summary }}</p>
          <a
            :href="resource.path"
            class="mt-5 inline-flex text-sm font-bold text-vogel-amber hover:text-white"
            data-analytics-cta="home_resource_read"
            :data-analytics-label="resource.id"
            data-analytics-location="home_resources"
          >
            Leer guia
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
