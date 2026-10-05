<script setup>
import {servicePages} from '../data/servicePages.js';
import HomeChapterLabel from './HomeChapterLabel.vue';
import HomeDataScene from './HomeDataScene.vue';
import HomeEvidence from './HomeEvidence.vue';
import dashboard from '../assets/cases/forestal-dashboard-desktop.png';
const ia={id:'ia',path:'/inteligencia-artificial/',shortTitle:'Inteligencia artificial aplicada',summary:'Asistentes, análisis y automatizaciones para procesos concretos, con criterio y supervisión.'};
const arca={id:'arca',path:'/automatizaciones/',shortTitle:'Automatizaciones ARCA para estudios contables.',summary:'Flujos mensuales para retenciones, percepciones y clientes delegados, con evidencia por CUIT y control humano.'};
const homeDescriptions={
 'sistemas-a-medida':'Registros, permisos y procesos compartidos para trabajar sin planillas dispersas.',
 'mantenimiento-de-equipos':'Historial por equipo y mantenimiento preventivo para camiones, máquinas y vehículos.',
 'desarrollo-web':'Sitios profesionales que presentan tu oferta y facilitan el contacto comercial.',
 'integraciones-whatsapp':'Consultas, avisos y seguimiento conectados al sistema de gestión, con trazabilidad.',
 'contaflow-api-facturacion-electronica':'Emisión de comprobantes electrónicos desde tu sistema, con respuestas claras.',
 'automatizacion-de-procesos':'Tareas administrativas y operativas con reglas, controles e información confiable.',
 'arca':'Retenciones y percepciones por cliente delegado, con evidencia por CUIT.',
 'dashboards-ejecutivos':'Indicadores comparables para seguir ventas, costos y operación.',
 'talleres-ia':'Ejercicios, criterios de validación y adopción responsable para tu equipo.',
 'ia':'Asistentes y análisis para tareas concretas, con supervisión humana.'
};
const steps=[
 {title:'Ordenar.',text:'Registros y tareas adquieren una estructura compartida. La operación conserva el contexto de cada dato.',mode:'order',ids:['sistemas-a-medida','mantenimiento-de-equipos']},
 {title:'Conectar.',text:'Las áreas y los canales intercambian información: del contacto con el cliente al sistema que sostiene la operación.',mode:'connect',ids:['desarrollo-web','integraciones-whatsapp','contaflow-api-facturacion-electronica']},
 {title:'Automatizar.',text:'El flujo avanza con reglas, evidencia y puntos de revisión. El equipo mantiene el control del proceso.',mode:'automate',ids:['automatizacion-de-procesos'],extra:[arca]},
 {title:'Decidir.',text:'La información se convierte en una vista de gestión. IA aplicada al negocio real: asistentes internos, análisis de Excel y PDF, automatización de respuestas y apoyo a la gestión.',mode:'decide',ids:['dashboards-ejecutivos','talleres-ia'],extra:[ia]},
].map(step=>({...step,services:[...step.ids.map(id=>servicePages[id]),...(step.extra||[])]}));
</script>
<template>
 <section id="servicios" class="home-chapter home-capabilities" data-home-chapter="services" aria-labelledby="servicios-heading">
  <div class="section-shell">
   <HomeChapterLabel number="04" label="CAPACIDADES" />
   <h2 id="servicios-heading" class="section-title">La tecnología adecuada<br>para cada proceso.</h2>
   <p class="section-description">Combinamos sistemas, datos y visión de negocio. El alcance se define por el problema que necesitás resolver.</p>
   <ol class="home-capability-list">
    <li v-for="(step,index) in steps" :key="step.title" class="home-capability" :class="'home-capability--'+step.mode" :data-home-capability="step.mode">
     <div class="home-capability-copy"><h3>{{ step.title }}</h3><p>{{ step.text }}</p>
      <div class="chapter-service-links">
       <a v-for="service in step.services" :key="service.id" :id="service.id==='ia'?'ia':undefined" :href="service.path" :title="homeDescriptions[service.id] || service.summary" :data-analytics-cta="service.id==='arca'?'home_automatizaciones_arca':'home_service_'+service.id"><strong>{{ service.shortTitle }}</strong><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" stroke="currentColor" stroke-width="1.5"/></svg></a>
      </div>
     </div>
     <div v-if="index<2" class="home-capability-art" :data-home-moment="step.mode"><HomeDataScene :kind="step.mode" /></div>
     <div v-else-if="index===2" class="home-flow" data-home-moment="automate">
      <div class="home-flow-line" aria-hidden="true"><span></span></div>
      <ol aria-label="Flujo de automatización"><li><span>Entrada</span><p>Datos y contexto</p></li><li><span>Reglas</span><p>Proceso definido</p></li><li><span>Revisión</span><p>Control humano</p></li><li><span>Salida</span><p>Evidencia y registro</p></li></ol>
     </div>
     <figure v-else class="home-decision-visual" data-home-moment="decide"><img :src="dashboard" alt="Dashboard forestal real con indicadores de producción ficticios." width="1440" height="1151" loading="lazy" decoding="async"/><figcaption>Interfaz real · datos de demostración</figcaption></figure>
     <HomeEvidence v-if="index===1" kind="clients" />
     <HomeEvidence v-if="index===3" kind="training" />
    </li>
   </ol>
   <HomeEvidence kind="projects" />
   <HomeEvidence kind="resources" />
  </div>
 </section>
</template>
