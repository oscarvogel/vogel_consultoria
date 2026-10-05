<script setup>
import field from '../assets/cases/forestal-campo.png';
import LandscapeTraces from './LandscapeTraces.vue';
import review from '../assets/cases/forestal-revision.png';
import dashboard from '../assets/cases/forestal-dashboard.png';
import dashboardDesktop from '../assets/cases/forestal-dashboard-desktop.png';
const steps = [
 {label:'Registrar',title:'Registrar donde ocurre el trabajo.',text:'Equipo, proceso, tiempos y producción reunidos en un registro de campo.',image:field,height:901,alt:'Formulario de producción forestal con datos de demostración.'},
 {label:'Revisar',title:'Revisar antes de consolidar.',text:'El operador revisa la jornada. La información conserva su contexto y trazabilidad.',image:review,height:1449,alt:'Pantalla de revisión de un registro forestal ficticio.'},
 {label:'Decidir',title:'Convertir el registro en una decisión.',text:'Indicadores, evolución y detalle operativo en una vista compartida de producción.',image:dashboard,desktopImage:dashboardDesktop,height:1873,alt:'Dashboard operativo forestal. Todos los valores son ficticios.'},
];
</script>
<template>
 <section id="casos" class="home-section home-forest" data-home-chapter="forest" aria-labelledby="mini-cases-heading">
  <LandscapeTraces variant="evidence" />
  <div class="section-shell">
   <div class="section-introduction"><h2 id="mini-cases-heading" class="section-title">Del registro en campo<br>a la decisión operativa.</h2><p>Caso forestal anónimo.<br>Interfaz real · datos de demostración.<br>Las cifras no representan resultados de un cliente.</p></div>
   <div class="forest-track">
    <div class="forest-stage">
     <ol class="case-steps" aria-label="Del campo a la decisión">
      <li v-for="(step,index) in steps" :key="step.label" class="case-step" :class="{'step-current':index===0}"><span>{{ String(index+1).padStart(2,'0') }}</span><h3>{{ step.label }}</h3><p>{{ step.text }}</p></li>
     </ol>
     <div class="forest-screens">
      <figure v-for="(step,index) in steps" :key="step.label" class="case-screen">
       <div class="forest-image" :class="{'forest-image--dashboard':index===2}">
        <picture><source v-if="step.desktopImage" media="(min-width:1024px)" :srcset="step.desktopImage"/><img :src="step.image" :alt="step.alt" width="390" :height="step.height" loading="lazy" decoding="async"/></picture>
        <div v-if="index < 2" class="forest-context"><span>{{ step.label }} en campo</span><h4>{{ step.title }}</h4><p>{{ step.text }}</p></div>
       </div>
       <figcaption><span>{{ step.title }}</span><a :href="step.desktopImage || step.image" target="_blank" rel="noopener noreferrer" class="text-link" :aria-label="'Abrir captura completa: '+step.label">Abrir captura completa</a></figcaption>
      </figure>
     </div>
     <div class="forest-footer"><span>Interfaz real · datos de demostración</span><a href="/dashboards-ejecutivos/" class="text-link" data-analytics-cta="home_forest_dashboard">Conocer el servicio de dashboards</a></div>
    </div>
   </div>
  </div>
 </section>
</template>
