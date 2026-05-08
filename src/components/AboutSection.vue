<template>
  <section id="nosotros" class="py-20 sm:py-24" aria-labelledby="nosotros-heading">
    <div class="section-shell grid gap-8 lg:grid-cols-2">
      <div class="reveal rounded-3xl border border-vogel-gray/20 bg-vogel-deep/60 p-8 sm:p-10">
        <SectionHeading id="nosotros-heading" eyebrow="Sobre nosotros" title="Tecnología con criterio de negocio" />
        <p class="mt-5 text-base leading-relaxed text-vogel-muted">
          En Vogel Consultoría ayudamos a empresas a ordenar, automatizar y potenciar sus operaciones mediante tecnología.
          Combinamos experiencia en sistemas, datos e inteligencia artificial para generar soluciones concretas, simples de usar y
          orientadas a resultados.
        </p>
      </div>
      <div class="reveal reveal-d2 relative flex items-center justify-center overflow-hidden rounded-3xl border border-vogel-amber/30 bg-gradient-to-br from-vogel-blue/15 to-vogel-navy p-10 text-center">
        <div class="ambient-blob h-40 w-40 bg-vogel-amber/10" style="top: -20px; right: -20px;"></div>
        <p class="relative font-display text-2xl font-bold leading-snug text-vogel-amber sm:text-3xl">
          "No vendemos software.<br />Resolvemos problemas."
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from "./SectionHeading.vue";
</script>
