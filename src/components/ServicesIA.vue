<template>
  <section class="py-18 sm:py-22" aria-labelledby="servicios-ia-heading">
    <div class="section-shell">
      <h2 id="servicios-ia-heading" class="reveal font-display text-3xl font-bold text-white sm:text-4xl">Servicios IA</h2>
      <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(service, i) in services"
          :key="service"
          class="reveal card-hover rounded-xl p-4 text-sm font-medium text-vogel-muted"
          :class="`reveal-d${(i % 3) + 1}`"
        >
          {{ service }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const services = [
  "Talleres prácticos para equipos",
  "Asistentes internos con IA",
  "Automatización de procesos",
  "Integración con sistemas existentes",
  "Consultoría estratégica en IA",
];
</script>
