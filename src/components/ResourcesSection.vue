<script setup>
import { resources } from '../data/resources.js';
</script>

<template>
  <section id="recursos" class="section-space" aria-labelledby="recursos-heading">
    <div class="section-shell">
      <div class="resources-heading">
        <div>
          <h2 id="recursos-heading" class="section-title" data-text-reveal>Guías para decidir antes de invertir</h2>
          <p class="section-description">Contenido práctico para detectar oportunidades, ordenar procesos y priorizar tecnología con impacto real.</p>
        </div>
        <a href="/recursos/" class="text-link" data-analytics-cta="home_resources_index" data-analytics-funnel="content_discovery" data-analytics-step="home">Ver recursos</a>
      </div>
      <div class="resource-index">
        <article v-for="resource in resources" :key="resource.id">
          <a :href="resource.path" class="resource-entry" data-analytics-cta="home_resource_read" :data-analytics-label="resource.id" data-analytics-location="home_resources">
            <span class="resource-category">{{ resource.eyebrow }}<span>{{ resource.readTime }}</span></span>
            <div class="resource-copy"><h3>{{ resource.shortTitle }}</h3><p>{{ resource.summary }}</p></div>
            <span class="resource-action">Leer guía <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span>
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.resources-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;margin-bottom:40px}.resources-heading>div{max-width:800px}.resources-heading>a{flex-shrink:0;display:flex;align-items:center;min-height:44px}
.resource-index{background:var(--color-background);border-radius:16px;padding-inline:32px}.resource-index article+article{border-top:1px solid var(--color-border)}
.resource-entry{display:grid;grid-template-columns:160px minmax(0,1fr) auto;gap:32px;align-items:start;padding-block:32px;border-radius:4px}
.resource-category{color:var(--color-link);font-size:13px;line-height:1.6}.resource-category>span{display:block;color:var(--color-text);margin-top:12px}
.resource-copy h3{font-size:clamp(24px,2.1vw,30px);font-weight:600;line-height:1.16}.resource-copy p{max-width:65ch;margin-top:14px;font-size:15px;line-height:1.75;color:var(--color-text)}
.resource-action{display:flex;gap:16px;align-items:center;white-space:nowrap;color:var(--color-link);font-size:14px;min-height:32px}.resource-action svg{transition:transform 180ms var(--ease-out)}
.resource-entry:focus-visible{outline-offset:6px}.resource-entry:active .resource-action svg{transform:translateX(2px)}
@media(hover:hover) and (pointer:fine){.resource-entry:hover h3{color:var(--color-link)}.resource-entry:hover .resource-action svg{transform:translateX(4px)}}
@media(max-width:1023px){.resource-entry{grid-template-columns:140px minmax(0,1fr)}.resource-action{grid-column:2}.resources-heading{display:block}.resources-heading>a{margin-top:20px}}
@media(max-width:639px){.resource-index{padding-inline:24px}.resource-entry{grid-template-columns:1fr;gap:18px;padding-block:28px}.resource-action{grid-column:auto}.resource-category{display:flex;justify-content:space-between;gap:20px}.resource-category>span{margin:0}.resource-copy h3{font-size:25px}}
</style>
