<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import logoVogel from '../assets/brand/logo-vogel-generated.webp';
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
const sectionIds = ['servicios', 'casos', 'metodologia', 'nosotros'];
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

const links = [
  { label: 'Casos', href: '/#casos', section: 'casos', icon: casesIcon },
  { label: 'Cómo trabajamos', href: '/#metodologia', section: 'metodologia', icon: methodologyIcon },
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
  currentPath.value = normalizePath(window.location.pathname);
  if (currentPath.value !== '/') {
    activeSection.value = '';
    return;
  }

  const marker = window.innerHeight * 0.36;
  let currentSection = '';
  for (const id of sectionIds) {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top <= marker) currentSection = id;
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
  <header ref="header" class="site-header" :class="{ 'is-menu-open': isOpen }">
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
            <span>Servicios</span>
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
          <span>Agendar diagnóstico</span>
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
        <span>Servicios</span>
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
        <span>Agendar diagnóstico</span>
      </a>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  --nav-ink: rgb(var(--vogel-navy));
  --nav-icon: rgb(var(--vogel-navy));
  --nav-text-shadow: 0 1px 2px rgb(var(--vogel-white) / .2);
  position: sticky;
  top: 16px;
  z-index: 60;
  isolation: isolate;
  width: calc(100% - 40px);
  max-width: 1440px;
  margin: 16px auto 0;
  border: 1px solid rgb(var(--vogel-blueLight) / .58);
  border-radius: 999px;
  background: transparent;
  box-shadow:
    0 12px 28px -20px rgb(var(--vogel-navy) / .4),
    inset 0 1px 0 rgb(var(--vogel-white) / .36),
    inset 0 -1px 0 rgb(var(--vogel-blueLight) / .18);
  -webkit-backdrop-filter: blur(.5px);
  backdrop-filter: blur(.5px);
}

.site-header::after {
  position: absolute;
  z-index: 0;
  inset: 1px;
  border: 1px solid rgb(var(--vogel-white) / .18);
  border-radius: inherit;
  content: '';
  pointer-events: none;
}

.nav-shell,
.mobile-nav {
  position: relative;
  z-index: 1;
}

.nav-shell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 12px 18px;
}

.brand-link {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
}

.brand-link img { object-fit: contain; }
.brand-link > span { color: var(--nav-ink); font-family: var(--font-display); font-size: 18px; font-weight: 700; letter-spacing: .04em; }
.brand-link span span { display: block; font-family: var(--font-body); font-size: 9px; letter-spacing: .22em; }

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  font-weight: 600;
}

.desktop-nav .nav-link,
.services-menu > summary,
.portal-link { text-shadow: var(--nav-text-shadow); }

.nav-link,
.services-menu > summary {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  border-radius: 8px;
  color: var(--nav-ink);
  text-decoration: none;
  transition: color 180ms ease-out, background-color 180ms ease-out, border-color 180ms ease-out;
}

.desktop-nav > .nav-link,
.services-menu > summary { padding: 0 4px; }

.nav-icon {
  display: inline-flex;
  flex: 0 0 18px;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: var(--nav-icon);
  transition: color 180ms ease-out, transform 160ms ease-out, filter 180ms ease-out;
}

.nav-icon :deep(svg) { display: block; width: 100%; height: 100%; }
.nav-chevron { width: 15px; height: 15px; flex-basis: 15px; }
.services-menu > summary { cursor: pointer; list-style: none; }
.services-menu > summary::-webkit-details-marker,
.mobile-service-menu > summary::-webkit-details-marker { display: none; }
.nav-chevron { transition: color 180ms ease-out, transform 180ms ease-out; }
.services-menu[open] .nav-chevron,
.mobile-service-menu[open] .nav-chevron { transform: rotate(180deg); }

.nav-link.is-current,
.services-menu.is-current > summary { color: var(--nav-ink); }

.nav-link.is-current .nav-icon,
.services-menu.is-current > summary .nav-icon {
  color: var(--nav-icon);
}

.desktop-nav > .nav-link::after,
.services-menu > summary::after {
  position: absolute;
  right: 4px;
  bottom: 1px;
  left: 4px;
  height: 2px;
  border-radius: 2px;
  background: var(--nav-icon);
  content: '';
  opacity: 0;
  transform: scaleX(.55);
  transform-origin: center;
  transition: opacity 180ms ease-out, transform 180ms ease-out;
}

.desktop-nav > .nav-link.is-current::after,
.services-menu.is-current > summary::after { opacity: 1; transform: scaleX(1); }

.services-menu { position: relative; }

.services-dropdown {
  position: absolute;
  top: calc(100% + 18px);
  left: -16px;
  display: grid;
  width: 300px;
  max-height: 65vh;
  overflow: auto;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-panel);
  box-shadow: var(--shadow-panel);
}

.services-dropdown a {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 10px 12px;
  border-radius: 6px;
  color: var(--color-text);
  font-size: 14px;
}

