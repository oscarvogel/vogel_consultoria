<script setup>
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Navbar from './components/Navbar.vue';
import HomeStage from './components/home/HomeStage.vue';
import PortfolioNav from './components/home/PortfolioNav.vue';
import PortfolioDestination from './components/home/PortfolioDestination.vue';
import LiveClock from './components/home/LiveClock.vue';
import Preloader from './components/home/Preloader.vue';
import StageBackdrop from './components/home/StageBackdrop.vue';
import { getProject } from './data/homeCards.js';
import { cancelSharedImage, revealSharedImage } from './lib/portfolioMotion.js';

const ProjectDetail = defineAsyncComponent(() => import('./components/home/ProjectDetail.vue'));
const view = ref('grid');
const stage = ref(null);
const menuOpen = ref(false);
const route = ref({ kind: 'home' });
// Backdrop colour follows the centred project on Home; elsewhere it settles back to charcoal.
const centredProject = ref(null);
// Latched: once the visitor has started browsing projects the wheel stays collapsed whenever Home is shown again.
const browsing = ref(false);
// Destinations share one brand backdrop: the dark amber of the Vogel accent (#FFBC54 at ~27% lightness).
const DESTINATION_ACCENT = '#704d1a';
const backdropAccent = computed(() => route.value.kind === 'destination' ? DESTINATION_ACCENT
  : (route.value.kind === 'home' && getProject(centredProject.value)?.accent) || '#020f1f');
let snapshot = null;
let returnFocus = null;
let bridge = null;
let returnId = null;

try {
  snapshot = JSON.parse(sessionStorage.getItem('vogel-portfolio-return') || 'null');
  returnId = snapshot?.activeId;
} catch { /* storage optional */ }
try {
  const savedView = localStorage.getItem('vogel-home-view');
  if (savedView === 'grid' || savedView === 'carousel') view.value = savedView;
} catch { /* storage optional */ }

const destinationPaths = new Map([
  ['/soluciones/', 'solutions'],
  ['/recursos/', 'resources'],
  ['/estudio/', 'studio'],
  ['/contacto/', 'contact'],
]);
const destinationTitles = {
  solutions: 'Soluciones', resources: 'Recursos', studio: 'Estudio', contact: 'Contacto',
};
const legacyHashRoutes = new Map([
  ['info', '/estudio/'],
  ['servicios', '/soluciones/#servicios'],
  ['soluciones', '/soluciones/#soluciones'],
  ['recursos', '/recursos/#recursos'],
  ['metodologia', '/estudio/#metodologia'],
  ['nosotros', '/estudio/#nosotros'],
  ['contacto', '/contacto/#contacto'],
  ['charla-ia-2026', '/contacto/#contacto'],
]);

function decodedHash(value = location.hash) {
  try { return decodeURIComponent(value.replace(/^#/, '')); } catch { return ''; }
}

function legacyDestination(pathname, hash) {
  if (pathname === '/info' || pathname === '/info/') {
    return legacyHashRoutes.get(hash) || '/estudio/';
  }
  if (pathname === '/' && hash && legacyHashRoutes.has(hash)) return legacyHashRoutes.get(hash);
  return null;
}

function normalizePath(pathname) {
  if (pathname === '/' || pathname.endsWith('/')) return pathname;
  return `${pathname}/`;
}

function readRoute() {
  let pathname = location.pathname;
  const hash = decodedHash();
  const legacy = legacyDestination(pathname, hash);
  if (legacy) {
    history.replaceState(history.state, '', legacy);
    pathname = new URL(legacy, location.origin).pathname;
  }

  pathname = normalizePath(pathname);
  const projectId = pathname.match(/^\/proyectos\/([^/]+)\/$/)?.[1];
  const project = projectId && getProject(projectId);
  if (project) return { kind: 'project', project };

  const destination = destinationPaths.get(pathname);
  if (destination) return { kind: 'destination', destination };
  return { kind: 'home' };
}

route.value = readRoute();

async function sync() {
  cancelSharedImage();
  route.value = readRoute();
  menuOpen.value = false;
  document.documentElement.classList.toggle('is-stage', route.value.kind === 'home');
  document.documentElement.classList.remove('has-info-open');
  document.title = route.value.kind === 'project'
    ? `${route.value.project.title} — Vogel Consultoría`
    : route.value.kind === 'destination'
      ? `${destinationTitles[route.value.destination]} — Vogel Consultoría`
      : 'Vogel Consultoría';

  await nextTick();
  if (route.value.kind === 'home') {
    stage.value?.restore(snapshot);
    const card = stage.value?.cardElement(returnId || returnFocus?.dataset?.projectId);
    (card || returnFocus)?.focus({ preventScroll: true });
    if (bridge && card) revealSharedImage(bridge, card.querySelector('img'));
    bridge = null;
    return;
  }

  if (route.value.kind === 'destination') {
    const hash = decodedHash();
    const target = hash && document.getElementById(hash);
    const heading = document.querySelector('[data-destination-heading]');
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'auto' });
      target.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
      heading?.focus({ preventScroll: true });
    }
  }
}

