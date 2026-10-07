<script setup>
import { ref } from 'vue';
import { oscarMilestones, oscarCapabilities, oscarExperience, oscarSkills, oscarProfile } from '../../data/oscar.js';
import portrait480 from '../../assets/oscar/oscar-vogel-480.webp';
import portrait720 from '../../assets/oscar/oscar-vogel-720.webp';
import portrait1024 from '../../assets/oscar/oscar-vogel-1024.webp';
import '../../styles/editorial.css';

// The chapter is designed to stand without a photo: if the image is missing or fails to load,
// the figure is removed (no placeholder, no avatar) and the typographic layout takes the full width.
const portraitFailed = ref(false);
</script>
<template>
  <section id="nosotros" class="ed-section ed-person" :class="{ 'has-portrait': !portraitFailed }" aria-labelledby="nosotros-heading" data-ed-section>
    <div class="ed-shell person-grid">
      <div class="person-copy">
        <p class="ed-kicker" data-ed-item>Quién está detrás</p>
        <p class="person-years" data-ed-item aria-label="Más de veinticinco años de experiencia profesional"><span aria-hidden="true">+{{ oscarProfile.years }}</span><small aria-hidden="true">años</small></p>
        <p class="person-years-context" data-ed-item>de experiencia profesional en sistemas de gestión, facturación y automatización.</p>
        <h2 id="nosotros-heading" class="ed-title person-title" data-ed-item>Sistemas que acompañan el trabajo real.</h2>
        <p class="ed-lede" data-ed-item>Oscar Vogel participa directamente en cada proyecto: releva procesos, diseña la solución y acompaña su implementación. El trabajo integra desarrollo, administración y capacitación para ordenar ventas, trazabilidad, reportes e información dispersa.</p>

        <ol class="person-milestones" aria-label="Hitos de la trayectoria" data-ed-item>
          <li v-for="item in oscarMilestones" :key="item.year"><span>{{ item.year }}</span>{{ item.milestone }}</li>
        </ol>

        <ul class="person-capabilities" aria-label="Capacidades" data-ed-item>
          <li v-for="capability in oscarCapabilities" :key="capability">{{ capability }}</li>
        </ul>

        <div class="person-actions" data-ed-item>
          <a class="ed-btn ed-btn--ghost" :href="oscarProfile.cv" data-analytics-cta="about_download_cv" data-analytics-funnel="lead_journey" data-analytics-step="about">Descargar CV <span aria-hidden="true">→</span></a>
        </div>

        <details class="ed-detail" data-ed-item>
          <summary>Ver trayectoria completa</summary>
          <div class="person-detail">
            <div class="person-experience">
              <article v-for="item in oscarExperience" :key="item.period">
                <p class="person-period">{{ item.period }}</p>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </article>
            </div>
            <div>
              <h3>Tecnologías de trabajo</h3>
              <p class="person-tech">{{ oscarSkills.join(' · ') }}</p>
            </div>
          </div>
        </details>
      </div>

      <figure v-if="!portraitFailed" class="person-figure" data-ed-photo>
        <picture>
          <source type="image/webp" :srcset="`${portrait480} 480w, ${portrait720} 720w, ${portrait1024} 1024w`" sizes="(min-width: 1024px) 40vw, 100vw" />
          <img :src="portrait720" :alt="`${oscarProfile.name}, ${oscarProfile.role.toLowerCase()}`" width="720" height="1080" loading="lazy" decoding="async" @error="portraitFailed = true" />
        </picture>
        <figcaption><strong>{{ oscarProfile.name.toUpperCase() }}</strong><span>{{ oscarProfile.role }}</span></figcaption>
      </figure>
    </div>
  </section>
</template>
