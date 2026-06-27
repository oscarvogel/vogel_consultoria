<script setup>
import { computed } from "vue";
import { getRelatedServices } from "../data/servicePages.js";
import Navbar from "./Navbar.vue";
import FooterSection from "./FooterSection.vue";
import WhatsAppButton from "./WhatsAppButton.vue";

const props = defineProps({
  resource: {
    type: Object,
    required: true,
  },
  service: {
    type: Object,
    required: true,
  },
});

const relatedServices = computed(() => getRelatedServices(props.service));
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <a class="skip-link" href="#article-content">Saltar al contenido principal</a>
    <Navbar />

    <main id="article-content" tabindex="-1">
      <article>
        <header class="relative isolate overflow-hidden py-14 sm:py-20">
          <div class="ambient-blob left-[-8rem] top-[-8rem] h-72 w-72 bg-vogel-blue/25"></div>
          <div class="section-shell max-w-5xl">
            <a href="/recursos/" class="text-sm font-bold text-vogel-amber hover:text-white">Recursos</a>
            <p class="mt-8 text-xs font-bold uppercase tracking-[0.32em] text-vogel-blueLight">{{ resource.eyebrow }}</p>
            <h1 class="mt-5 font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
              {{ resource.title }}
            </h1>
            <p class="mt-6 max-w-3xl text-lg leading-relaxed text-vogel-gray sm:text-xl">
              {{ resource.summary }}
            </p>
            <div class="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-vogel-muted">
              <span>{{ resource.readTime }}</span>
              <span aria-hidden="true">/</span>
              <time :datetime="resource.published">{{ resource.published }}</time>
            </div>
          </div>
        </header>

        <section class="py-8 sm:py-12">
          <div class="section-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div class="space-y-8">
              <section
                v-for="section in resource.sections"
                :key="section.heading"
                class="rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-6 sm:p-8"
              >
                <h2 class="font-display text-2xl font-bold text-white sm:text-3xl">{{ section.heading }}</h2>
                <p class="mt-4 text-base leading-8 text-vogel-gray">{{ section.body }}</p>
              </section>
            </div>

            <aside class="rounded-2xl border border-vogel-amber/25 bg-vogel-navy/70 p-6 shadow-glow lg:sticky lg:top-28">
              <p class="text-xs font-bold uppercase tracking-[0.24em] text-vogel-amber">Checklist rapido</p>
              <ul class="mt-5 space-y-3">
                <li v-for="item in resource.checklist" :key="item" class="flex gap-3 text-sm leading-relaxed text-vogel-gray">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-vogel-amber"></span>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <a
                :href="resource.ctaUrl"
                class="mt-7 inline-flex w-full items-center justify-center rounded-full bg-vogel-amber px-5 py-3 text-sm font-bold text-vogel-navy transition hover:-translate-y-0.5 hover:bg-white"
                data-analytics-cta="resource_service_cta"
                :data-analytics-label="resource.id"
                data-analytics-location="resource_article"
              >
                {{ resource.ctaText }}
              </a>
            </aside>
          </div>
        </section>

        <section class="py-12 sm:py-16" aria-labelledby="related-heading">
          <div class="section-shell">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-blueLight">Siguiente paso</p>
                <h2 id="related-heading" class="mt-3 font-display text-3xl font-bold text-white">Servicios relacionados</h2>
              </div>
            </div>
            <div class="mt-7 grid gap-4 sm:grid-cols-3">
              <a
                v-for="related in relatedServices"
                :key="related.id"
                :href="related.path"
                class="rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-vogel-amber/50 hover:bg-vogel-amber/5"
              >
                <p class="font-display text-lg font-bold text-white">{{ related.shortTitle }}</p>
                <p class="mt-3 text-sm leading-relaxed text-vogel-muted">{{ related.summary }}</p>
              </a>
            </div>
          </div>
        </section>
      </article>
    </main>

    <FooterSection />
    <WhatsAppButton />
  </div>
</template>