function source(element) {
  const image = element?.querySelector('img');
  return image ? {
    rect: image.getBoundingClientRect(),
    src: image.currentSrc,
    position: getComputedStyle(image).objectPosition,
  } : null;
}

function normalizeLink(url) {
  const hash = decodedHash(url.hash);
  const legacy = legacyDestination(url.pathname, hash);
  if (legacy) return new URL(legacy, location.origin);
  url.pathname = normalizePath(url.pathname);
  return url;
}

function skipToContent() {
  const main = document.querySelector('main:not(.portfolio-covered)');
  if (!main) return;
  if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
  main.focus({ preventScroll: false });
}

function navigate(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!link || link.target || link.hasAttribute('download')) return;

  const linkedUrl = new URL(link.href);
  if (linkedUrl.origin !== location.origin) return;
  const url = normalizeLink(linkedUrl);
  const isHome = url.pathname === '/';
  const isDestination = destinationPaths.has(url.pathname);
  const projectId = url.pathname.match(/^\/proyectos\/([^/]+)\/$/)?.[1];
  if (!isHome && !isDestination && !projectId && url.pathname !== '/info/') return;

  event.preventDefault();
  if (route.value.kind === 'home') {
    snapshot = stage.value?.snapshot();
    returnFocus = link;
    returnId = link.dataset.projectId;
    try { sessionStorage.setItem('vogel-portfolio-return', JSON.stringify(snapshot)); } catch { /* optional */ }
  }
  bridge = projectId ? source(link) : null;
  history.pushState({ portfolio: true }, '', url);
  sync();
}

function close() {
  if (route.value.kind === 'project') bridge = source(document.querySelector('.project-hero'));
  if (history.state?.portfolio) history.back();
  else {
    history.replaceState({}, '', '/');
    sync();
  }
}

function ready() {
  if (bridge) {
    revealSharedImage(bridge, document.querySelector('.project-hero img'));
    bridge = null;
  }
}

watch(view, value => {
  try { localStorage.setItem('vogel-home-view', value); } catch { /* optional */ }
});

onMounted(() => {
  sync();
  window.addEventListener('popstate', sync);
  window.addEventListener('hashchange', sync);
  window.addEventListener('resize', cancelSharedImage);
});

onBeforeUnmount(() => {
  cancelSharedImage();
  window.removeEventListener('popstate', sync);
  window.removeEventListener('hashchange', sync);
  window.removeEventListener('resize', cancelSharedImage);
  document.documentElement.classList.remove('is-stage', 'has-info-open');
});
</script>

