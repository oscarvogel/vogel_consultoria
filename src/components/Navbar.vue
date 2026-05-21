<template>
  <header class="sticky top-0 z-50 border-b border-vogel-gray/10 bg-vogel-deep/85 backdrop-blur" role="banner" @keydown.esc="isOpen = false">
    <div class="section-shell flex h-20 items-center justify-between">
      <a href="#inicio" class="flex items-center gap-3">
        <img :src="logoVogel" alt="Logo Vogel Consultoría" class="h-11 w-auto rounded-sm" loading="eager" decoding="async" />
        <div class="hidden sm:block">
          <p class="text-sm font-semibold uppercase tracking-[0.12em] text-vogel-gray">Vogel Consultoría</p>
          <p class="text-xs text-vogel-gray/70">Soluciones integrales para empresas</p>
        </div>
      </a>

      <nav class="hidden items-center gap-7 lg:flex" role="navigation" aria-label="Navegación principal">
        <template v-for="item in links" :key="item.href">
          <div v-if="item.children" class="group relative">
            <a
              :href="item.href"
              class="inline-flex items-center gap-1 text-sm font-medium text-vogel-gray transition hover:text-white"
              aria-label="Servicios"
              :data-analytics-cta="item.analyticsCta"
              :data-analytics-funnel="item.analyticsFunnel"
              :data-analytics-step="item.analyticsStep"
            >
              {{ item.label }}
              <svg class="h-3.5 w-3.5 transition group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
              </svg>
            </a>
            <div
              class="invisible absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-2xl border border-vogel-gray/15 bg-vogel-navy/95 p-3 opacity-0 shadow-glow backdrop-blur transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
            >
              <a
                v-for="service in item.children"
                :key="service.href"
                :href="service.href"
                class="block rounded-xl px-4 py-3 transition hover:bg-vogel-blue/15 focus:bg-vogel-blue/15"
                :data-analytics-cta="service.analyticsCta"
                data-analytics-funnel="lead_journey"
                data-analytics-step="navbar_services"
              >
                <span class="block text-sm font-bold text-white">{{ service.label }}</span>
                <span class="mt-1 block text-xs leading-relaxed text-vogel-muted">{{ service.description }}</span>
              </a>
            </div>
          </div>
          <a
            v-else
            :href="item.href"
            class="text-sm font-medium text-vogel-gray transition hover:text-white"
            :data-analytics-cta="item.analyticsCta"
            :data-analytics-funnel="item.analyticsFunnel"
            :data-analytics-step="item.analyticsStep"
          >
            {{ item.label }}
          </a>
        </template>
      </nav>

      <div class="hidden lg:block">
        <ActionButton
          label="Agendar reunión"
          href="#contacto"
          data-analytics-cta="navbar_schedule_desktop"
          data-analytics-funnel="lead_journey"
          data-analytics-step="home"
        />
      </div>

      <button
        type="button"
        class="inline-flex rounded-md border border-vogel-gray/30 p-2 text-vogel-gray lg:hidden"
        @click="isOpen = !isOpen"
        :aria-expanded="isOpen ? 'true' : 'false'"
        aria-controls="mobile-nav"
        :aria-label="isOpen ? 'Cerrar menú' : 'Abrir menú'"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <div v-if="isOpen" id="mobile-nav" class="border-t border-vogel-gray/15 bg-vogel-navy lg:hidden" role="navigation" aria-label="Navegación móvil">
      <div class="section-shell flex flex-col gap-3 py-5">
        <a
          v-for="item in links"
          :key="item.href"
          :href="item.href"
          class="text-sm font-medium text-vogel-gray hover:text-white"
          :data-analytics-cta="item.analyticsCta"
          :data-analytics-funnel="item.analyticsFunnel"
          :data-analytics-step="item.analyticsStep"
          @click="isOpen = false"
        >
          {{ item.label }}
        </a>
        <div class="rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-3">
          <p class="px-2 text-xs font-bold uppercase tracking-[0.22em] text-vogel-amber">Servicios</p>
          <div class="mt-2 grid gap-1">
            <a
              v-for="service in serviceLinks"
              :key="service.href"
              :href="service.href"
              class="rounded-xl px-3 py-2 text-sm font-medium text-vogel-gray hover:bg-vogel-blue/15 hover:text-white"
              :data-analytics-cta="service.analyticsCta"
              data-analytics-funnel="lead_journey"
              data-analytics-step="mobile_services"
              @click="isOpen = false"
            >
              {{ service.label }}
            </a>
          </div>
        </div>
        <ActionButton
          label="Agendar reunión"
          href="#contacto"
          data-analytics-cta="navbar_schedule_mobile"
          data-analytics-funnel="lead_journey"
          data-analytics-step="home"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import ActionButton from "./ActionButton.vue";
import logoVogel from "../assets/brand/logo-vogel-generated.webp";

const isOpen = ref(false);

const serviceLinks = [
  {
    label: "Sistemas a medida",
    href: "/sistemas-a-medida/",
    description: "Procesos, trazabilidad y operaciones ordenadas.",
    analyticsCta: "navbar_service_sistemas",
  },
  {
    label: "Dashboards ejecutivos",
    href: "/dashboards-ejecutivos/",
    description: "Indicadores claros para direccion y gestion.",
    analyticsCta: "navbar_service_dashboards",
  },
  {
    label: "Automatizacion de procesos",
    href: "/automatizacion-de-procesos/",
    description: "Menos carga manual y menos errores repetitivos.",
    analyticsCta: "navbar_service_automatizacion",
  },
  {
    label: "Inteligencia artificial",
    href: "/ia.html",
    description: "IA aplicada a tareas, datos y decisiones.",
    analyticsCta: "navbar_service_ia",
  },
  {
    label: "Talleres IA",
    href: "/talleres-ia/",
    description: "Capacitacion practica para equipos.",
    analyticsCta: "navbar_service_talleres",
  },
  {
    label: "Desarrollo web",
    href: "/desarrollo-web/",
    description: "Sitios claros, rapidos y orientados a conversion.",
    analyticsCta: "navbar_service_web",
  },
];

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Charla IA", href: "#charla-ia-2026" },
  {
    label: "Servicios",
    href: "#servicios",
    children: serviceLinks,
    analyticsCta: "navbar_services_menu",
    analyticsFunnel: "lead_journey",
    analyticsStep: "home",
  },
  { label: "Soluciones", href: "#soluciones" },
  {
    label: "IA",
    href: "/ia.html",
    analyticsCta: "navbar_go_to_ia",
    analyticsFunnel: "lead_journey",
    analyticsStep: "home",
  },
  { label: "Nosotros", href: "#nosotros" },
  {
    label: "Contacto",
    href: "#contacto",
    analyticsCta: "navbar_contact_link",
    analyticsFunnel: "lead_journey",
    analyticsStep: "home",
  },
];
</script>
