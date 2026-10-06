<script setup>
import ActionButton from "./ActionButton.vue";
const diagnosticItems = [
  "Contexto del equipo y de sus tareas",
  "Fuentes de información y herramientas disponibles",
  "Casos concretos para probar",
  "Criterios de revisión, permisos y alcance",
];
</script>

<template>
  <section id="diagnostico" class="section-space">
    <div class="section-shell grid gap-10 border-t border-vogel-gray/20 pt-12 lg:grid-cols-[1fr_0.8fr]">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-vogel-amber">Próximo paso</p>
        <h2 class="section-title mt-3 max-w-3xl">Definamos un uso de IA con contexto.</h2>
        <p class="section-description mt-5">La conversación sirve para elegir una tarea, revisar su información y acordar cómo comprobar si la asistencia aporta valor.</p>
        <div class="mt-7 flex flex-wrap gap-3">
          <ActionButton label="Agendar diagnóstico" href="/#contacto" variant="accent" data-analytics-cta="ia_offer_diagnostic_whatsapp" data-analytics-funnel="lead_journey" data-analytics-step="ia" />
          <ActionButton label="Consultar por WhatsApp" href="https://wa.me/543743667526" :external="true" variant="secondary" data-analytics-cta="ia_final_whatsapp" data-analytics-funnel="lead_journey" data-analytics-step="ia" />
        </div>
      </div>
      <ul class="ia-diagnostic-list">
        <li v-for="item in diagnosticItems" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.ia-diagnostic-list{margin:0;padding:0;list-style:none;border-top:1px solid var(--color-border)}
.ia-diagnostic-list li{padding:18px 0;border-bottom:1px solid var(--color-border);font-size:15px;line-height:1.5;color:var(--color-text)}
</style>
