<template>
  <header class="sticky top-0 z-50 border-b border-vogel-gray/10 bg-vogel-deep/85 backdrop-blur">
    <div class="section-shell flex h-20 items-center justify-between">
      <a href="#inicio" class="flex items-center gap-3">
        <img :src="logoVogel" alt="Logo Vogel Consultoría" class="h-11 w-auto rounded-sm" />
        <div class="hidden sm:block">
          <p class="text-sm font-semibold uppercase tracking-[0.12em] text-vogel-gray">Vogel Consultoría</p>
          <p class="text-xs text-vogel-gray/70">Soluciones integrales para empresas</p>
        </div>
      </a>

      <nav class="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
        <a v-for="item in links" :key="item.href" :href="item.href" class="text-sm font-medium text-vogel-gray transition hover:text-white">
          {{ item.label }}
        </a>
      </nav>

      <div class="hidden lg:block">
        <ActionButton label="Agendar reunión" href="#contacto" />
      </div>

      <button
        type="button"
        class="inline-flex rounded-md border border-vogel-gray/30 p-2 text-vogel-gray lg:hidden"
        @click="isOpen = !isOpen"
        aria-label="Abrir menú"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <div v-if="isOpen" class="border-t border-vogel-gray/15 bg-vogel-navy lg:hidden">
      <div class="section-shell flex flex-col gap-3 py-5">
        <a
          v-for="item in links"
          :key="item.href"
          :href="item.href"
          class="text-sm font-medium text-vogel-gray hover:text-white"
          @click="isOpen = false"
        >
          {{ item.label }}
        </a>
        <ActionButton label="Agendar reunión" href="#contacto" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import ActionButton from "./ActionButton.vue";
import logoVogel from "../assets/brand/logo-vogel-generated.png";

const isOpen = ref(false);

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Soluciones", href: "#soluciones" },
  { label: "IA", href: "/ia.html" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];
</script>
