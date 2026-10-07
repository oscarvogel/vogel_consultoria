<script setup>
import { resources } from '../../data/resources.js';
import '../../styles/editorial.css';
// Three featured guides, always real ones from the resources data.
const featured = resources.slice(0, 3);
</script>
<template>
  <section id="recursos" class="ed-section ed-perspectives" aria-labelledby="perspectivas-heading" data-ed-section>
    <div class="ed-shell">
      <header class="ed-head ed-head--split" data-ed-item>
        <div>
          <p class="ed-kicker">Perspectivas</p>
          <h2 id="perspectivas-heading" class="ed-title">Así pensamos.</h2>
        </div>
        <p class="ed-lede">Ideas para entender el problema antes de comprar una herramienta.</p>
      </header>

      <ol class="persp-list">
        <li v-for="(resource, index) in featured" :key="resource.id" data-ed-item>
          <a :href="resource.path" data-analytics-cta="home_resource_read" :data-analytics-label="resource.id" data-analytics-location="home_resources">
            <span class="persp-num">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="persp-title">{{ resource.shortTitle }}</span>
            <span class="persp-meta">{{ resource.eyebrow }} · {{ resource.readTime }}</span>
          </a>
        </li>
      </ol>
      <p class="persp-all" data-ed-item><a class="ed-link" href="/recursos/" data-analytics-cta="home_resources_index" data-analytics-funnel="content_discovery" data-analytics-step="home">Ver todas las perspectivas →</a></p>

      <aside id="charla-ia-2026" class="persp-training" aria-labelledby="formacion-heading" data-ed-item>
        <p class="ed-kicker">Formación</p>
        <div class="persp-training-body">
          <div>
            <h3 id="formacion-heading">IA aplicada al trabajo profesional</h3>
            <p class="persp-training-org">Ya dictada junto al <a class="ed-link" href="https://www.consejomisiones.org.ar/" target="_blank" rel="noopener noreferrer">CPCE Misiones</a></p>
            <p>Charlas y talleres para equipos que necesitan entender, probar y usar inteligencia artificial con criterio profesional: contexto, fuentes, restricciones y verificación.</p>
          </div>
          <div class="persp-training-actions">
            <a class="ed-btn ed-btn--ghost" href="https://wa.me/543743667526?text=Hola%20Oscar%2C%20quiero%20recibir%20informaci%C3%B3n%20para%20dictar%20una%20charla%20de%20IA%20para%20una%20instituci%C3%B3n%20o%20empresa" target="_blank" rel="noopener noreferrer" data-analytics-cta="event_program_request_talk">Solicitar una charla <span aria-hidden="true">→</span></a>
            <a class="ed-link" href="https://portal.vogelconsultoria.com.ar/encuesta-contadores-ia" target="_blank" rel="noopener noreferrer" data-analytics-cta="hero_accountants_ai_survey">Responder la encuesta para contadores</a>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
