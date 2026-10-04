<script setup>
const pairs=[
 ['Información repartida en planillas','Sistemas que conectan áreas y conservan el contexto de cada operación.'],
 ['Reportes que llegan tarde','Dashboards con indicadores críticos y detalle para decidir con información confiable.'],
 ['Tareas manuales que se repiten','Automatización de procesos con reglas, trazabilidad y control humano.'],
 ['IA sin un punto de partida claro','Casos de uso acotados y capacitación para aplicar herramientas con criterio.']
];
</script>
<template><section id="soluciones" class="section-space" aria-labelledby="problemas-heading"><div class="section-shell problems-layout"><div data-story-reveal><h2 id="problemas-heading" class="section-title" data-text-reveal>Tu operación ya tiene datos.<br>Hagamos que trabajen juntos.</h2><p class="section-description">Partimos de las fricciones del negocio para definir qué ordenar, qué conectar y qué automatizar.</p></div><dl class="problem-list"><div v-for="[problem,solution] in pairs" :key="problem"><dt>{{ problem }}</dt><dd>{{ solution }}</dd></div></dl></div></section></template>
<style scoped>
.problems-layout{display:grid;grid-template-columns:1fr 1fr;gap:80px}.problem-list>div{padding:22px 0;border-bottom:1px solid var(--color-border)}.problem-list>div:first-child{padding-top:0}.problem-list dt{font-family:var(--font-display);font-size:22px;color:var(--color-heading);font-weight:600}.problem-list dd{margin:10px 0 0;color:var(--color-muted);line-height:1.7;max-width:52ch}@media(max-width:767px){.problems-layout{grid-template-columns:1fr;gap:36px}}
</style>
