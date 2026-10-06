<script setup>
import HomeChapterLabel from './HomeChapterLabel.vue';
const pairs = [
 ['Información repartida en planillas', 'Cada área trabaja con su versión. El contexto se pierde entre archivos.'],
 ['Reportes que llegan tarde', 'La información aparece después del momento en que hacía falta decidir.'],
 ['Tareas manuales que se repiten', 'Copiar, controlar y volver a cargar ocupa tiempo del equipo.'],
 ['IA sin un punto de partida claro', 'Hay herramientas disponibles, pero falta definir un proceso donde aporten valor.'],
];
</script>
<template>
 <section id="soluciones" class="home-chapter home-problems" data-home-chapter="problems" aria-labelledby="problemas-heading">
  <div class="section-shell">
   <HomeChapterLabel number="02" label="EL PROBLEMA" />
   <div class="home-problem-layout">
    <div><h2 id="problemas-heading" class="section-title">Tu operación ya tiene datos.<br><span>Hagamos que trabajen juntos.</span></h2><p class="section-description">Partimos de las fricciones del negocio para definir qué ordenar, qué conectar y qué automatizar.</p></div>
    <dl class="home-frictions" data-home-moment="problems">
     <div v-for="([problem, description], index) in pairs" :key="problem"><span class="home-friction-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span><dt>{{ problem }}</dt><dd>{{ description }}</dd></div>
    </dl>
   </div>
   <p class="home-handoff home-handoff--frame">Un mismo registro. Un contexto compartido.</p>
  </div>
 </section>
</template>
