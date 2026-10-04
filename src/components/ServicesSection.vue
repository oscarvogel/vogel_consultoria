<script setup>
import {servicePages} from '../data/servicePages.js';
import ChapterVisual from './ChapterVisual.vue';
import StoryArtifact from './StoryArtifact.vue';
import dashboard from '../assets/cases/forestal-dashboard-desktop.png';
const ia={id:'ia',path:'/inteligencia-artificial/',shortTitle:'Inteligencia artificial aplicada',summary:'Asistentes, análisis y automatizaciones para procesos concretos, con criterio y supervisión.'};
const arca={id:'arca',path:'/automatizaciones/',shortTitle:'Automatizaciones ARCA para estudios contables.',summary:'Flujos mensuales para retenciones, percepciones y clientes delegados, con evidencia por CUIT y control humano.'};
const steps=[
 {title:'Ordenar.',text:'Registros y tareas adquieren una estructura compartida. La operación conserva el contexto de cada dato.',mode:'order',ids:['sistemas-a-medida','mantenimiento-de-equipos']},
 {title:'Conectar.',text:'Las áreas y los canales intercambian información: del contacto con el cliente al sistema que sostiene la operación.',mode:'connect',ids:['desarrollo-web','integraciones-whatsapp','contaflow-api-facturacion-electronica']},
 {title:'Automatizar.',text:'El flujo avanza con reglas, evidencia y puntos de revisión. El equipo mantiene el control del proceso.',mode:'automate',ids:['automatizacion-de-procesos'],extra:[arca]},
 {title:'Decidir.',text:'La información se convierte en una vista de gestión. IA aplicada al negocio real: asistentes internos, análisis de Excel y PDF, automatización de respuestas y apoyo a la gestión.',mode:'decide',ids:['dashboards-ejecutivos','talleres-ia'],extra:[ia]},
].map(step=>({...step,services:[...step.ids.map(id=>servicePages[id]),...(step.extra||[])]}));
const frames=steps.map((step,index)=>({mode:step.mode,label:step.title,...(index===3?{image:dashboard,demo:true}:{})}));
</script>
<template>
 <section id="servicios" class="section-space" data-narrative-steps data-chapter="services" aria-labelledby="servicios-heading">
  <div class="section-shell">
   <h2 id="servicios-heading" class="section-title">La tecnología adecuada<br>para cada proceso.</h2>
   <p class="section-description">Combinamos sistemas, datos y visión de negocio. El alcance se define por el problema que necesitás resolver.</p>
   <div class="chapter-layout">
    <ol class="chapter-copy" data-narrative-copy>
     <li v-for="(step,index) in steps" :key="step.title" class="chapter-step" data-narrative-step>
      <span class="chapter-step-index">{{ String(index+1).padStart(2,'0') }} / 04</span>
      <h3>{{ step.title }}</h3><p>{{ step.text }}</p>
      <div class="chapter-service-links">
       <a v-for="service in step.services" :key="service.id" :id="service.id==='ia'?'ia':undefined" :href="service.path" :data-analytics-cta="service.id==='arca'?'home_automatizaciones_arca':'home_service_'+service.id">
        <strong>{{ service.shortTitle }}<span aria-hidden="true">↗</span></strong><p>{{ service.summary }}</p>
       </a>
      </div>
      <div class="chapter-mobile-art" aria-hidden="true"><img v-if="index===3" :src="dashboard" alt="" width="1440" height="1151" loading="lazy"/><StoryArtifact v-else :mode="step.mode"/><small v-if="index===3">Interfaz real · datos de demostración</small></div>
     </li>
    </ol>
    <ChapterVisual :frames="frames" />
   </div>
  </div>
 </section>
</template>
