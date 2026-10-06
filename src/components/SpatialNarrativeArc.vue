<script setup>
import HeroSection from './HeroSection.vue';
import { clusterDefinitions, phase03Config } from '../lib/narrativeScenes.js';
import { servicePages } from '../data/servicePages.js';
import '../styles/spatialNarrative.css';
const destinations=['sistemas-a-medida','mantenimiento-de-equipos','desarrollo-web'].map(id=>servicePages[id]);
defineProps({phase03:{type:Boolean,default:false}});
</script>
<template>
  <div class="narrative-arc" :class="{'narrative-phase03':phase03}" data-chapter-motion>
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
    <template v-if="phase03">
      <section v-for="moment in phase03Config.moments" :key="moment.id" :id="moment.anchor" class="narrative-moment narrative-extension" :style="{'--moment-height':moment.height*100+'svh'}" :aria-labelledby="moment.id+'-title'" :data-spatial-scene="moment.id">
        <div class="section-shell narrative-copy">
          <p class="narrative-marker">{{moment.marker}} / {{moment.label}}</p>
          <h2 :id="moment.id+'-title'">{{moment.title}}</h2>
          <p>{{moment.copy}}</p>
          <p class="narrative-equivalent">{{moment.meaning}}</p>
          <ul v-if="moment.id==='data'" class="narrative-metadata" aria-label="Lectura conceptual del sistema">
            <li>OPERACIÓN / ACTIVA</li><li>FLUJO / ESTABLE</li><li>INFORMACIÓN / CONSOLIDADA</li>
          </ul>
        </div>
        <img class="narrative-poster" :src="'/landscape/'+moment.id+'.webp'" width="1440" height="900" alt="" loading="lazy">
      </section>
    </template>
    <ol class="spatial-cluster-labels" aria-hidden="true">
      <li v-for="(c,i) in clusterDefinitions" :key="c.name"><span>{{String(i+1).padStart(2,'0')}} / {{c.name}}</span></li>
    </ol>
    <div class="narrative-progress" aria-hidden="true"><span class="narrative-count">01 / {{phase03?'07':'03'}}</span><span class="narrative-current">INTRO</span><i></i></div>
  </div>
</template>
