<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import logoVogel from '../assets/brand/vogel-v-amber.svg';
import { servicePages } from '../data/servicePages.js';
import casesIcon from '../assets/vogel-navbar-svg-icons/casos.svg?raw';
import chevronIcon from '../assets/vogel-navbar-svg-icons/chevron-down.svg?raw';
import methodologyIcon from '../assets/vogel-navbar-svg-icons/como-trabajamos.svg?raw';
import menuIcon from '../assets/vogel-navbar-svg-icons/menu.svg?raw';
import aboutIcon from '../assets/vogel-navbar-svg-icons/nosotros.svg?raw';
import portalIcon from '../assets/vogel-navbar-svg-icons/portal.svg?raw';
import resourcesIcon from '../assets/vogel-navbar-svg-icons/recursos.svg?raw';
import servicesIcon from '../assets/vogel-navbar-svg-icons/servicios.svg?raw';
import diagnosticIcon from '../assets/vogel-navbar-svg-icons/agendar-diagnostico.svg?raw';

const isOpen = ref(false);
const menuButton = ref(null);
const servicesMenu = ref(null);
const header = ref(null);
const currentPath = ref('/');
const activeSection = ref('');
const isScrolled = ref(false);
// Phase 05 closes the Home editorially: Capacidades · Casos · Método · Perspectivas · Nosotros + «Conversemos».
const phase05 = import.meta.env.VITE_SPATIAL_PHASE_05 === 'true';
const sectionIds = phase05 ? ['servicios', 'casos', 'metodologia', 'recursos', 'nosotros'] : ['servicios', 'casos', 'metodologia', 'nosotros'];
const servicesLabel = phase05 ? 'Capacidades' : 'Servicios';
const ctaLabel = phase05 ? 'Conversemos' : 'Agendar diagnóstico';
let scrollFrame = 0;
const legacyServiceIds = {
  'sistemas-a-medida': 'sistemas',
  'dashboards-ejecutivos': 'dashboards',
  'automatizacion-de-procesos': 'automatizacion',
  'contaflow-api-facturacion-electronica': 'contaflow',
  'talleres-ia': 'talleres',
  'desarrollo-web': 'web',
};

const serviceLinks = [
  ...Object.values(servicePages).map((service) => ({
    label: service.shortTitle,
    href: service.path,
    analyticsCta: `navbar_service_${legacyServiceIds[service.id] || service.id}`,
  })),
  { label: 'Inteligencia artificial', href: '/inteligencia-artificial/', analyticsCta: 'navbar_service_ia' },
  { label: 'Automatizaciones ARCA', href: '/automatizaciones/', analyticsCta: 'navbar_service_automatizaciones_arca' },
];

const links = phase05 ? [
  { label: 'Casos', href: '/#casos', section: 'casos', icon: casesIcon },
  { label: 'Método', href: '/#metodologia', section: 'metodologia', icon: methodologyIcon },
  { label: 'Perspectivas', href: '/#recursos', section: 'recursos', icon: resourcesIcon },
  { label: 'Nosotros', href: '/#nosotros', section: 'nosotros', icon: aboutIcon },
] : [
  { label: 'Casos', href: '/#casos', section: 'casos', icon: casesIcon },
  { label: 'Recursos', href: '/recursos/', icon: resourcesIcon },
  { label: 'Nosotros', href: '/#nosotros', section: 'nosotros', icon: aboutIcon },
];

function normalizePath(path) {
  const withoutTrailingSlashes = path.replace(/\/+$/, '');
  return `${withoutTrailingSlashes || ''}/`;
}

function isRouteActive(href) {
  const targetPath = href.split(/[?#]/, 1)[0];
  if (!targetPath || targetPath === '/') return false;

  const current = normalizePath(currentPath.value);
  const target = normalizePath(targetPath);
  return current === target || current.startsWith(target);
}

function isSectionActive(section) {
  return currentPath.value === '/' && activeSection.value === section;
}

function isNavItemActive(item) {
  return Boolean(item.section && isSectionActive(item.section)) || isRouteActive(item.href);
}

function ariaCurrentFor(item) {
  if (!isNavItemActive(item)) return undefined;
  return item.section ? 'location' : 'page';
}

function isServicesActive() {
  return isSectionActive('servicios') || serviceLinks.some((item) => isRouteActive(item.href));
}

function updateActiveLocation() {
  isScrolled.value = window.scrollY > 24;
  currentPath.value = normalizePath(window.location.pathname);
  if (currentPath.value !== '/') {
    activeSection.value = '';
    return;
  }

  const marker = window.innerHeight * 0.36;
  let currentSection = '';
  let nearestTop = -Infinity;
  for (const id of sectionIds) {
    const section = document.getElementById(id);
    const top = section?.getBoundingClientRect().top;
    if (top !== undefined && top <= marker && top >= nearestTop) { currentSection = id; nearestTop = top; }
  }
  activeSection.value = currentSection;
}

function scheduleLocationUpdate() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    updateActiveLocation();
  });
}

