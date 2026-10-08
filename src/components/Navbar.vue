<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import logoVogel from '../assets/brand/vogel-v-amber.svg';
import InfoPanel from './home/InfoPanel.vue';
const props = defineProps({view:{type:String,default:null},portfolio:Boolean});
const emit = defineEmits(['update:view']);
const open = ref(false), infoButton = ref(null);
const panelHashes = new Set(['info','servicios','metodologia','nosotros','recursos','contacto','charla-ia-2026','soluciones']);
function syncFromHash(){if(props.portfolio)return;try{if(panelHashes.has(decodeURIComponent(location.hash.slice(1))))open.value=true;}catch{/* malformed URL hash */}}
async function close(){open.value=false;await nextTick();infoButton.value?.focus({preventScroll:true});}
watch(open,value=>document.documentElement.classList.toggle('has-info-open',value));
onMounted(()=>{syncFromHash();window.addEventListener('hashchange',syncFromHash);});
onBeforeUnmount(()=>{window.removeEventListener('hashchange',syncFromHash);document.documentElement.classList.remove('has-info-open');});
</script>
<template>
  <header class="site-header" :class="{'is-portfolio':portfolio}" :inert="open || undefined">
    <a href="/" class="brand-link" aria-label="Vogel Consultoría — inicio"><img :src="logoVogel" alt="" width="26" height="26"/><span>Vogel Consultoría</span></a>
    <Transition name="toggle-fade"><div v-if="view" class="view-toggle" role="group" aria-label="Vista">
      <button type="button" :aria-pressed="view==='carousel'" aria-label="Vista de carrusel" @click="emit('update:view','carousel')"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="4" width="14" height="12" rx="1"/></svg></button>
      <button type="button" :aria-pressed="view==='grid'" aria-label="Vista de grilla" @click="emit('update:view','grid')"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="3" width="6" height="6"/><rect x="11" y="3" width="6" height="6"/><rect x="3" y="11" width="6" height="6"/><rect x="11" y="11" width="6" height="6"/></svg></button>
    </div></Transition>
    <a v-if="portfolio" href="/estudio/" class="info-button">Info</a>
    <button v-else ref="infoButton" type="button" class="info-button" :aria-expanded="open" aria-controls="info-panel" @click="open=true">Info</button>
  </header>
  <InfoPanel v-if="!portfolio" :open="open" @close="close"/>
</template>
<style scoped>
.site-header{position:fixed;inset:0 0 auto;z-index:60;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;height:72px;padding-inline:max(20px,2vw);color:var(--color-text)}
.brand-link{display:inline-flex;align-items:center;gap:10px;justify-self:start;min-height:44px;font-size:15px;color:var(--color-heading)}
.toggle-fade-enter-active,.toggle-fade-leave-active{transition:opacity 320ms ease}.toggle-fade-enter-from,.toggle-fade-leave-to{opacity:0}@media(prefers-reduced-motion:reduce){.toggle-fade-enter-active,.toggle-fade-leave-active{transition:none}}
.view-toggle{display:flex;gap:0;padding:0}.view-toggle button{display:grid;place-items:center;width:44px;height:44px;border-radius:4px;color:var(--color-muted);transition:background-color 160ms,color 160ms}.view-toggle button[aria-pressed=true]{background:#3b3933;color:var(--color-heading)}.view-toggle button:hover{color:var(--color-heading)}
.info-button{grid-column:3;justify-self:end;display:inline-flex;align-items:center;justify-content:center;min-height:44px;min-width:90px;padding:0 20px;border-radius:4px;background:#3b3933;font-size:14px;color:var(--color-heading);transition:background-color 160ms,color 160ms}.info-button:hover{background:var(--color-action);color:var(--color-action-text)}
.is-portfolio{height:82px;padding-inline:24px}.is-portfolio .view-toggle{position:absolute;left:var(--portfolio-edge);top:20px}.is-portfolio .info-button{position:absolute;right:24px;top:20px}.is-portfolio .brand-link img{display:none}
@media(max-width:767px){.site-header{height:72px}.is-portfolio .view-toggle,.is-portfolio .info-button{display:none}.is-portfolio .brand-link{max-width:150px;font-size:14px}.is-portfolio .brand-link img{display:block;width:24px;height:24px}.is-portfolio .brand-link span{display:none}}
</style>
