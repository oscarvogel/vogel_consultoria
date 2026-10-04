<script setup>
import StoryArtifact from './StoryArtifact.vue';
import ChapterVisual from './ChapterVisual.vue';
const pairs=[
 ['Información repartida en planillas','Sistemas que conectan áreas y conservan el contexto de cada operación.'],
 ['Reportes que llegan tarde','Dashboards con indicadores críticos y detalle para decidir con información confiable.'],
 ['Tareas manuales que se repiten','Automatización de procesos con reglas, trazabilidad y control humano.'],
 ['IA sin un punto de partida claro','Casos de uso acotados y capacitación para aplicar herramientas con criterio.']
];
const frames=[
 {mode:'order',label:'Información dispersa → registro común'},
 {mode:'decide',label:'Registro → vista de gestión'},
 {mode:'automate',label:'Tareas → flujo supervisado'},
 {mode:'assist',label:'Asistencia dentro de un proceso definido'},
];
</script>
<template>
 <section id="soluciones" class="section-space" data-narrative-steps data-chapter="problems" aria-labelledby="problemas-heading">
  <div class="section-shell">
   <h2 id="problemas-heading" class="section-title">Tu operación ya tiene datos.<br>Hagamos que trabajen juntos.</h2>
   <p class="section-description">Partimos de las fricciones del negocio para definir qué ordenar, qué conectar y qué automatizar.</p>
   <div class="chapter-layout">
    <dl class="chapter-copy" data-narrative-copy>
     <div v-for="([problem,solution],index) in pairs" :key="problem" class="chapter-step" data-narrative-step>
      <dt><span class="chapter-step-index">{{ String(index+1).padStart(2,'0') }} / 04</span>{{ problem }}</dt>
      <dd>{{ solution }}<div class="chapter-mobile-art"><StoryArtifact :mode="frames[index].mode" /></div></dd>
     </div>
    </dl>
    <ChapterVisual :frames="frames" />
   </div>
  </div>
 </section>
</template>
