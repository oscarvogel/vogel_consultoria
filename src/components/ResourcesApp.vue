<script setup>
import { resources } from "../data/resources.js";
import { useScrollReveal } from "../composables/useScrollReveal.js";
useScrollReveal();
import Navbar from "./Navbar.vue";
import FooterSection from "./FooterSection.vue";
import WhatsAppButton from "./WhatsAppButton.vue";
</script>
<template><div class="resources-page"><a class="skip-link" href="#resources-content">Saltar al contenido principal</a><Navbar/><main id="resources-content" tabindex="-1"><section class="section-space"><div class="section-shell"><header class="editorial-header" data-story-reveal><h1 data-text-reveal>Guías para decidir con claridad.</h1><p class="section-description">Ideas prácticas para ordenar tecnología, datos e IA en empresas. Un punto de partida para detectar oportunidades y definir prioridades antes de invertir.</p></header><div class="resource-list"><article v-for="resource in resources" :key="resource.id" class="resource-row" data-story-reveal><div class="resource-meta"><p>{{ resource.eyebrow }}</p><span>{{ resource.readTime }}</span><time :datetime="resource.published">{{ new Intl.DateTimeFormat('es-AR',{dateStyle:'medium',timeZone:'UTC'}).format(new Date(resource.published)) }}</time></div><div><h2><a :href="resource.path">{{ resource.title }}</a></h2><p>{{ resource.summary }}</p><a :href="resource.path" class="text-link inline-flex min-h-11 items-center" data-analytics-cta="resource_read" :data-analytics-label="resource.id" data-analytics-funnel="content_discovery">Leer guía <span aria-hidden="true" class="ml-3">→</span></a></div></article></div></div></section></main><FooterSection/><WhatsAppButton/></div></template>
<style scoped>
.resource-row{display:grid;grid-template-columns:.3fr 1fr;gap:48px;padding-block:40px;border-top:1px solid var(--color-border)}.resource-meta{font-size:13px;line-height:1.8;color:var(--color-muted)}.resource-meta span,.resource-meta time{display:block;margin-top:10px}.resource-meta p{color:var(--color-link)}.resource-row h2{font-size:clamp(24px,3vw,36px);line-height:1.2;max-width:35ch;font-weight:600}.resource-row h2 a:hover{color:var(--color-link)}.resource-row>div>p{max-width:65ch;margin-block:20px;line-height:1.8;color:var(--color-muted)}@media(max-width:639px){.resource-row{grid-template-columns:1fr;gap:20px}.resource-meta{display:flex;gap:16px;flex-wrap:wrap}.resource-meta span,.resource-meta time{margin:0}}
</style>
