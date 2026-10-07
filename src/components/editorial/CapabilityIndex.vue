<script setup>
import { capabilities, alsoServices } from '../../data/capabilities.js';
import '../../styles/editorial.css';
</script>
<template>
  <section id="soluciones" class="ed-section ed-capabilities" aria-labelledby="capacidades-heading" data-ed-section>
    <div id="servicios" class="ed-shell">
      <header class="ed-head" data-ed-item>
        <p class="ed-kicker">Capacidades</p>
        <h2 id="capacidades-heading" class="ed-title">Esto es lo que podemos construir.</h2>
      </header>
      <ol class="cap-index">
        <li v-for="(capability, index) in capabilities" :key="capability.id" data-ed-item>
          <a class="cap-row" :id="capability.anchor" :href="capability.href" :data-analytics-cta="capability.cta" data-analytics-funnel="lead_journey" data-analytics-step="home">
            <span class="cap-num">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="cap-title">{{ capability.title }}</span>
            <span class="cap-line">{{ capability.line }}</span>
            <span class="cap-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7 17 17 7M8 7h9v9"/></svg></span>
          </a>
        </li>
      </ol>
      <p class="cap-also" data-ed-item>
        <span>También</span>
        <a v-for="service in alsoServices" :key="service.href" :href="service.href" :data-analytics-cta="service.cta">{{ service.label }}</a>
      </p>
    </div>
  </section>
</template>
