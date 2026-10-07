<script setup>
import { resources } from '../../../data/resources.js';

const formatDate = value => new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value));
</script>

<template>
  <main id="recursos" class="portfolio-destination" data-destination="resources">
    <div class="destination-inner">
      <header class="destination-header">
        <h1 data-destination-heading tabindex="-1">Guías para decidir con claridad.</h1>
        <p>Ideas prácticas para ordenar tecnología, datos e IA en empresas. Un punto de partida para detectar oportunidades y definir prioridades antes de invertir.</p>
      </header>

      <section class="destination-section" aria-label="Guías y recursos">
        <ol class="destination-resource-list">
          <li v-for="(resource, i) in resources" :key="resource.id" class="destination-resource-item" v-animateonscroll.once="{ enterClass: 'vogel-rise', threshold: .12 }" :style="{ '--i': i }">
            <div class="destination-resource-meta">
              <span>{{ resource.eyebrow }}</span>
              <span>{{ resource.readTime }}</span>
              <time :datetime="resource.published">{{ formatDate(resource.published) }}</time>
            </div>
            <a
              class="destination-resource-link"
              :href="resource.path"
              data-analytics-cta="resource_read"
              :data-analytics-label="resource.id"
              data-analytics-funnel="content_discovery"
            >
              <span>
                <h2>{{ resource.title }}</h2>
                <p>{{ resource.summary }}</p>
                <span class="destination-text-link">Leer guía <span aria-hidden="true">→</span></span>
              </span>
              <span class="destination-resource-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        </ol>
      </section>
    </div>
  </main>
</template>
