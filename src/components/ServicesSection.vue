<script setup>
import { servicePages } from '../data/servicePages.js';
import LandscapeTraces from './LandscapeTraces.vue';
const ia={id:'ia',path:'/inteligencia-artificial/',shortTitle:'IA aplicada',summary:'Asistentes, análisis de documentos y adopción con supervisión.'};
const arca={id:'arca',path:'/automatizaciones/',shortTitle:'Automatizaciones ARCA',summary:'Flujos mensuales con evidencia por CUIT y control humano.'};
const steps=[
 {title:'Sistemas que ordenan.',problem:'Cuando la información está repartida.',text:'Unimos registros, tareas y permisos en una operación compartida, con contexto y trazabilidad.',ids:['sistemas-a-medida','mantenimiento-de-equipos','desarrollo-web']},
 {title:'Procesos que avanzan.',problem:'Cuando el trabajo se repite.',text:'Conectamos canales y automatizamos tareas con reglas claras, evidencia y puntos de revisión.',ids:['automatizacion-de-procesos','integraciones-whatsapp','contaflow-api-facturacion-electronica'],extra:[arca]},
 {title:'Datos que explican.',problem:'Cuando los reportes llegan tarde.',text:'Indicadores comparables para entender la operación y decidir con información confiable.',ids:['dashboards-ejecutivos']},
 {title:'IA con criterio.',problem:'Cuando falta un punto de partida.',text:'Aplicamos asistencia a tareas concretas y formamos al equipo para usarla con límites y validación.',ids:['talleres-ia'],extra:[ia]},
].map(step=>({...step,services:[...step.ids.map(id=>servicePages[id]),...(step.extra||[])]}));
</script>
<template>
 <section id="soluciones" class="home-section solutions-section" aria-labelledby="servicios-heading">
  <LandscapeTraces />
  <div id="servicios" class="section-shell">
   <div class="section-introduction"><h2 id="servicios-heading" class="section-title">Menos fricción.<br>Más control de tu operación.</h2><p class="section-description">La solución empieza por entender el proceso. Combinamos sistemas, automatización, datos e IA según lo que tu empresa necesita resolver.</p></div>
   <div class="capabilities-grid">
    <article v-for="(step,index) in steps" :key="step.title" class="capability">
     <svg class="capability-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true"><template v-if="index===0"><rect x="5" y="5" width="12" height="12" rx="2"/><rect x="23" y="5" width="12" height="12" rx="2"/><rect x="5" y="23" width="12" height="12" rx="2"/><rect x="23" y="23" width="12" height="12" rx="2"/></template><template v-else-if="index===1"><path d="M7 20h26m-8-8 8 8-8 8"/><circle cx="7" cy="20" r="4"/></template><template v-else-if="index===2"><path d="M6 5v29h29M12 26v-8m8 8V9m8 17V14"/></template><template v-else><path d="m20 5 4 11 11 4-11 4-4 11-4-11-11-4 11-4 4-11Z"/></template></svg>
     <p class="capability-problem">{{ step.problem }}</p><h3>{{ step.title }}</h3><p>{{ step.text }}</p>
     <div class="chapter-service-links"><a v-for="service in step.services" :key="service.id" :id="service.id==='ia'?'ia':undefined" :href="service.path" :data-analytics-cta="service.id==='arca'?'home_automatizaciones_arca':'home_service_'+service.id">{{ service.shortTitle }}<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg></a></div>
    </article>
   </div>
  </div>
 </section>
</template>
