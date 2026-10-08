<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ProjectCard from './ProjectCard.vue';
import { homeCards } from '../../data/homeCards.js';
import { loadPortfolioMotion, reducedPortfolioMotion } from '../../lib/portfolioMotion.js';
const props = defineProps({ view: { type: String, default: 'carousel' }, active: { type: Boolean, default: true }, away: Boolean });
const emit = defineEmits(['active-change', 'scroll-state']);
let reportedId = null, reportedCompact = null;
// Tells the backdrop which project is centred and the wheel whether the visitor started browsing projects.
function report() {
  const compact = props.view === 'grid' || (track.value?.scrollLeft || 0) > 80;
  if (compact !== reportedCompact) { reportedCompact = compact; emit('scroll-state', compact); }
  if (activeId !== reportedId) { reportedId = activeId; emit('active-change', activeId); }
}
const track = ref(null);
let activeId = homeCards[0]?.id;
let position = 0, target = 0, frame = 0, paintFrame = 0, lastTime = 0;
let motion, flip, disposed = false, drag = null, suppressClick = false, viewRevision = 0;
const finePointer = () => matchMedia('(pointer:fine)').matches;
const maxScroll = () => Math.max(0, track.value.scrollWidth - track.value.clientWidth);
function stop() { cancelAnimationFrame(frame); frame = 0; lastTime = 0; flip?.kill(); }
function paint() {
  paintFrame = 0;
  if (!track.value || !props.active) return;
  const el = track.value;
  if (props.view !== 'carousel') { report(); return; }
  const edge = parseFloat(getComputedStyle(el).paddingLeft) || 0;
  const center = (edge + el.clientWidth) / 2;
  let distance = Infinity;
  for (const card of el.querySelectorAll('.project-card')) {
    const rect = card.getBoundingClientRect();
    const offset = rect.left + Math.min(rect.width, el.clientWidth - edge) / 2 - center;
    card.style.setProperty('--card-shift', reducedPortfolioMotion() ? '0' : String(Math.max(-1, Math.min(1, offset / el.clientWidth))));
    if (Math.abs(offset) < distance) { distance = Math.abs(offset); activeId = card.dataset.projectId; }
  }
  report();
}
function schedulePaint() { if (!paintFrame && props.active) paintFrame = requestAnimationFrame(paint); }
function glide(time) {
  const dt = Math.min(48, lastTime ? time - lastTime : 16.67); lastTime = time;
  position += (target - position) * (reducedPortfolioMotion() ? 1 : 1 - Math.pow(.89, dt / 16.67));
  if (Math.abs(target - position) < .5) position = target;
  track.value.scrollLeft = position;
  frame = position === target ? 0 : requestAnimationFrame(glide);
  if (!frame) lastTime = 0;
}
function onWheel(event) {
  if (!props.active || props.view !== 'carousel' || !finePointer() || event.ctrlKey) return;
  const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
  if (!delta) return;
  if (!frame) position = target = track.value.scrollLeft;
  if ((delta < 0 && target <= 0) || (delta > 0 && target >= maxScroll() - 1)) return;
  event.preventDefault();
  target = Math.max(0, Math.min(maxScroll(), target + delta * (event.deltaMode === 1 ? 24 : event.deltaMode === 2 ? innerWidth : 1)));
  if (!frame) frame = requestAnimationFrame(glide);
}
function onScroll() { if (!frame) position = target = track.value.scrollLeft; schedulePaint(); }
function onKey(event) {
  if (props.view !== 'carousel' || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault(); stop();
  const cards = [...track.value.querySelectorAll('.project-card')];
  const index = cards.findIndex(card => card.dataset.projectId === activeId);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : Math.max(0, Math.min(cards.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)));
  const card = cards[next]; if (!card) return;
  activeId = card.dataset.projectId;
  track.value.scrollTo({left: card.offsetLeft - parseFloat(getComputedStyle(track.value).paddingLeft), behavior: reducedPortfolioMotion() ? 'instant' : 'smooth'});
}
function onPointerDown(event) {
  if (props.view !== 'carousel' || !finePointer() || event.button !== 0) return;
  stop(); drag = {id:event.pointerId, x:event.clientX, start:track.value.scrollLeft, moved:false};
}
function onPointerMove(event) {
  if (!drag || drag.id !== event.pointerId) return;
  if (!drag.moved && Math.abs(event.clientX - drag.x) > 6) { drag.moved = true; track.value.setPointerCapture(event.pointerId); }
  if (drag.moved) { event.preventDefault(); track.value.scrollLeft = drag.start - event.clientX + drag.x; }
}
function onPointerUp() { if (drag?.moved) { suppressClick = true; if(track.value.hasPointerCapture(drag.id)) track.value.releasePointerCapture(drag.id); } drag = null; }
function onClick(event) {
  if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; return; }
  const card = event.target.closest('.project-card'); if(card) activeId = card.dataset.projectId;
}
function snapshot() { return {view:props.view, activeId, scrollLeft:track.value?.scrollLeft || 0, scrollTop:track.value?.scrollTop || 0}; }
function restore(state) {
  if (!state || !track.value) return;
  activeId = state.activeId || activeId;
  track.value.scrollLeft = state.scrollLeft || 0; track.value.scrollTop = state.scrollTop || 0;
  position = target = track.value.scrollLeft;
  // Synchronous: the shared-image bridge measures its target right after restore, so the parallax must already be applied.
  cancelAnimationFrame(paintFrame); paint();
}
function cardElement(id) { return [...track.value.querySelectorAll('.project-card')].find(card => card.dataset.projectId === id); }
function onResize() { stop(); position = target = Math.min(maxScroll(), track.value.scrollLeft); schedulePaint(); }
watch(() => props.view, async () => {
  const revision = ++viewRevision;
  const id = activeId;
  const state = motion && !reducedPortfolioMotion() ? motion.Flip.getState(track.value.querySelectorAll('.project-card')) : null;
  stop(); await nextTick(); await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))); if(disposed || revision !== viewRevision) return;
  const card = cardElement(id);
  if (props.view === 'carousel' && card) track.value.scrollLeft = Math.max(0, card.offsetLeft - parseFloat(getComputedStyle(track.value).paddingLeft));
  else if(card) card.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
  position = target = track.value.scrollLeft; activeId = id;
  if(state) flip = motion.Flip.from(state, {duration:.6,ease:'expo.out',absolute:true,scale:true,onComplete:schedulePaint});
  else schedulePaint();
});
watch(() => props.active, active => { if(!active) {stop();cancelAnimationFrame(paintFrame);paintFrame=0;} else schedulePaint(); });
onMounted(() => {
  track.value.addEventListener('wheel',onWheel,{passive:false});
  window.addEventListener('resize',onResize,{passive:true}); schedulePaint();
  loadPortfolioMotion().then(value => {if(!disposed) motion=value;}).catch(()=>{});
});
onBeforeUnmount(() => {disposed=true;viewRevision++; stop();cancelAnimationFrame(paintFrame);track.value?.removeEventListener('wheel',onWheel);window.removeEventListener('resize',onResize);});
defineExpose({snapshot,restore,cardElement});
</script>
<template>
  <section class="home-stage" :class="[`is-${view}`, { 'is-away': away }]" aria-label="Proyectos de Vogel Consultoría">
    <h1 class="sr-only">Vogel Consultoría: sistemas, automatización, datos e inteligencia artificial para empresas en Argentina</h1>
    <div ref="track" class="stage-track" :class="{'is-dragging':drag?.moved}" :tabindex="view === 'carousel' ? 0 : -1" aria-label="Galería de proyectos. Flechas izquierda y derecha para recorrer."
      @dragstart.prevent @scroll.passive="onScroll" @keydown="onKey" @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerUp" @click.capture="onClick">
      <ProjectCard v-for="(card,i) in homeCards" :key="card.id" :card="card" :index="i" :compact="view === 'grid'" />
    </div>
  </section>
