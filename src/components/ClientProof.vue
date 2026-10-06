<script setup>
import {webProjects} from '../data/projects.js';
</script>
<template>
 <section class="client-proof" aria-labelledby="client-proof-title">
  <div class="section-shell">
   <div class="proof-heading"><h2 id="client-proof-title">Desarrollo web para empresas y organizaciones</h2><a class="text-link" href="#clientes">Ver proyectos</a></div>
   <ul class="proof-list">
    <li v-for="project in webProjects" :key="project.url">
     <a :href="project.url" target="_blank" rel="noopener noreferrer" :aria-label="'Visitar sitio de '+project.name" data-analytics-cta="home_client_site" :data-analytics-label="project.name">
      <span v-if="project.logo" class="proof-logo"><img :src="project.logo" :alt="project.name" width="280" height="160" loading="lazy" decoding="async" /></span>
      <span v-else class="proof-name">{{ project.name }}</span>
     </a>
    </li>
   </ul>
  </div>
 </section>
</template>
<style scoped>
.client-proof{padding-block:40px 64px}.proof-heading{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-bottom:32px}.proof-heading h2{font-family:var(--font-display);font-size:clamp(22px,2vw,28px);line-height:1.2;font-weight:600;max-width:32ch}.proof-heading a{display:inline-flex;align-items:center;min-height:44px;font-size:14px;flex-shrink:0}
.proof-list{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;align-items:center}.proof-list a{display:flex;align-items:center;justify-content:center;min-height:168px;border-radius:12px;transition:transform 180ms var(--ease-out)}.proof-logo{display:flex;align-items:center;justify-content:center;width:100%;height:168px;border-radius:12px;background:#fff;padding:16px 20px}.proof-logo img{width:100%;height:100%;object-fit:contain}.proof-name{text-align:center;font-size:14px;line-height:1.5;font-weight:600;color:var(--color-heading)}
@media(hover:hover) and (pointer:fine){.proof-list a:hover{transform:translateY(-2px)}}
.proof-list a:active{transform:translateY(1px)}
@media(max-width:1023px){.proof-list{gap:16px}.proof-logo{padding:14px;height:152px}.proof-list a{min-height:152px}}
@media(max-width:767px){.proof-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:639px){.client-proof{padding-block:28px 40px}.proof-heading{display:block;margin-bottom:20px}.proof-list{gap:12px}.proof-heading a{margin-top:12px}.proof-logo{height:136px;padding:12px}.proof-list a{min-height:136px}}
</style>