.services-dropdown a.is-current { color: var(--color-link); background: rgb(var(--vogel-blueLight) / .08); }
.services-dropdown a.is-current .nav-icon { color: var(--color-link); }

.nav-actions { display: flex; align-items: center; gap: 18px; }

.portal-link {
  color: var(--nav-ink);
  font-size: 12px;
  text-decoration: underline;
  text-underline-offset: .22em;
}

.nav-cta { gap: 8px; min-height: 44px; padding: 12px 16px; font-size: 12px; }
.nav-cta .nav-icon { color: var(--color-action-text); }

.menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border: 1px solid rgb(var(--vogel-blueLight) / .24);
  border-radius: 8px;
  background: rgb(var(--vogel-blueLight) / .045);
  color: var(--nav-ink);
  transition: border-color 180ms ease-out, background-color 180ms ease-out, color 180ms ease-out;
}

.menu-toggle-icon { flex-basis: 22px; width: 22px; height: 22px; }
.menu-close-icon { width: 22px; height: 22px; color: var(--nav-icon); }

.mobile-nav {
  display: grid;
  max-height: calc(100dvh - 110px);
  overflow: auto;
  padding: 12px 16px 16px;
  border-top: 1px solid rgb(var(--vogel-blueLight) / .18);
}

.mobile-nav-link,
.mobile-nav details > summary {
  width: 100%;
  padding: 12px 10px;
  font-size: 15px;
}

.mobile-nav-link.is-current,
.mobile-service-menu.is-current > summary { background: rgb(var(--vogel-blueLight) / .075); }
.mobile-nav details a { display: flex; align-items: center; min-height: 44px; padding: 10px 12px 10px 38px; border-radius: 6px; color: var(--color-text); font-size: 14px; }
.mobile-nav details a.is-current { color: var(--color-link); background: rgb(var(--vogel-blueLight) / .08); }
.mobile-service-menu > summary { cursor: pointer; list-style: none; }
.mobile-service-menu > summary .nav-chevron { margin-left: auto; }
.mobile-nav .nav-cta { justify-content: center; margin-top: 12px; }

@media (hover: hover) and (pointer: fine) {
  .nav-link:hover,
  .services-menu > summary:hover { color: var(--nav-ink); }

  .services-dropdown a:hover { color: var(--color-link); }

  .nav-link:hover .nav-icon,
  .services-menu > summary:hover .nav-icon,
  .services-dropdown a:hover .nav-icon { color: var(--nav-ink); transform: translateY(-1px); }

  .nav-link:hover .nav-icon,
  .services-menu > summary:hover .nav-icon { filter: none; }

  .nav-link:hover:not(.nav-cta),
  .services-menu > summary:hover { background-color: rgb(var(--vogel-blueLight) / .045); }

  .portal-link:hover { color: var(--nav-ink); }
  .services-dropdown a:hover,
  .services-dropdown a:focus-visible { background: var(--color-background); }
  .mobile-nav-link:hover { background-color: rgb(var(--vogel-blueLight) / .075); }
  .menu-toggle:hover { border-color: rgb(var(--vogel-blueLight) / .48); background: rgb(var(--vogel-blueLight) / .09); color: var(--color-link); }
  .menu-toggle:hover .nav-icon { color: var(--nav-ink); }
}

.nav-link:focus-visible .nav-icon,
.services-menu > summary:focus-visible .nav-icon,
.menu-toggle:focus-visible .nav-icon { color: var(--nav-icon); }

.nav-link:active .nav-icon,
.services-menu > summary:active .nav-icon,
.menu-toggle:active .nav-icon { color: var(--nav-ink); transform: translateY(1px) scale(.94); }

.services-dropdown { --nav-ink: rgb(var(--vogel-white)); --nav-icon: rgb(var(--vogel-blueLight)); }
.nav-cta:hover .nav-icon,.nav-cta:active .nav-icon { color: var(--color-action-text); }
.mobile-nav details a { color: var(--nav-ink); }

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .site-header { background: rgb(var(--vogel-navy) / .97); --nav-ink: rgb(var(--vogel-white)); --nav-icon: rgb(var(--vogel-blueLight)); }
}

@media (prefers-reduced-transparency: reduce) {
  .site-header { background: rgb(var(--vogel-navy) / .98); --nav-ink: rgb(var(--vogel-white)); --nav-icon: rgb(var(--vogel-blueLight)); -webkit-backdrop-filter: none; backdrop-filter: none; }
}

@media (max-width: 1199px) {
  .site-header.is-menu-open { border-radius: 20px; }
  .desktop-nav,
  .portal-link { display: none; }
  .menu-toggle { display: flex; }
}

@media (max-width: 599px) {
  .site-header { top: 8px; width: calc(100% - 24px); margin-top: 8px; }
  .nav-shell { gap: 8px; padding: 9px 12px; }
  .brand-link img { width: 36px; height: 36px; }
  .brand-link > span { font-size: 15px; }
  .nav-actions { gap: 8px; }
  .nav-cta { display: none; }
}
</style>
