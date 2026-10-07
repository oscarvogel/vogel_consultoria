<script setup>
import { forestCase } from '../data/forestCase.js';
import { evidenceConfig } from '../lib/evidenceScenes.js';
import { phase03Config } from '../lib/narrativeScenes.js';
import { chapterMarker } from '../lib/narrativeScenes.js';
import '../styles/forestEvidence.css';
</script>
<template>
  <section id="casos" class="forest-evidence" :style="{'--evidence-height':evidenceConfig.caseHeight*100+'svh','--evidence-overlap':(phase03Config.height-evidenceConfig.start)*100+'svh'}" data-forest-evidence aria-labelledby="evidence-title">
    <div class="evidence-stage">
      <header class="evidence-intro evidence-copy">
        <p class="narrative-marker">{{chapterMarker('evidence')}}</p>
        <h2 id="evidence-title">{{forestCase.titleLines[0]}}<br>{{forestCase.titleLines[1]}}</h2>
        <p>{{forestCase.intro}}</p>
      </header>
      <ol class="evidence-steps" aria-label="Del campo a la decisión">
        <li v-for="(step,index) in forestCase.steps" :key="step.id" :id="'evidencia-'+step.id" class="evidence-step" :data-evidence-step="index">
          <div class="evidence-copy">
            <p class="narrative-marker">{{String(index+1).padStart(2,'0')}} / {{step.label.toUpperCase()}}</p>
            <h3>{{step.title}}</h3><p>{{step.text}}</p>
            <p v-if="index===2" class="evidence-resolution">DEL CAMPO A LA DECISIÓN</p>
          </div>
          <figure class="evidence-figure" :class="{'evidence-dashboard':index===2}">
            <div class="evidence-slot" :style="{'--crop-ratio':step.width+'/'+step.cropHeight,'--crop-width-ratio':step.width/step.cropHeight,'--crop-top':step.cropTop/step.cropHeight*100+'%','--crop-tall-ratio':step.width+'/'+(step.tallCropHeight||step.cropHeight),'--crop-tall-width-ratio':step.width/(step.tallCropHeight||step.cropHeight),'--crop-tall-top':(step.tallCropTop??step.cropTop)/(step.tallCropHeight||step.cropHeight)*100+'%'}">
              <div class="evidence-image">
                <picture>
                  <source v-if="step.desktopDisplayImage" type="image/webp" media="(min-width:1024px)" :srcset="step.desktopDisplayImage" />
                  <source v-if="step.desktopImage" media="(min-width:1024px)" :srcset="step.desktopImage" />
                  <source type="image/webp" :srcset="step.displayImage" />
                  <img :src="step.image" :alt="step.alt" :width="step.width" :height="step.height" loading="lazy" decoding="async">
                </picture>
              </div>
            </div>
            <figcaption><a :href="step.desktopImage || step.image" target="_blank" rel="noopener noreferrer" class="text-link" :aria-label="'Abrir captura completa: '+step.label">Abrir captura completa <span aria-hidden="true">↗</span></a></figcaption>
          </figure>
        </li>
      </ol>
      <footer class="evidence-footer">
        <p>{{forestCase.footnote}} {{forestCase.caveat}}</p>
        <a :href="forestCase.service" class="text-link" data-analytics-cta="home_forest_dashboard">Conocer el servicio de dashboards <span aria-hidden="true">→</span></a>
      </footer>
    </div>
  </section>
</template>