function closeMenu() {
  isOpen.value = false;
  if (servicesMenu.value) servicesMenu.value.open = false;
}

function escape(event) {
  if (event.key !== 'Escape') return;
  const target = isOpen.value
    ? menuButton.value
    : servicesMenu.value?.open
      ? servicesMenu.value.querySelector('summary')
      : null;
  closeMenu();
  target?.focus();
}

function outside(event) {
  if (!header.value?.contains(event.target)) closeMenu();
}

onMounted(() => {
  updateActiveLocation();
  window.addEventListener('scroll', scheduleLocationUpdate, { passive: true });
  window.addEventListener('resize', scheduleLocationUpdate, { passive: true });
  window.addEventListener('hashchange', scheduleLocationUpdate);
  window.addEventListener('popstate', scheduleLocationUpdate);
  document.addEventListener('keydown', escape);
  document.addEventListener('pointerdown', outside);
});

onUnmounted(() => {
  window.removeEventListener('scroll', scheduleLocationUpdate);
  window.removeEventListener('resize', scheduleLocationUpdate);
  window.removeEventListener('hashchange', scheduleLocationUpdate);
  window.removeEventListener('popstate', scheduleLocationUpdate);
  document.removeEventListener('keydown', escape);
  document.removeEventListener('pointerdown', outside);
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
});
</script>

