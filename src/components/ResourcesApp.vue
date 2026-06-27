<script setup>
import { resources } from "../data/resources.js";
import Navbar from "./Navbar.vue";
import FooterSection from "./FooterSection.vue";
import WhatsAppButton from "./WhatsAppButton.vue";
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <a class="skip-link" href="#resources-content">Saltar al contenido principal</a>
    <Navbar />

    <main id="resources-content" tabindex="-1">
      <section class="relative isolate overflow-hidden py-16 sm:py-20">
        <div class="ambient-blob left-[-9rem] top-[-8rem] h-72 w-72 bg-vogel-blue/25"></div>
        <div class="ambient-blob bottom-[-10rem] right-[-8rem] h-80 w-80 bg-vogel-amber/10"></div>

        <div class="section-shell">
          <div class="max-w-3xl">
            <p class="text-xs font-bold uppercase tracking-[0.32em] text-vogel-amber">Recursos</p>
            <h1 class="mt-5 font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              Guias para ordenar tecnologia, datos e IA en empresas
            </h1>
            <p class="mt-6 text-lg leading-relaxed text-vogel-gray sm:text-xl">
              Ideas practicas para decidir mejor antes de invertir en sistemas, dashboards, automatizaciones o capacitacion.
            </p>
          </div>

          <div class="mt-12 grid gap-5 lg:grid-cols-3">
            <article
              v-for="resource in resources"
              :key="resource.id"
              class="rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-vogel-amber/50 hover:bg-vogel-amber/5"
            >
              <p class="text-xs font-bold uppercase tracking-[0.24em] text-vogel-blueLight">{{ resource.eyebrow }}</p>
              <h2 class="mt-4 font-display text-2xl font-bold leading-tight text-white">
                <a :href="resource.path">{{ resource.title }}</a>
              </h2>
              <p class="mt-4 text-sm leading-relaxed text-vogel-gray">{{ resource.summary }}</p>
              <div class="mt-5 flex items-center justify-between gap-4 text-xs font-semibold text-vogel-muted">
                <span>{{ resource.readTime }}</span>
                <span>{{ resource.published }}</span>
              </div>
              <a
                :href="resource.path"
                class="mt-6 inline-flex items-center justify-center rounded-full border border-vogel-amber/45 px-4 py-2 text-sm font-bold text-vogel-amber transition hover:bg-vogel-amber hover:text-vogel-navy"
                data-analytics-cta="resource_read"
                :data-analytics-label="resource.id"
                data-analytics-location="resources_index"
              >
                Leer guia
              </a>
            </article>
          </div>
        </div>
      </section>
    </main>

    <FooterSection />
    <WhatsAppButton />
  </div>
</template>
