<script setup>
const customGptUrl = "https://chatgpt.com/g/g-6a1f60761f0c8191a2291feca1606592-vogel-ia-contable-comercial";
const shareText = "Hola, te comparto Vogel IA Contable Comercial, un GPT de Vogel Consultoria para consultas contables, comerciales y de IA aplicada: ";
const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}${customGptUrl}`)}`;
const buildGptUrl = "https://wa.me/543743667526?text=Hola%20Oscar%2C%20quiero%20crear%20un%20GPT%20personalizado%20para%20mi%20empresa%20o%20estudio";

const useCases = [
  "Responder consultas frecuentes con el criterio de tu negocio.",
  "Guiar procesos internos, ventas, administracion o atencion al cliente.",
  "Ordenar conocimiento de tu equipo en un asistente facil de compartir.",
];
</script>

<template>
  <section class="py-18 sm:py-22" aria-labelledby="gpt-personalizado-heading">
    <div class="section-shell">
      <div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <div class="reveal relative overflow-hidden rounded-3xl border border-vogel-gray/20 bg-white/[0.06] p-6 shadow-glow sm:p-8">
          <div class="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(242,169,0,0.12),rgba(30,95,168,0.18)_42%,rgba(15,42,68,0.92))]"></div>

          <p class="text-sm font-semibold uppercase tracking-[0.15em] text-vogel-amber">GPT personalizado</p>
          <h2 id="gpt-personalizado-heading" class="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            Probá Vogel IA Contable Comercial
          </h2>
          <p class="mt-5 text-base leading-relaxed text-vogel-muted sm:text-lg">
            Un asistente creado para acercar consultas contables, comerciales y de inteligencia artificial aplicada a estudios, empresas y profesionales.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              :href="customGptUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center rounded-full border border-vogel-amber bg-vogel-amber px-6 py-3 text-sm font-semibold text-vogel-deep transition hover:-translate-y-0.5 hover:bg-white"
              data-analytics-cta="custom_gpt_open"
              data-analytics-funnel="lead_journey"
              data-analytics-step="ia_custom_gpt"
            >
              Abrir el GPT
            </a>
            <a
              :href="whatsappShareUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center rounded-full border border-vogel-gray/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-vogel-amber hover:text-vogel-amber"
              data-analytics-cta="custom_gpt_share_whatsapp"
              data-analytics-funnel="lead_journey"
              data-analytics-step="ia_custom_gpt"
            >
              Compartir por WhatsApp
            </a>
          </div>
        </div>

        <div class="reveal reveal-d2 rounded-3xl border border-vogel-blue/35 bg-vogel-navy/65 p-6 sm:p-8">
          <p class="text-sm font-semibold uppercase tracking-[0.15em] text-vogel-blueLight">Tambien para tu organizacion</p>
          <h3 class="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
            Creamos GPTs a medida para empresas, estudios y equipos
          </h3>
          <ul class="mt-6 grid gap-3">
            <li
              v-for="(item, i) in useCases"
              :key="item"
              class="reveal rounded-xl border border-vogel-gray/15 bg-white/[0.04] p-4 text-sm leading-relaxed text-vogel-muted"
              :class="`reveal-d${(i % 3) + 1}`"
            >
              <span class="mr-2 text-vogel-amber">✓</span>{{ item }}
            </li>
          </ul>
          <a
            :href="buildGptUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-7 inline-flex items-center justify-center rounded-full border border-vogel-blue bg-vogel-blue px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-vogel-amber hover:bg-vogel-amber hover:text-vogel-deep"
            data-analytics-cta="custom_gpt_build_whatsapp"
            data-analytics-funnel="lead_journey"
            data-analytics-step="ia_custom_gpt"
          >
            Quiero mi GPT personalizado
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
