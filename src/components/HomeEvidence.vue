<script setup>
import { webProjects } from '../data/projects.js';
import { resources } from '../data/resources.js';
defineProps({ kind: { type: String, required: true } });
</script>
<template>
 <div v-if="kind==='training'" id="charla-ia-2026" class="home-training">
  <details class="home-detail"><summary>IA práctica para instituciones y empresas</summary>
   <div class="home-training-body"><div><p>Dictamos encuentros aplicados para equipos que necesitan entender, probar y usar inteligencia artificial con criterio profesional.</p><p>Ya dictamos esta charla para profesionales en Ciencias Económicas junto al <a href="https://www.consejomisiones.org.ar/" target="_blank" rel="noopener noreferrer" class="text-link">CPCE Misiones</a>.</p></div>
    <dl><div><dt>IA aplicada al trabajo profesional</dt><dd>Herramientas para documentación, planillas, reportes, investigación y automatizaciones controladas.</dd></div><div><dt>Método y criterio de uso</dt><dd>Contexto, fuentes, restricciones y verificación para no perder control.</dd></div><div><dt>Taller práctico adaptable</dt><dd>Contenido ajustado a profesionales, equipos, instituciones y empresas.</dd></div></dl>
   </div>
   <div class="home-evidence-links"><a href="https://wa.me/543743667526?text=Hola%20Oscar%2C%20quiero%20recibir%20informaci%C3%B3n%20para%20dictar%20una%20charla%20de%20IA%20para%20una%20instituci%C3%B3n%20o%20empresa" class="text-link" data-analytics-cta="event_program_request_talk">Solicitar información</a><a href="#contacto" class="text-link" data-analytics-cta="event_program_contact">Coordinar una llamada</a><a href="https://portal.vogelconsultoria.com.ar/encuesta-contadores-ia" target="_blank" rel="noopener noreferrer" class="text-link" data-analytics-cta="hero_accountants_ai_survey">Responder la encuesta para contadores</a></div>
  </details>
 </div>
 <div v-else-if="kind==='projects'" id="clientes" class="home-project-proof">
  <div class="home-femag"><div><h3>FEMAG</h3><p>Sistema a medida en desarrollo</p><a href="https://femag.com.ar/" target="_blank" rel="noopener noreferrer" class="text-link">femag.com.ar</a></div><div><h4>Gestión operativa para una fábrica de fécula de mandioca.</h4><p>Aplicación de escritorio conectada a MySQL para ordenar clientes, productos, transporte, órdenes de carga, remitos, cuenta corriente, permisos y auditoría.</p><details class="home-detail"><summary>Ver alcance del proyecto</summary><ul><li>Aplicación local para 5/6 puestos en red interna</li><li>Dashboard central y menú operativo simple</li><li>Órdenes de carga y remitos imprimibles</li><li>Importación incremental desde MySQL y DBF</li></ul></details></div></div>
  <details class="home-detail"><summary>Ver proyectos de desarrollo web</summary><ul id="web-projects" class="home-project-links"><li v-for="project in webProjects" :key="project.url"><a :href="project.url" target="_blank" rel="noopener noreferrer" :aria-label="'Abrir sitio de '+project.name">{{ project.name }}</a><span>{{ project.type }}</span></li></ul><a class="text-link" href="/desarrollo-web/">Conocer el servicio de desarrollo web</a></details>
 </div>
 <div v-else id="recursos" class="home-resource-links"><h3>Guías para decidir antes de invertir</h3><ul><li v-for="resource in resources" :key="resource.id"><a :href="resource.path" class="text-link" data-analytics-cta="home_resource_read" :data-analytics-label="resource.id" data-analytics-location="home_resources">{{ resource.shortTitle }}</a></li></ul><a href="/recursos/" class="text-link" data-analytics-cta="home_resources_index" data-analytics-funnel="content_discovery" data-analytics-step="home">Ver recursos</a></div>
</template>