<template>
  <header ref="header" class="site-header" :class="{ 'is-menu-open': isOpen, 'is-scrolled': isScrolled }">
    <div class="nav-shell">
      <a href="/#inicio" class="brand-link" aria-label="Vogel Consultoría — inicio">
        <img :src="logoVogel" alt="" width="44" height="44" />
        <span>VOGEL<span>CONSULTORÍA</span></span>
      </a>

      <nav aria-label="Navegación principal" class="desktop-nav">
        <details ref="servicesMenu" class="services-menu" :class="{ 'is-current': isServicesActive() }">
          <summary
            class="nav-link service-trigger"
            :aria-current="isServicesActive() ? (currentPath === '/' ? 'location' : 'page') : undefined"
          >
            <span class="nav-icon" v-html="servicesIcon" aria-hidden="true"></span>
            <span>{{ servicesLabel }}</span>
            <span class="nav-icon nav-chevron" v-html="chevronIcon" aria-hidden="true"></span>
          </summary>
          <div class="services-dropdown" aria-label="Servicios">
            <a
              href="/#servicios"
              :aria-current="isSectionActive('servicios') ? 'location' : undefined"
              @click="closeMenu"
            >
              <span class="nav-icon" v-html="servicesIcon" aria-hidden="true"></span>
              <span>Ver todos los servicios</span>
            </a>
            <a
              v-for="item in serviceLinks"
              :key="item.href"
              :href="item.href"
              :aria-current="isRouteActive(item.href) ? 'page' : undefined"
              :class="{ 'is-current': isRouteActive(item.href) }"
              :data-analytics-cta="item.analyticsCta"
              data-analytics-funnel="lead_journey"
              data-analytics-step="home"
              @click="closeMenu"
            >{{ item.label }}</a>
            <a href="/#charla-ia-2026" @click="closeMenu">Capacitaciones</a>
            <a
              href="https://portal.vogelconsultoria.com.ar/encuesta-contadores-ia"
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-cta="navbar_accountants_ai_survey_desktop"
            >Encuesta IA para contadores</a>
          </div>
        </details>

        <a
          v-for="item in links"
          :key="item.href"
          :href="item.href"
          class="nav-link"
          :class="{ 'is-current': isNavItemActive(item) }"
          :aria-current="ariaCurrentFor(item)"
        >
          <span class="nav-icon" v-html="item.icon" aria-hidden="true"></span>
          <span>{{ item.label }}</span>
        </a>
      </nav>

      <div class="nav-actions">
        <a
          class="portal-link nav-link"
          href="https://portal.vogelconsultoria.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-cta="navbar_portal_access_desktop"
        >
          <span class="nav-icon" v-html="portalIcon" aria-hidden="true"></span>
          <span>Ingresar al portal</span>
        </a>
        <a href="/#contacto" class="action-button action-primary nav-cta" data-analytics-cta="navbar_schedule_desktop">
          <span class="nav-icon" v-html="diagnosticIcon" aria-hidden="true"></span>
          <span>{{ ctaLabel }}</span>
        </a>
        <button
          ref="menuButton"
          type="button"
          class="menu-toggle"
          :aria-expanded="isOpen"
          aria-controls="mobile-navigation"
          :aria-label="isOpen ? 'Cerrar menú' : 'Abrir menú'"
          @click="isOpen = !isOpen"
        >
          <span v-if="!isOpen" class="nav-icon menu-toggle-icon" v-html="menuIcon" aria-hidden="true"></span>
          <svg v-else class="menu-close-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
            <path d="m6 6 12 12M6 18 18 6" />
          </svg>
        </button>
      </div>
    </div>

    <nav v-if="isOpen" id="mobile-navigation" class="mobile-nav" aria-label="Navegación móvil">
      <a
        href="/#servicios"
        class="mobile-nav-link nav-link"
        :class="{ 'is-current': isSectionActive('servicios') }"
        :aria-current="isSectionActive('servicios') ? 'location' : undefined"
        @click="closeMenu"
      >
        <span class="nav-icon" v-html="servicesIcon" aria-hidden="true"></span>
        <span>{{ servicesLabel }}</span>
      </a>
      <a
        v-for="item in links"
        :key="item.href"
        :href="item.href"
        class="mobile-nav-link nav-link"
        :class="{ 'is-current': isNavItemActive(item) }"
        :aria-current="ariaCurrentFor(item)"
        :data-analytics-cta="item.analyticsCta"
        data-analytics-funnel="lead_journey"
        data-analytics-step="home"
        @click="closeMenu"
      >
        <span class="nav-icon" v-html="item.icon" aria-hidden="true"></span>
        <span>{{ item.label }}</span>
      </a>
      <details class="mobile-service-menu" :class="{ 'is-current': isServicesActive() }">
        <summary class="mobile-nav-link nav-link">
          <span class="nav-icon" v-html="servicesIcon" aria-hidden="true"></span>
          <span>Explorar servicios</span>
          <span class="nav-icon nav-chevron" v-html="chevronIcon" aria-hidden="true"></span>
        </summary>
        <a
          v-for="item in serviceLinks"
          :key="item.href"
          :href="item.href"
          :aria-current="isRouteActive(item.href) ? 'page' : undefined"
          :class="{ 'is-current': isRouteActive(item.href) }"
          :data-analytics-cta="item.analyticsCta"
          data-analytics-funnel="lead_journey"
          data-analytics-step="home"
          @click="closeMenu"
        >{{ item.label }}</a>
      </details>
      <a href="/#charla-ia-2026" class="mobile-nav-link nav-link" @click="closeMenu">
        <span>Capacitaciones</span>
      </a>
      <a
        href="https://portal.vogelconsultoria.com.ar/encuesta-contadores-ia"
        target="_blank"
        rel="noopener noreferrer"
        class="mobile-nav-link nav-link"
        data-analytics-cta="navbar_accountants_ai_survey_mobile"
      >Encuesta IA para contadores</a>
      <a
        href="https://portal.vogelconsultoria.com.ar"
        target="_blank"
        rel="noopener noreferrer"
        class="mobile-nav-link nav-link"
        data-analytics-cta="navbar_portal_access_mobile"
      >
        <span class="nav-icon" v-html="portalIcon" aria-hidden="true"></span>
        <span>Ingresar al portal</span>
      </a>
      <a class="action-button action-primary nav-cta" data-analytics-cta="navbar_schedule_mobile" href="/#contacto" @click="closeMenu">
        <span class="nav-icon" v-html="diagnosticIcon" aria-hidden="true"></span>
        <span>{{ ctaLabel }}</span>
      </a>
    </nav>
  </header>
</template>


