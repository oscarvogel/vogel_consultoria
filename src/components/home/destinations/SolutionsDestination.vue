<script setup>
import { capabilities, alsoServices } from '../../../data/capabilities.js';
</script>

<template>
  <main id="soluciones" class="portfolio-destination" data-destination="solutions">
    <div class="destination-inner">
      <header class="destination-header" id="servicios" tabindex="-1">
        <h1 data-destination-heading tabindex="-1">Soluciones que ordenan el trabajo.</h1>
        <p>Sistemas, automatización, datos e IA para empresas que necesitan trabajar con más control y mejores decisiones.</p>
      </header>

      <section class="destination-section" aria-label="Capacidades Vogel">
        <ul class="destination-service-list">
          <li v-for="(item, i) in capabilities" :key="item.id" class="destination-service-item" v-animateonscroll.once="{ enterClass: 'vogel-rise', threshold: .12 }" :style="{ '--i': i }">
            <a
              class="destination-service-link"
              :href="item.href"
              :data-analytics-cta="item.cta"
              data-analytics-funnel="service_discovery"
            >
              <span>
                <h2>{{ item.title }}</h2>
                <p>{{ item.line }}</p>
              </span>
              <span aria-hidden="true">→</span>
            </a>
          </li>
        </ul>
      </section>

      <section class="destination-section" aria-labelledby="solutions-also-title">
        <h2 id="solutions-also-title">También trabajamos en</h2>
        <div class="destination-secondary-links">
          <a
            v-for="item in alsoServices"
            :key="item.href"
            :href="item.href"
            :data-analytics-cta="item.cta"
            data-analytics-funnel="service_discovery"
          >{{ item.label }} <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <p class="destination-contact-note">¿No sabés qué solución encaja? <a class="destination-text-link" href="/contacto/">Contanos qué necesitás resolver →</a></p>
    </div>
  </main>
</template>
