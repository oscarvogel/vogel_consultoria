<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import mark from '../../assets/brand/vogel-simbolo.svg';
import { loadPortfolioMotion, reducedPortfolioMotion } from '../../lib/portfolioMotion.js';
const props = defineProps({ view: String, covered: Boolean, compact: Boolean, active: { type: String, default: 'projects' } });
const emit = defineEmits(['update:view','menu-change']);
const open = ref(false);
const trigger = ref(null), menu = ref(null), closer = ref(null);
const links = [
  {id:'solutions',label:'Soluciones',href:'/soluciones/'},
  {id:'resources',label:'Recursos',href:'/recursos/'},
  {id:'projects',label:'Proyectos',href:'/'},
  {id:'studio',label:'Estudio',href:'/estudio/'},
  {id:'contact',label:'Contacto',href:'/contacto/'},
];
// The rail is a wheel: `rotation` is the index sitting at the centre slot, `spread` opens (1) or collapses (0) it.
// Slots reproduce the original arc exactly at rest; between slots positions are interpolated.
const slots = [{o:-2,y:-112,x:6,a:-40},{o:-1,y:-58,x:24,a:-20},{o:0,y:0,x:0,a:0},{o:1,y:58,x:24,a:20},{o:2,y:112,x:6,a:40}];
const activeIndex = () => Math.max(0, links.findIndex(link => link.id === props.active));
const rotation = ref(activeIndex()), spread = ref(props.compact ? 0 : 1);
const hovering = ref(false), focused = ref(false);
const expanded = computed(() => !props.compact || hovering.value || focused.value);
// Hover only counts after a real pointer movement inside the wheel: a layout change under a parked pointer fires
// synthetic enter events, which would re-open the wheel right after it collapsed.
let calmUntil = 0;
function onPointerMove(event) { if (performance.now() > calmUntil && (event.movementX || event.movementY)) hovering.value = true; }
function onFocusIn(event) { focused.value = event.target.matches(':focus-visible'); } // keyboard focus only; a click leaves focus on the link
function onFocusOut(event) { if (!event.currentTarget.contains(event.relatedTarget)) focused.value = false; }
watch(() => props.compact, value => { if (value) { hovering.value = false; focused.value = false; calmUntil = performance.now() + 600; } });
watch(() => props.active, () => { focused.value = false; });
const wrap = value => ((value + 2.5) % 5 + 5) % 5 - 2.5;
function slotAt(offset) {
  const clamped = Math.max(-2, Math.min(2, offset)), low = Math.floor(clamped) + 2, high = Math.min(4, low + 1), t = clamped + 2 - low;
  const a = slots[low], b = slots[high], lerp = key => a[key] + (b[key] - a[key]) * t;
  const beyond = offset - clamped; // past ±2 the item keeps travelling along the last segment while it fades out
  return { y: lerp('y') + beyond * 54, x: lerp('x') - Math.abs(beyond) * 18, a: lerp('a') + beyond * 20 };
}
const wheel = computed(() => links.map((link, index) => {
  const offset = wrap(index - rotation.value), current = link.id === props.active;
  const place = slotAt(offset * spread.value);
  const opacity = Math.max(0, Math.min(1, (2.5 - Math.abs(offset)) / .5)) * (current ? 1 : spread.value);
  const wrapped = Math.abs(offset) > 2.45; // only the item travelling round the back is hidden outright
  return { transform: `translate(${place.x}px, ${place.y}px) rotate(${place.a}deg)`, opacity, visibility: wrapped ? 'hidden' : undefined, pointerEvents: !current && spread.value < .6 ? 'none' : undefined };
}));
const markScale = computed(() => .76 + .24 * spread.value);
const tweens = {};
function animate(key, target, duration) {
  const source = key === 'rotation' ? rotation : spread;
  tweens[key]?.kill();
  if (reducedPortfolioMotion()) { source.value = target; return; }
  loadPortfolioMotion().then(({ gsap }) => {
    const state = { value: source.value };
    tweens[key] = gsap.to(state, { value: target, duration, ease: 'expo.out', onUpdate: () => { source.value = state.value; } });
  }).catch(() => { source.value = target; });
}
watch(() => props.active, () => {
  let delta = ((activeIndex() - rotation.value) % 5 + 5) % 5;
  if (delta > 2.5) delta -= 5; // shortest way round the wheel
  animate('rotation', rotation.value + delta, .75);
});
watch(expanded, value => animate('spread', value ? 1 : 0, value ? .5 : .65));
onBeforeUnmount(() => Object.values(tweens).forEach(tween => tween?.kill()));
const activeLabel = computed(() => links.find(link => link.id === props.active)?.label || 'Proyectos');
async function close(restore=true) {open.value=false;await nextTick();if(restore)trigger.value?.focus({preventScroll:true});}
watch(open,async value=>{emit('menu-change',value);await nextTick();if(value)closer.value?.focus();});
watch(()=>props.covered,value=>{if(value)close(false);});
function trap(event) {
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key!=='Tab')return;
  const items=[...menu.value.querySelectorAll('a,button')];
  if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1).focus();}
  else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0].focus();}
}
function chooseView(value){emit('update:view',value);close();}
</script>
<template>
  <nav class="portfolio-rail" :class="{'is-compact':!expanded}" aria-label="Navegación del portfolio" :inert="covered || open || undefined">
    <div class="rail-wheel" :style="{'--spread': spread}" @pointermove="onPointerMove" @pointerleave="hovering=false" @focusin="onFocusIn" @focusout="onFocusOut">
      <img :src="mark" alt="" width="72" height="58" class="rail-mark" :style="{transform:`scale(${markScale})`}" />
      <a v-for="(link,index) in links" :key="link.id" :href="link.href" class="rail-link" :class="{'is-current':link.id===active}" :aria-current="link.id===active?'page':undefined"
        :style="wheel[index]">{{ link.label }}</a>
    </div>
  </nav>
  <button ref="trigger" :aria-label="`${activeLabel}, abrir navegación`" class="portfolio-menu-button" :inert="covered || open || undefined" :aria-expanded="open" aria-controls="portfolio-mobile-menu" @click="open=true">{{ activeLabel }}
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 6h12M4 10h12M4 14h12"/></svg>
  </button>
  <div v-if="open" id="portfolio-mobile-menu" ref="menu" class="portfolio-mobile-menu" role="dialog" aria-modal="true" aria-label="Navegación de Vogel" @keydown="trap">
    <button ref="closer" class="mobile-menu-close" @click="close()">Cerrar <svg viewBox="0 0 20 20" width="16" height="16" stroke="currentColor" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15"/></svg></button>
    <nav aria-label="Secciones"><a v-for="link in links" :key="link.id" :href="link.href" :aria-current="link.id===active?'page':undefined" @click="close(false)">{{link.label}}</a></nav>
    <div v-if="active==='projects'" class="mobile-view-options" role="group" aria-label="Vista de proyectos">
      <button :aria-pressed="view==='carousel'" @click="chooseView('carousel')">Carrusel</button>
      <button :aria-pressed="view==='grid'" @click="chooseView('grid')">Grilla</button>
    </div>
  </div>
