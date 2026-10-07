<script setup>
import LandscapeTraces from './LandscapeTraces.vue';
import { forestCase } from '../data/forestCase.js';
const steps = forestCase.steps;
</script>
<template>
 <section id="casos" class="home-section home-forest" data-home-chapter="forest" aria-labelledby="mini-cases-heading">
  <LandscapeTraces variant="evidence" />
  <div class="section-shell">
   <div class="section-introduction"><h2 id="mini-cases-heading" class="section-title">{{forestCase.titleLines[0]}}<br>{{forestCase.titleLines[1]}}</h2><p>{{forestCase.context}}<br>{{ forestCase.disclaimer }}.<br>{{ forestCase.caveat }}</p></div>
   <div class="forest-track">
    <div class="forest-stage">
     <ol class="case-steps" aria-label="Del campo a la decisión">
      <li v-for="(step,index) in steps" :key="step.label" class="case-step" :class="{'step-current':index===0}"><span>{{ String(index+1).padStart(2,'0') }}</span><h3>{{ step.label }}</h3><p>{{ step.text }}</p></li>
     </ol>
     <div class="forest-screens">
      <figure v-for="(step,index) in steps" :key="step.label" class="case-screen" :class="{'case-screen--dashboard':index===2}">
       <div class="forest-image" :class="{'forest-image--field':index===0,'forest-image--review':index===1,'forest-image--dashboard':index===2}">
        <picture><source v-if="step.desktopImage" media="(min-width:1024px)" :srcset="step.desktopImage"/><img :src="step.image" :alt="step.alt" width="390" :height="step.height" loading="lazy" decoding="async"/></picture>
        <div v-if="index < 2" class="forest-context"><span>{{ step.label }} en campo</span><h4>{{ step.title }}</h4><p>{{ step.text }}</p></div>
       </div>
       <figcaption><span>{{ step.title }}</span><a :href="step.desktopImage || step.image" target="_blank" rel="noopener noreferrer" class="text-link" :aria-label="'Abrir captura completa: '+step.label">Abrir captura completa</a></figcaption>
      </figure>
     </div>
     <div class="forest-footer"><span>{{ forestCase.disclaimer }}</span><a :href="forestCase.service" class="text-link" data-analytics-cta="home_forest_dashboard">Conocer el servicio de dashboards</a></div>
    </div>
   </div>
  </div>
 </section>
</template>
