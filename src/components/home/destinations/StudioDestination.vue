<script setup>
import cutout640 from '../../../assets/oscar/oscar-cutout-640.webp';
import cutout720 from '../../../assets/oscar/oscar-cutout-720.webp';
import cutout858 from '../../../assets/oscar/oscar-cutout-858.webp';
import { methodSteps } from '../../../data/method.js';
import { oscarProfile } from '../../../data/oscar.js';
</script>

<template>
  <main id="info" class="portfolio-destination" data-destination="studio">
    <div class="destination-inner">
      <header class="destination-header">
        <h1 data-destination-heading tabindex="-1">Tecnología con criterio de negocio.</h1>
        <p>Convertimos datos y procesos en decisiones que mejoran tu rentabilidad. No vendemos software: resolvemos problemas con implementación concreta y acompañamiento práctico.</p>
      </header>

      <figure class="studio-portrait" v-animateonscroll.once="{ enterClass: 'vogel-slide', threshold: .05 }">
        <img :src="cutout858" :srcset="`${cutout640} 640w, ${cutout720} 720w, ${cutout858} 858w`" sizes="(min-width: 1100px) 480px, (min-width: 768px) 72vw, min(84vw, 320px)" alt="Oscar Vogel" width="858" height="1448" loading="eager" fetchpriority="high" decoding="async" />
      </figure>

      <section id="metodologia" class="destination-section" aria-labelledby="studio-method-title" tabindex="-1">
        <h2 id="studio-method-title">Método Vogel</h2>
        <ol class="destination-method-list">
          <li v-for="(step, i) in methodSteps" :key="step.id" v-animateonscroll.once="{ enterClass: 'vogel-rise', threshold: .12 }" :style="{ '--i': i }">
            <h3>{{ step.label }}</h3>
            <p>{{ step.text }}</p>
          </li>
        </ol>
      </section>

      <section id="nosotros" v-animateonscroll.once="{ enterClass: 'vogel-rise', threshold: .12 }" class="destination-section destination-person" aria-labelledby="studio-person-title" tabindex="-1">
        <div>
          <h2 id="studio-person-title">{{ oscarProfile.name }}</h2>
          <p>{{ oscarProfile.role }}, con +{{ oscarProfile.years }} años de experiencia en sistemas de gestión, facturación y automatización. Participa directamente en cada proyecto.</p>
          <a class="destination-text-link" :href="oscarProfile.cv" target="_blank" rel="noopener noreferrer">Ver CV <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section class="destination-section" aria-labelledby="studio-femag-title" v-animateonscroll.once="{ enterClass: 'vogel-rise', threshold: .12 }">
        <div class="destination-status">
          <h3 id="studio-femag-title">FEMAG <span>· En desarrollo</span></h3>
          <p>Proyecto en desarrollo. Su presentación estará disponible cuando exista material publicado.</p>
        </div>
      </section>
    </div>
  </main>
</template>
