<script setup>
import ActionButton from './ActionButton.vue';
import HomeChapterLabel from './HomeChapterLabel.vue';
import HomeDataScene from './HomeDataScene.vue';
</script>
<template>
 <section id="inicio" class="home-hero home-chapter" data-home-chapter="intro" data-analytics-view="home_entry" data-analytics-funnel="lead_journey" data-analytics-step="home" aria-labelledby="hero-title">
  <div class="section-shell">
   <HomeChapterLabel number="01" label="INTRO" />
   <div class="home-hero-stage">
    <div class="hero-copy">
     <p class="home-business-label">Consultoría tecnológica para empresas</p>
     <h1 id="hero-title">Datos claros.<br>Procesos conectados.<br><span>Mejores decisiones.</span></h1>
     <p class="home-hero-description">Implementamos sistemas, automatización e IA para ordenar operaciones, ahorrar tiempo y decidir con datos confiables.</p>
     <div class="hero-actions">
      <ActionButton label="Agendar diagnóstico" href="#contacto" variant="accent" data-analytics-cta="hero_diagnostic" data-analytics-funnel="lead_journey" data-analytics-step="home" />
      <ActionButton label="Ver casos" href="#casos" variant="secondary" data-analytics-cta="hero_view_cases" data-analytics-funnel="lead_journey" data-analytics-step="home" />
     </div>
    </div>
    <div class="home-hero-visual" data-home-moment="hero"><HomeDataScene /></div>
   </div>
   <a class="home-handoff" href="#soluciones">Del dato disperso a una operación conectada.<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6" stroke="currentColor" stroke-width="1.5"/></svg></a>
  </div>
 </section>
</template>
