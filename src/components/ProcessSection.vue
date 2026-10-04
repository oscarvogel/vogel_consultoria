<script setup>
import {ref} from 'vue';
import {useProcessMotion} from '../composables/useSiteMotion.js';
const root=ref(null);useProcessMotion(root);
const steps=[
 {label:'Diagnóstico',description:'Entendemos tu operación, detectamos fricciones y priorizamos oportunidades de impacto.'},
 {label:'Diseño de solución',description:'Definimos la arquitectura y el enfoque antes de escribir una línea de código.'},
 {label:'Implementación',description:'Desarrollamos, integramos y desplegamos con ciclos cortos y feedback continuo.'},
 {label:'Mejora continua',description:'Medimos resultados, ajustamos y acompañamos el crecimiento de la solución.'}
];
</script>
<template><section data-chapter="methodology" ref="root" id="metodologia" class="section-space" aria-labelledby="proceso-heading"><div class="section-shell process-layout"><div class="process-intro" data-story-reveal><h2 id="proceso-heading" class="section-title" data-text-reveal>Un proceso claro.<br>De principio a implementación.</h2><p class="section-description">Primero entendemos el negocio. Después construimos la solución, por etapas y con tu equipo.</p><div class="process-progress" aria-hidden="true"><span></span></div><a class="text-link" href="#contacto">Empezar con un diagnóstico</a></div><ol><li v-for="(step,index) in steps" :key="step.label" class="process-step" data-story-reveal><span class="step-index">{{ String(index+1).padStart(2,'0') }}</span><div><h3>{{ step.label }}</h3><p>{{ step.description }}</p></div></li></ol></div></section></template>
<style scoped>
.process-layout{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}.process-intro{position:sticky;top:var(--header-offset)}.process-intro>a{display:inline-block;margin-top:32px}.process-progress{height:2px;background:var(--color-border);margin-top:32px;max-width:300px}.process-progress span{display:block;height:100%;width:100%;background:var(--color-link);transform-origin:left;transform:scaleX(var(--process-progress,.25));transition:transform 200ms ease-out}.process-step{display:flex;gap:26px;padding:38px 0 50px;border-top:1px solid var(--color-border);min-height:240px}.step-index{font-family:var(--font-display);font-size:24px;color:var(--color-muted);font-variant-numeric:tabular-nums}.process-step h3{font-size:28px;font-weight:600}.process-step p{margin-top:18px;line-height:1.8;color:var(--color-muted)}.step-current .step-index{color:var(--color-action)}
@media(max-width:1023px),(max-height:799px){.process-intro{position:static}.process-progress{display:none}.process-step{min-height:0}}
@media(max-width:767px){.process-layout{grid-template-columns:1fr;gap:40px}.process-step{padding-block:28px}.process-step h3{font-size:25px}}
@media(prefers-reduced-motion:reduce){.process-intro{position:static}.process-progress{display:none}.process-step{min-height:0}}
</style>
