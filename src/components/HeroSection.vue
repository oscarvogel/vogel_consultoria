<script setup>
import ActionButton from './ActionButton.vue';
import DataLandscape from './DataLandscape.vue';
</script>
<template>
 <section id="inicio" class="landscape-hero" data-analytics-view="home_entry" data-analytics-funnel="lead_journey" data-analytics-step="home" aria-labelledby="hero-title">
  <div class="hero-copy section-shell">
   <p class="hero-eyebrow">Tecnología <span>·</span> Procesos <span>·</span> Resultados</p>
   <h1 id="hero-title">Convertimos procesos<br>en <span>información útil.</span></h1>
   <p class="hero-description">Sistemas, automatización, datos e IA para empresas que<br class="desktop-break"> necesitan trabajar con más control y mejores decisiones.</p>
   <ActionButton label="Explorar soluciones" href="#soluciones" variant="accent" data-analytics-cta="hero_explore_solutions" data-analytics-funnel="lead_journey" data-analytics-step="home" />
  </div>
  <DataLandscape />
  <div class="landscape-labels" aria-label="Soluciones destacadas">
   <a class="terrain-label terrain-label--systems" href="/sistemas-a-medida/" data-analytics-cta="hero_landscape_systems"><span></span>Sistemas a medida<i aria-hidden="true"></i></a>
   <a class="terrain-label terrain-label--automation" href="/automatizacion-de-procesos/" data-analytics-cta="hero_landscape_automation"><span></span>Automatización<i aria-hidden="true"></i></a>
   <a class="terrain-label terrain-label--data" href="/dashboards-ejecutivos/" data-analytics-cta="hero_landscape_dashboards"><span></span>Datos &amp; dashboards<i aria-hidden="true"></i></a>
  </div>
  <a class="discover-link" href="#soluciones"><svg width="24" height="40" viewBox="0 0 24 40" fill="none" aria-hidden="true"><rect x="3" y="1" width="18" height="33" rx="9" stroke="currentColor"/><path d="M12 8v6" stroke="currentColor"/></svg><span>Descubrir más</span><i aria-hidden="true"></i></a>
 </section>
</template>
