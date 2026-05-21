<script setup>
import { computed } from "vue";
import { getRelatedServices } from "../data/servicePages.js";
import FooterSection from "./FooterSection.vue";
import WhatsAppButton from "./WhatsAppButton.vue";

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});

const relatedServices = computed(() => getRelatedServices(props.page));
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <a class="skip-link" href="#service-content">Saltar al contenido principal</a>

    <main id="service-content" tabindex="-1">
      <section class="relative isolate overflow-hidden py-8 sm:py-10 lg:py-12">
        <div class="ambient-blob left-[-8rem] top-[-8rem] h-72 w-72 bg-vogel-blue/30"></div>
        <div class="ambient-blob bottom-[-10rem] right-[-6rem] h-80 w-80 bg-vogel-amber/10"></div>

        <div class="section-shell">
          <a
            href="/"
            class="inline-flex items-center gap-2 rounded-full border border-vogel-gray/20 bg-white/5 px-4 py-2 text-sm font-semibold text-vogel-gray transition hover:border-vogel-amber/55 hover:bg-vogel-amber/10 hover:text-white"
          >
            <span aria-hidden="true">←</span>
            Volver al sitio principal
          </a>

          <div class="grid min-w-0 gap-10 pt-12 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:pt-16">
            <div class="min-w-0 max-w-3xl">
              <p class="text-xs font-bold uppercase tracking-[0.32em] text-vogel-amber">{{ page.eyebrow }}</p>
              <h1 class="mt-5 max-w-full break-words font-display text-[2.55rem] font-bold leading-[1.02] text-white sm:text-5xl lg:text-6xl">
                {{ page.title }}
              </h1>
              <p class="mt-6 max-w-2xl text-lg leading-relaxed text-vogel-gray sm:text-xl">
                {{ page.summary }}
              </p>

              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  :href="page.ctaUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center rounded-full bg-vogel-amber px-6 py-3 text-sm font-bold text-vogel-navy shadow-glow transition hover:-translate-y-0.5 hover:bg-white"
                  data-analytics-event="whatsapp_click"
                  :data-analytics-label="page.id"
                  data-analytics-location="service_page"
                >
                  {{ page.ctaLabel }}
                </a>
                <a
                  href="/#servicios"
                  class="inline-flex items-center justify-center rounded-full border border-vogel-gray/25 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:border-vogel-blue/70 hover:bg-vogel-blue/15"
                >
                  Ver otros servicios
                </a>
              </div>
            </div>

            <div class="relative min-w-0 max-w-full">
              <div class="overflow-hidden rounded-3xl border border-vogel-gray/20 bg-white/5 p-3 shadow-glow">
                <img
                  :src="page.image"
                  :alt="page.imageAlt"
                  class="aspect-[16/11] w-full rounded-2xl object-cover"
                  decoding="async"
                  fetchpriority="high"
                />
              </div>
              <div class="absolute -bottom-6 left-5 right-5 rounded-2xl border border-vogel-blue/35 bg-vogel-navy/85 p-4 shadow-glow backdrop-blur-md sm:left-8 sm:right-8">
                <p class="text-xs font-bold uppercase tracking-[0.24em] text-vogel-blueLight">Respuesta corta</p>
                <p class="mt-2 text-sm leading-relaxed text-vogel-gray">{{ page.summary }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-20" aria-labelledby="problemas-heading">
        <div class="section-shell">
          <div class="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Problemas que resolvemos</p>
              <h2 id="problemas-heading" class="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Menos friccion, mas informacion util
              </h2>
            </div>
            <div class="grid gap-4 sm:grid-cols-3">
              <article
                v-for="problem in page.problems"
                :key="problem"
                class="rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-5 text-sm leading-relaxed text-vogel-gray"
              >
                {{ problem }}
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="py-8 sm:py-12" aria-labelledby="incluye-heading">
        <div class="section-shell">
          <div class="grid gap-5 lg:grid-cols-2">
            <article class="rounded-3xl border border-vogel-gray/20 bg-vogel-deep/55 p-6 shadow-glow sm:p-8">
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Que incluye</p>
              <h2 id="incluye-heading" class="mt-3 font-display text-3xl font-bold text-white">Trabajo concreto, no diagnostico eterno</h2>
              <ul class="mt-6 space-y-4">
                <li v-for="item in page.includes" :key="item" class="flex gap-3 text-sm leading-relaxed text-vogel-gray">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-vogel-amber"></span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </article>

            <article class="rounded-3xl border border-vogel-gray/20 bg-white/[0.04] p-6 sm:p-8">
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-blueLight">Proceso</p>
              <h2 class="mt-3 font-display text-3xl font-bold text-white">Como avanzamos</h2>
              <ol class="mt-6 space-y-4">
                <li v-for="(step, index) in page.process" :key="step" class="flex gap-4">
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-vogel-amber/45 bg-vogel-amber/10 text-sm font-bold text-vogel-amber">
                    {{ index + 1 }}
                  </span>
                  <span class="pt-1 text-sm leading-relaxed text-vogel-gray">{{ step }}</span>
                </li>
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section class="py-12 sm:py-16" aria-labelledby="entregables-heading">
        <div class="section-shell">
          <div class="rounded-3xl border border-vogel-gray/15 bg-vogel-navy/55 p-6 sm:p-8">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Entregables</p>
                <h2 id="entregables-heading" class="mt-3 font-display text-3xl font-bold text-white">Que queda funcionando</h2>
              </div>
              <a
                :href="page.ctaUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center rounded-full border border-vogel-amber/50 px-5 py-2.5 text-sm font-bold text-vogel-amber transition hover:bg-vogel-amber hover:text-vogel-navy"
                data-analytics-event="whatsapp_click"
                :data-analytics-label="page.id"
                data-analytics-location="service_page_deliverables"
              >
                Consultar alcance
              </a>
            </div>
            <div class="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div
                v-for="deliverable in page.deliverables"
                :key="deliverable"
                class="rounded-2xl border border-vogel-gray/15 bg-white/5 px-4 py-4 text-sm font-semibold text-white"
              >
                {{ deliverable }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-12 sm:py-16" aria-labelledby="faq-heading">
        <div class="section-shell max-w-5xl">
          <p class="text-center text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Preguntas frecuentes</p>
          <h2 id="faq-heading" class="mt-3 text-center font-display text-3xl font-bold text-white sm:text-4xl">
            Antes de empezar
          </h2>
          <div class="mt-8 space-y-3">
            <details
              v-for="faq in page.faqs"
              :key="faq.question"
              class="group rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-5"
            >
              <summary class="cursor-pointer list-none font-display text-lg font-bold text-white">
                <span class="flex items-center justify-between gap-4">
                  {{ faq.question }}
                  <span class="text-vogel-amber transition group-open:rotate-45" aria-hidden="true">+</span>
                </span>
              </summary>
              <p class="mt-4 text-sm leading-relaxed text-vogel-gray">{{ faq.answer }}</p>
            </details>
          </div>
        </div>
      </section>

      <section class="py-12 sm:py-16" aria-labelledby="relacionados-heading">
        <div class="section-shell">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-blueLight">Servicios relacionados</p>
              <h2 id="relacionados-heading" class="mt-3 font-display text-3xl font-bold text-white">Tambien puede servirte</h2>
            </div>
          </div>
          <div class="mt-7 grid gap-4 sm:grid-cols-3">
            <a
              v-for="service in relatedServices"
              :key="service.id"
              :href="service.path"
              class="rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-vogel-amber/50 hover:bg-vogel-amber/5"
            >
              <p class="font-display text-lg font-bold text-white">{{ service.shortTitle }}</p>
              <p class="mt-3 text-sm leading-relaxed text-vogel-muted">{{ service.summary }}</p>
            </a>
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-20" aria-labelledby="cta-heading">
        <div class="section-shell">
          <div class="rounded-3xl border border-vogel-amber/25 bg-gradient-to-br from-vogel-deep via-vogel-navy to-vogel-blue/35 p-7 text-center shadow-glow sm:p-10">
            <p class="text-xs font-bold uppercase tracking-[0.28em] text-vogel-amber">Proximo paso</p>
            <h2 id="cta-heading" class="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold text-white sm:text-4xl">
              Veamos si este servicio encaja con tu situacion actual
            </h2>
            <p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-vogel-gray sm:text-base">
              Una conversacion inicial alcanza para ordenar el problema, detectar oportunidades y definir si conviene avanzar con un diagnostico mas concreto.
            </p>
            <a
              :href="page.ctaUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-7 inline-flex items-center justify-center rounded-full bg-vogel-amber px-7 py-3 text-sm font-bold text-vogel-navy transition hover:-translate-y-0.5 hover:bg-white"
              data-analytics-event="whatsapp_click"
              :data-analytics-label="page.id"
              data-analytics-location="service_page_final"
            >
              {{ page.ctaLabel }}
            </a>
          </div>
        </div>
      </section>
    </main>

    <FooterSection />
    <WhatsAppButton />
  </div>
</template>
