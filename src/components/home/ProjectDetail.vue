<script setup>
import {nextTick,onMounted,ref} from 'vue';
import {forestCase} from '../../data/forestCase.js';
const props=defineProps({project:{type:Object,required:true}});
const emit=defineEmits(['close','ready']);
const closeButton=ref(null);
onMounted(async()=>{await nextTick();closeButton.value?.focus({preventScroll:true});emit('ready');});
</script>
<template>
  <main class="project-reader" :class="{'project-reader--hero-clearance':['femag','pyfe','mantenimiento','vogel-whatsapp-api'].includes(project.id)}" @keydown.esc.prevent="emit('close')">
    <a href="/" class="reader-brand">Vogel Consultoría</a>
    <button ref="closeButton" class="reader-close" @click="emit('close')">Cerrar ×</button>
    <figure class="project-hero"><img :src="project.image" :srcset="project.imageSmall ? `${project.imageSmall} 800w, ${project.image} 1600w` : undefined" :sizes="project.imageSmall ? '(max-width: 767px) calc(100vw - 32px), 1277px' : undefined" :alt="project.alt" width="1600" height="900" fetchpriority="high"/></figure>
    <div class="reader-context">
      <p>{{project.category}} · {{project.tag}}</p><h1>{{project.title}}</h1>
      <p class="reader-description">{{project.description}}</p><p>{{project.context}}</p>
      <a v-if="project.url" :href="project.url" target="_blank" rel="noopener noreferrer">{{project.linkLabel || 'Ver sitio ↗'}}</a>
      <template v-if="project.forest"><p>{{forestCase.disclaimer}}</p><p>{{forestCase.caveat}}</p></template>
    </div>
    <div v-if="project.forest || project.gallery?.length" class="reader-gallery">
      <template v-if="project.forest"><section v-for="step in forestCase.steps" :key="step.id" v-animateonscroll.once="{ enterClass: 'vogel-rise', threshold: .12 }"><h2>{{step.title}}</h2><p>{{step.text}}</p><img :src="step.desktopDisplayImage || step.displayImage" :alt="step.alt" :width="step.desktopWidth || step.width" :height="step.desktopHeight || step.height" loading="lazy" decoding="async" :class="{'is-mobile-image':!step.desktopDisplayImage}"/></section></template>
      <figure v-else v-for="image in project.gallery" :key="image.src" v-animateonscroll.once="{ enterClass: 'vogel-rise', threshold: .12 }"><figcaption>{{image.label}}</figcaption><img :src="image.src" :alt="image.alt" :width="image.width" :height="image.height" loading="lazy" decoding="async" :class="{'is-mobile-image':image.label==='Móvil'}"/></figure>
    </div>
    <footer class="reader-context reader-footer" v-animateonscroll.once="{ enterClass: 'vogel-rise', threshold: .12 }"><h2>¿Trabajamos juntos?</h2><a href="/info/#contacto" data-analytics-cta="project_contact">Contanos qué necesitás resolver →</a><a href="/">Volver a proyectos ←</a></footer>
  </main>
</template>
<style scoped>
.project-reader{min-height:100svh;background:#F3F1E2;color:rgb(var(--vogel-navy));padding:24px 24px 80px;--color-heading:rgb(var(--vogel-navy));--color-text:rgb(var(--vogel-navy));--color-muted:#625f56;--color-border:rgb(var(--vogel-navy)/.2)}.reader-brand{position:absolute;left:24px;top:24px;min-height:44px;display:flex;align-items:center;font-size:14px}.reader-close{position:fixed;right:36px;top:36px;z-index:85;min-height:44px;padding:0 20px;background:#F3F1E2;color:rgb(var(--vogel-navy));border:1px solid rgb(var(--vogel-navy)/.2);border-radius:4px}.project-hero{margin:0 0 64px 8vw;border-radius:12px;overflow:hidden;background:#dfddd0}.project-hero img{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}.reader-context{max-width:1000px;margin:0 auto 64px;padding:0 24px}.reader-context h1{font-family:var(--font-display);font-stretch:125%;font-weight:800;font-size:clamp(36px,5vw,80px);line-height:1;text-transform:uppercase;margin:24px 0;overflow-wrap:anywhere}.reader-description{font-size:clamp(20px,2vw,30px)}.reader-context a{display:inline-flex;align-items:center;min-height:44px;text-decoration:underline;text-underline-offset:5px}.reader-gallery{max-width:1200px;margin:auto;display:grid;gap:64px}.reader-gallery figure{margin:0}.reader-gallery h2{font-size:28px;margin:0 0 16px}.reader-gallery p,.reader-gallery figcaption{margin:0 0 24px}.reader-gallery img{display:block;width:100%;height:auto;border:1px solid rgb(var(--vogel-navy))22;border-radius:8px}.reader-gallery .is-mobile-image{max-width:390px;margin:auto}.reader-footer{margin-top:100px;display:flex;flex-direction:column;align-items:start;gap:16px}
.project-reader--hero-clearance .project-hero{margin-top:72px}
@media(max-width:767px){.project-reader{padding:88px 16px 48px}.project-hero{margin:0 0 32px}.project-hero img{aspect-ratio:4/3}.reader-close{top:20px;right:16px}.reader-context{padding:0;margin-bottom:40px}.reader-gallery{gap:40px}.reader-brand{left:16px;top:20px}.reader-context h1{font-size:34px}}
</style>