<style scoped>
.site-header{position:fixed;inset:0 0 auto;z-index:60;background:transparent;transition:background-color 240ms ease-out,border-color 240ms ease-out;border-bottom:1px solid transparent;color:var(--color-text)}
.site-header.is-scrolled,.site-header.is-menu-open{background:rgb(var(--vogel-navy)/.97);border-color:var(--color-border)}
.nav-shell{max-width:1520px;width:90%;margin:auto;min-height:94px;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:24px}
.is-scrolled .nav-shell{min-height:76px}
.brand-link{display:flex;align-items:center;justify-self:start;gap:16px;flex-shrink:0}
.brand-link>img{width:38px;height:38px}
.brand-link>span{font-size:24px;font-weight:500;letter-spacing:.2em;color:#fff;line-height:1.1}
.brand-link>span>span{display:block;font-size:9px;letter-spacing:.47em;font-weight:400;margin-top:7px}
.desktop-nav{display:flex;align-items:center;gap:32px}
.nav-link{display:inline-flex;align-items:center;gap:8px;min-height:44px;font-size:13px;color:var(--color-text);transition:color 180ms ease-out}
.nav-link:hover,.nav-link:focus-visible,.nav-link.is-current,.services-menu.is-current>summary{color:var(--color-action)}
.nav-link:active{transform:translateY(1px)}
.desktop-nav .nav-icon,.portal-link .nav-icon,.nav-cta .nav-icon{display:none}
.desktop-nav .nav-chevron{display:inline-flex;width:12px;height:12px}
.nav-icon{display:inline-flex;width:18px;height:18px;flex-shrink:0;color:currentColor}
.nav-icon :deep(svg){width:100%;height:100%}
.nav-icon :deep(svg *){stroke:currentColor}
.nav-actions{display:flex;align-items:center;justify-self:end;gap:24px}
.portal-link{border-right:1px solid var(--color-border);padding-right:24px;white-space:nowrap}
.nav-cta{min-height:44px;padding:12px 20px;font-size:13px;white-space:nowrap;gap:18px}
.nav-cta::after{content:'';width:18px;height:18px;background:currentColor;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4 12h15m-6-6 6 6-6 6' fill='none' stroke='black' stroke-width='1.5'/%3E%3C/svg%3E") center/contain no-repeat}
.services-menu{position:relative}
.service-trigger{cursor:pointer;list-style:none}
.service-trigger::-webkit-details-marker{display:none}
.services-dropdown{position:absolute;top:calc(100% + 14px);left:-24px;width:300px;background:var(--color-panel);padding:14px;border:1px solid var(--color-border);border-radius:10px;box-shadow:0 16px 40px rgb(0 0 0/.25)}
.services-dropdown a{display:flex;align-items:center;gap:8px;padding:10px 12px;min-height:44px;font-size:14px;line-height:1.4;border-radius:6px}
.services-dropdown a:hover,.services-dropdown a.is-current{background:rgb(var(--vogel-amber)/.08);color:var(--color-action)}
.menu-toggle{display:none;width:44px;height:44px;align-items:center;justify-content:center;border:1px solid var(--color-border);border-radius:8px}
.mobile-nav{background:var(--color-panel);max-height:calc(100svh - 80px);overflow:auto;padding:16px 5% 28px;border-top:1px solid var(--color-border)}
.mobile-nav-link{display:flex;gap:14px;padding:10px 6px;font-size:16px}
.mobile-nav .nav-cta{display:flex;margin-top:14px}
.mobile-service-menu summary{list-style:none;cursor:pointer}
.mobile-service-menu summary::-webkit-details-marker{display:none}
.mobile-service-menu>a{display:block;min-height:44px;padding:10px 0 10px 38px;font-size:14px}
.mobile-service-menu>a:hover,.mobile-service-menu>a.is-current{color:var(--color-action)}
@media(max-width:1199px){.nav-shell{gap:24px}.desktop-nav{gap:22px}.brand-link{gap:10px}.brand-link>span{font-size:21px}.nav-actions{gap:16px}.portal-link{padding-right:16px}.nav-cta{padding-inline:16px;font-size:12px}}
@media(min-width:1024px) and (max-width:1100px){.nav-actions{gap:12px}.portal-link{padding-right:12px}.nav-cta{padding-inline:12px;font-size:11px;gap:12px}}
@media(max-width:1023px){.desktop-nav,.portal-link{display:none}.menu-toggle{display:flex}.nav-shell{grid-template-columns:1fr auto;width:calc(100% - 40px);min-height:80px;gap:20px}.brand-link>span{font-size:22px}}
@media(max-width:639px){.nav-shell{width:calc(100% - 32px);min-height:80px;gap:12px}.brand-link>img{width:32px;height:32px}.brand-link>span{font-size:20px}.brand-link>span>span{font-size:8px;letter-spacing:.35em}.nav-actions>.nav-cta{display:none}.is-scrolled .nav-shell{min-height:72px}}
</style>