</template>
<style scoped>
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.home-stage{position:fixed;inset:0;overflow:hidden;transition:opacity 340ms ease,transform 520ms cubic-bezier(.22,1,.36,1),visibility 0s}
/* Leaving for a destination: the stage fades and settles back instead of vanishing (its own transform, never an ancestor's). */
.home-stage.is-away{opacity:0;transform:scale(.985);pointer-events:none;visibility:hidden;transition:opacity 340ms ease,transform 520ms cubic-bezier(.22,1,.36,1),visibility 0s 340ms}
@media(prefers-reduced-motion:reduce){.home-stage,.home-stage.is-away{transition:none}}
.stage-track{height:100%;display:flex;align-items:center;gap:20px;overflow-x:auto;overflow-y:hidden;padding:58px 24px 58px var(--portfolio-edge);scrollbar-width:none;overscroll-behavior-x:contain}
.stage-track::-webkit-scrollbar{display:none}.stage-track:focus-visible{outline:2px solid var(--color-focus);outline-offset:-6px}
.is-carousel .project-card{height:min(calc(100svh - 96px),603px);width:min(calc((100svh - 96px) * 16 / 9),1072px);aspect-ratio:16/9}
.is-grid .stage-track{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-content:start;align-items:start;grid-auto-rows:max-content;overflow:hidden auto;padding-top:88px;padding-bottom:80px;gap:24px;scrollbar-width:thin}
.is-grid .project-card{width:100%;aspect-ratio:4/5}
@media(pointer:coarse){.is-carousel .stage-track{scroll-snap-type:x mandatory}.is-carousel .project-card{scroll-snap-align:start}}
@media(hover:hover) and (pointer:fine){.is-carousel .stage-track{cursor:grab}.is-carousel .stage-track:active{cursor:grabbing}}
@media(min-width:768px) and (max-width:1100px){.is-grid .stage-track{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:767px){.stage-track{padding:100px 24px;gap:16px;scroll-padding-inline:24px}.is-carousel .project-card{width:calc(100vw - 48px);height:calc(100svh - 236px);min-height:330px;aspect-ratio:auto}.is-grid .stage-track{grid-template-columns:1fr;padding:100px 24px 80px;gap:20px}.is-grid .project-card{aspect-ratio:4/5}}
@media(max-height:620px) and (max-width:767px){.is-carousel .project-card{height:calc(100svh - 156px);min-height:0}.stage-track{padding-block:78px}}
</style>
