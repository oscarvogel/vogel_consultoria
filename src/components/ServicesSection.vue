<script setup>
import {servicePages} from '../data/servicePages.js';
import aiImage from '../assets/services/cards/ia-aplicada.webp';
const services=[
 ...['sistemas-a-medida','dashboards-ejecutivos','automatizacion-de-procesos'].map(id=>servicePages[id]),
 {id:'ia',path:'/inteligencia-artificial/',shortTitle:'Inteligencia artificial aplicada',summary:'Asistentes, análisis y automatizaciones para procesos concretos, con criterio y supervisión.',image:aiImage},
 ...['contaflow-api-facturacion-electronica','talleres-ia','desarrollo-web','mantenimiento-de-equipos','integraciones-whatsapp'].map(id=>servicePages[id])
];
</script>
<template>
<section id="servicios" class="section-space" aria-labelledby="servicios-heading">
 <div class="section-shell">
  <div class="services-intro"><h2 id="servicios-heading" class="section-title" data-text-reveal>La tecnología adecuada<br>para cada proceso.</h2><p class="section-description">Combinamos sistemas, datos y visión de negocio. El alcance se define por el problema que necesitás resolver.</p></div>
  <div class="service-bento">
   <a v-for="service in services.slice(0,2)" :key="service.id" :href="service.path" class="service-tile service-featured" :data-analytics-cta="'home_service_'+service.id">
    <div class="service-image"><img :src="service.image" alt="" width="640" height="360" loading="lazy" decoding="async"/></div>
    <div class="service-copy"><h3>{{ service.shortTitle }}</h3><p>{{ service.summary }}</p><span class="service-more">Explorar servicio<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></div>
   </a>
  </div>
  <div class="service-catalogue">
   <a v-for="service in services.slice(2)" :key="service.id" :href="service.path" class="service-entry" :data-analytics-cta="'home_service_'+service.id">
    <div><h3>{{ service.shortTitle }}</h3><p>{{ service.summary }}</p></div>
    <span class="service-arrow" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span>
   </a>
  </div>
  <div class="arca-band"><div><h3>Automatizaciones ARCA para estudios contables.</h3><p>Flujos mensuales para retenciones, percepciones y clientes delegados, con evidencia por CUIT y control humano.</p></div><a href="/automatizaciones/" class="action-button action-secondary" data-analytics-cta="home_automatizaciones_arca">Ver automatizaciones ARCA</a></div>
  <div id="ia" class="ia-note"><p>IA aplicada al negocio real: asistentes internos, análisis de Excel y PDF, automatización de respuestas y apoyo a la gestión.</p><a href="/inteligencia-artificial/" class="text-link">Explorar IA para empresas</a></div>
 </div>
</section>
</template>
<style scoped>
.services-intro{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-bottom:48px}.services-intro>p{max-width:40ch}
.service-bento{display:grid;grid-template-columns:1.15fr 1fr;gap:20px}
.service-tile{background:var(--color-background);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:background-color 200ms var(--ease-out)}
.service-image{height:220px;overflow:hidden}.service-image img{width:100%;height:100%;object-fit:cover;transition:transform 400ms var(--ease-out)}
.service-copy{padding:32px;display:flex;flex:1;flex-direction:column;align-items:flex-start}.service-copy h3{font-size:clamp(27px,2.5vw,36px);font-weight:600;line-height:1.12}
.service-copy p{color:var(--color-text);font-size:16px;line-height:1.7;margin-block:18px 28px;max-width:55ch}.service-more{display:flex;justify-content:space-between;align-items:center;width:100%;gap:12px;color:var(--color-link);font-size:14px;margin-top:auto;min-height:28px}
.service-more svg,.service-arrow svg{transition:transform 180ms var(--ease-out)}
.service-catalogue{display:grid;grid-template-columns:1fr 1fr;gap:0 32px;background:var(--color-background);padding:12px 32px;margin-top:24px;border-radius:16px}
.service-entry{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:28px 0;border-bottom:1px solid var(--color-border);border-radius:4px;transition:color 180ms var(--ease-out)}
.service-entry:last-child{grid-column:1/-1;border:0}.service-entry:last-child p{max-width:75ch}.service-entry h3{font-size:23px;font-weight:600;line-height:1.2}.service-entry p{max-width:52ch;margin-top:12px;color:var(--color-text);font-size:15px;line-height:1.7}
.service-arrow{display:grid;place-items:center;flex:0 0 44px;width:44px;height:44px;border:1px solid var(--color-border);border-radius:50%;color:var(--color-link);transition:background-color 180ms var(--ease-out),color 180ms var(--ease-out)}
.service-entry:active .service-arrow{transform:scale(.96)}.service-tile:focus-visible,.service-entry:focus-visible{outline-offset:5px}
.arca-band{display:flex;align-items:center;justify-content:space-between;gap:28px;padding:36px 0;margin-top:36px;border-top:1px solid var(--color-border);border-bottom:1px solid var(--color-border)}.arca-band h3{font-size:26px;font-weight:600}.arca-band p{max-width:64ch;margin-top:12px;color:var(--color-muted);line-height:1.7}.arca-band>a{flex-shrink:0}.ia-note{display:flex;justify-content:space-between;align-items:center;gap:32px;padding-top:28px;font-size:15px;color:var(--color-muted)}.ia-note p{max-width:75ch}.ia-note a{flex-shrink:0}
@media(hover:hover) and (pointer:fine){.service-tile:hover{background:var(--color-surface)}.service-tile:hover img{transform:scale(1.025)}.service-tile:hover .service-more svg,.service-entry:hover .service-arrow svg{transform:translateX(3px)}.service-entry:hover .service-arrow{background:var(--color-link);color:var(--color-background)}}
@media(max-width:1023px){.services-intro,.arca-band{display:block}.arca-band>a{margin-top:24px}.ia-note{display:block}.ia-note a{display:inline-block;margin-top:16px}.service-catalogue{gap:0 24px}}
@media(max-width:639px){.service-bento,.service-catalogue{grid-template-columns:1fr}.service-copy{padding:24px}.service-catalogue{padding:4px 24px}.service-entry:last-child{grid-column:auto}.service-image{height:180px}.services-intro>p{margin-top:24px}.service-entry{gap:16px}.service-entry h3{font-size:22px}}
</style>
