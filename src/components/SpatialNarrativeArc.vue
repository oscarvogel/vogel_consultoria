<script setup>
import HeroSection from './HeroSection.vue';
import { clusterDefinitions } from '../lib/narrativeScenes.js';
import { servicePages } from '../data/servicePages.js';
import '../styles/spatialNarrative.css';
const destinations=['sistemas-a-medida','mantenimiento-de-equipos','desarrollo-web'].map(id=>servicePages[id]);
</script>
<template>
  <div class="narrative-arc" data-chapter-motion>
    <HeroSection />
    <section id="complejidad" class="narrative-moment narrative-complexity" aria-labelledby="complexity-title">
      <div class="section-shell narrative-copy">
        <p class="narrative-marker">01 / COMPLEJIDAD</p>
        <h2 id="complexity-title">Información dispersa.</h2>
        <p>Cuando cada área trabaja con su propia información, entender la operación completa se vuelve más difícil.</p>
        <ul class="narrative-area-summary" aria-label="Áreas de la operación"><li v-for="c in clusterDefinitions" :key="c.name">{{c.name}}</li></ul>
      </div>
      <img class="narrative-poster" src="/landscape/complexity.webp" width="1440" height="900" alt="" loading="lazy">
    </section>
    <section id="sistemas" class="narrative-moment narrative-systems" aria-labelledby="systems-title">
      <div class="section-shell narrative-copy">
        <p class="narrative-marker">02 / SISTEMAS</p>
        <h2 id="systems-title">Sistemas que ordenan.</h2>
        <p>Reunimos registros, tareas, personas y permisos dentro de una operación compartida.</p>
        <nav class="narrative-destinations" aria-label="Servicios de sistemas">
          <a v-for="service in destinations" :key="service.id" :href="service.path">{{service.shortTitle}} <span aria-hidden="true">→</span></a>
        </nav>
      </div>
      <img class="narrative-poster" src="/landscape/systems.webp" width="1440" height="900" alt="" loading="lazy">
    </section>
    <ol class="spatial-cluster-labels" aria-hidden="true">
      <li v-for="(c,i) in clusterDefinitions" :key="c.name"><span>{{String(i+1).padStart(2,'0')}} / {{c.name}}</span></li>
    </ol>
    <div class="narrative-progress" aria-hidden="true"><span class="narrative-count">01 / 03</span><span class="narrative-current">INTRO</span><i></i></div>
  </div>
</template>
