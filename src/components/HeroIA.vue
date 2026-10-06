<script setup>
import ActionButton from "./ActionButton.vue";
import ProcessFlowDiagram from "./ProcessFlowDiagram.vue";
const waLink="https://wa.me/543743667526?text=Hola%20quiero%20implementar%20IA%20en%20mi%20empresa";
const flowNodes = [
  { title: "Información", description: "Fuentes y contexto definidos." },
  { title: "Asistencia", description: "Resumen, clasificación o borrador." },
  { title: "Revisión", description: "Una persona valida el resultado." },
  { title: "Proceso", description: "La salida vuelve al trabajo diario." },
];
</script>
<template>
  <section data-chapter="neutral" id="hero" class="section-space" aria-labelledby="ia-hero-heading">
    <div data-hero-stage class="section-shell grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <h1 id="ia-hero-heading" class="font-display text-[clamp(2.8rem,5vw,4.7rem)] font-bold leading-[1.05]">IA aplicada a tareas concretas.</h1>
        <p class="section-description mt-6">Definimos qué tarea puede asistir la IA, qué información necesita y cómo revisa el equipo cada resultado.</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <ActionButton label="Agendar diagnóstico" href="/#contacto" variant="accent" />
          <ActionButton label="Consultar por WhatsApp" :href="waLink" :external="true" variant="secondary" data-analytics-cta="ia_hero_whatsapp" data-analytics-funnel="lead_journey" data-analytics-step="ia" />
        </div>
        <p class="mt-6 text-sm text-vogel-muted">Asistentes · Automatización · Capacitación</p>
      </div>
      <ProcessFlowDiagram
        title="Información con contexto y validación humana"
        description="Las fuentes, el uso y la revisión se definen antes de integrar una asistencia."
        :nodes="flowNodes"
      />
    </div>
  </section>
</template>