</template>
<style scoped>
.portfolio-rail{position:fixed;left:24px;top:0;bottom:0;width:calc(var(--portfolio-edge) - 48px);z-index:30;pointer-events:none}
/* The only interactive area: it hugs the wheel and shrinks with it (V + label when collapsed). */
.rail-wheel{position:absolute;left:0;top:50%;width:280px;height:calc(84px + 216px * var(--spread));transform:translateY(-50%);pointer-events:auto}
.rail-mark{position:absolute;left:0;top:calc(50% - 29px);width:72px;height:58px;transform-origin:center}
.rail-link{position:absolute;left:112px;top:calc(50% - 22px);transform-origin:left center;will-change:transform,opacity;display:flex;align-items:center;justify-content:center;min-height:44px;min-width:104px;padding:0 16px;border-radius:4px;font-size:16px;color:var(--color-muted);transition:color 180ms,background-color 180ms}
.rail-link.is-current{background:var(--color-raised);color:var(--color-heading)}.rail-link:hover,.rail-link:focus-visible{color:var(--color-heading);background:var(--color-panel)}
.portfolio-menu-button{display:none}
.portfolio-mobile-menu{position:fixed;inset:0;z-index:90;display:flex;flex-direction:column;justify-content:center;padding:80px 32px;background:var(--color-background)}
.mobile-menu-close{position:absolute;right:24px;top:24px;display:flex;align-items:center;gap:12px;min-height:44px;padding:0 16px;background:var(--color-panel);border-radius:8px}
.portfolio-mobile-menu nav{display:grid;gap:4px}.portfolio-mobile-menu nav a{font-size:clamp(24px,7vw,36px);font-family:var(--font-display);font-weight:800;min-height:52px;display:flex;align-items:center}
.mobile-view-options{display:flex;gap:12px;margin-top:32px}.mobile-view-options button{min-height:44px;padding:0 18px;border:1px solid var(--color-border);border-radius:8px}.mobile-view-options button[aria-pressed=true]{color:var(--color-action);border-color:var(--color-action)}
@media(min-width:768px) and (max-width:1100px){.rail-wheel{width:220px}.rail-link{left:78px;min-width:92px;font-size:14px}.rail-mark{width:54px;height:44px}}
@media(max-width:767px){.portfolio-rail{display:none}.portfolio-menu-button{position:fixed;right:24px;top:24px;z-index:60;display:flex;align-items:center;gap:14px;min-height:44px;padding:0 16px;background:var(--color-raised);color:var(--color-heading);border-radius:4px;font-size:14px}}
</style>