<template>
  <div class="home-page" @click="navigate">
    <StageBackdrop :accent="backdropAccent" :active="route.kind === 'home' || route.kind === 'destination'" :soft="route.kind === 'destination'" />
    <Preloader v-if="route.kind === 'home'" />
    <div :inert="route.kind === 'project' || menuOpen || undefined" :class="{ 'portfolio-covered': route.kind === 'project' }">
      <a class="skip-link" href="#main-content" @click.prevent.stop="skipToContent">Saltar al contenido principal</a>
      <Navbar :view="route.kind === 'home' ? view : null" portfolio @update:view="view = $event" />
    </div>
    <div :inert="route.kind === 'project' || undefined" :class="{ 'portfolio-covered': route.kind === 'project' }">
      <PortfolioNav
        v-model:view="view"
        :active="route.kind === 'destination' ? route.destination : 'projects'"
        :covered="route.kind === 'project'"
        :compact="route.kind === 'home' && browsing"
        @menu-change="menuOpen = $event"
      />
    </div>
    <main
      id="main-content"
      tabindex="-1"
      :inert="route.kind !== 'home' || menuOpen || undefined"
      :class="{ 'portfolio-covered': route.kind === 'project' }"
    >
      <HomeStage ref="stage" :view="view" :away="route.kind === 'destination'" :active="route.kind === 'home' && !menuOpen" @active-change="centredProject = $event" @scroll-state="browsing = browsing || $event" />
    </main>
    <Transition name="portfolio-fade">
      <div v-if="route.kind === 'home'" class="portfolio-clock" :inert="menuOpen || undefined"><LiveClock /></div>
    </Transition>
    <Transition name="portfolio-destination" mode="out-in">
      <PortfolioDestination v-if="route.kind === 'destination'" :key="route.destination" :page="route.destination" />
    </Transition>
    <ProjectDetail v-if="route.kind === 'project'" :project="route.project" @close="close" @ready="ready" />
  </div>
</template>

<style>
:root { --portfolio-edge: 34.4vw; }
/* AnimateOnScroll (PrimeVue directive) enter class: short rise, staggered by --i on list items. */
.vogel-rise { animation: vogel-rise 560ms cubic-bezier(.22, 1, .36, 1) both; animation-delay: calc(min(var(--i, 0), 6) * 70ms); }
@keyframes vogel-slide { from { opacity: 0; transform: translateX(48px); } to { opacity: 1; transform: none; } }
.vogel-slide { animation: vogel-slide 800ms cubic-bezier(.22, 1, .36, 1) both; }
@keyframes vogel-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .vogel-slide, .vogel-rise { animation: vogel-fade 1ms both; } @keyframes vogel-fade { to { opacity: 1; } } }
html.is-stage, html.is-stage body { height: 100%; overflow: hidden; }
/* Keep the scrollbar's room reserved so fixed controls do not slide sideways when a destination gains scroll. */
html { scrollbar-gutter: stable; }
html.has-info-open body { overflow: hidden; }
.portfolio-covered { display: none !important; }
.portfolio-clock { position: fixed; bottom: 24px; right: 24px; z-index: 20; color: var(--color-muted); font-size: 12px; }
.portfolio-image-bridge { position: fixed; z-index: 95; pointer-events: none; overflow: hidden; border-radius: 12px; }
.portfolio-image-bridge img { width: 100%; height: 100%; object-fit: cover; }
/* A whole view fades, not just its text. Opacity only: a transform on an ancestor would become the containing block of
   position:fixed descendants (Oscar's portrait) and make them jump when the transition ends. */
.portfolio-destination-enter-active { transition: opacity 520ms cubic-bezier(.22, 1, .36, 1) 120ms; }
.portfolio-destination-leave-active { transition: opacity 240ms ease; }
.portfolio-destination-enter-from, .portfolio-destination-leave-to { opacity: 0; }
.portfolio-fade-enter-active, .portfolio-fade-leave-active { transition: opacity 360ms ease; }
.portfolio-fade-enter-from, .portfolio-fade-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .portfolio-destination-enter-active, .portfolio-destination-leave-active, .portfolio-fade-enter-active, .portfolio-fade-leave-active { transition: none; }
}
@media (max-width: 767px) { .portfolio-clock { display: none; } }
</style>
