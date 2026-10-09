<script setup>
import { computed } from 'vue';
import SolutionsDestination from './destinations/SolutionsDestination.vue';
import ResourcesDestination from './destinations/ResourcesDestination.vue';
import StudioDestination from './destinations/StudioDestination.vue';
import ContactDestination from './destinations/ContactDestination.vue';

const props = defineProps({ page: { type: String, required: true } });
const destinations = {
  solutions: SolutionsDestination,
  resources: ResourcesDestination,
  studio: StudioDestination,
  contact: ContactDestination,
};
const currentPage = computed(() => destinations[props.page] || StudioDestination);
</script>

<template>
  <component :is="currentPage" />
</template>

<style>
.portfolio-destination {
  min-height: 100svh;
  padding: clamp(124px, 15vh, 172px) clamp(24px, 5vw, 88px) clamp(88px, 11vh, 128px) max(calc(var(--portfolio-edge) + 48px), 38vw);
  color: var(--color-heading);
  background: transparent; /* the page backdrop (StageBackdrop) shows through */
  overflow-x: clip; /* entrance animations translate blocks sideways; never let them widen the page */
  --color-muted: rgb(192 189 173); /* one step lighter than the token: it must hold 4.5:1 over the amber backdrop */
}
.destination-inner { width: min(100%, 1040px); margin-inline: auto; }
.destination-header { max-width: 820px; margin-bottom: clamp(56px, 9vh, 104px); }
.destination-header h1 {
  max-width: 14ch;
  margin: 0;
  color: var(--color-heading);
  font-family: var(--font-display);
  font-size: clamp(42px, 5.5vw, 80px);
  font-weight: 800;
  font-stretch: 125%;
  line-height: .94;
  letter-spacing: -.035em;
  text-wrap: balance;
}
.portfolio-destination [tabindex="-1"]:focus { outline: none; }
.destination-header p { max-width: 62ch; margin: 24px 0 0; color: var(--color-text); font-size: clamp(16px, 1.35vw, 19px); line-height: 1.65; }
.destination-section { margin-top: clamp(56px, 9vh, 104px); scroll-margin-top: 104px; }
.destination-section > h2 { margin: 0 0 26px; color: var(--color-muted); font-size: 12px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; }
.destination-service-list, .destination-resource-list, .destination-method-list { margin: 0; padding: 0; list-style: none; }
.destination-service-item, .destination-resource-item { border-top: 1px solid var(--color-border); }
.destination-service-item:last-child, .destination-resource-item:last-child { border-bottom: 1px solid var(--color-border); }
.destination-service-link { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 18px; align-items: center; min-height: 104px; padding: 20px 0; }
.destination-service-link h2, .destination-resource-link h2 { margin: 0; color: var(--color-heading); font-family: var(--font-display); font-size: clamp(22px, 2.4vw, 34px); font-weight: 700; line-height: 1.1; letter-spacing: -.02em; }
.destination-service-link p { margin: 8px 0 0; color: var(--color-muted); font-size: 15px; line-height: 1.55; }
.destination-service-link > span { color: var(--color-action); font-size: 24px; transition: transform 180ms ease; }
.destination-service-link:hover > span, .destination-service-link:focus-visible > span { transform: translateX(5px); }
.destination-secondary-links { display: flex; flex-wrap: wrap; gap: 0 28px; border-top: 1px solid var(--color-border); }
.destination-secondary-links a { display: inline-flex; align-items: center; min-height: 52px; color: var(--color-text); text-underline-offset: .28em; }
.destination-secondary-links a:hover { color: var(--color-action); }
.destination-resource-item { padding: 24px 0; }
.destination-resource-meta { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-bottom: 12px; color: var(--color-muted); font-size: 12px; }
.destination-resource-link { display: grid; grid-template-columns: minmax(0, 1fr) 28px; gap: 20px; align-items: start; }
.destination-resource-link h2 { max-width: 26ch; }
.destination-resource-link p { max-width: 64ch; margin: 10px 0 14px; color: var(--color-muted); line-height: 1.65; }
.destination-resource-arrow { color: var(--color-action); font-size: 22px; }
.destination-text-link { display: inline-flex; align-items: center; min-height: 44px; color: var(--color-heading); text-decoration: underline; text-decoration-color: var(--color-action); text-underline-offset: .3em; }
.destination-text-link:hover { color: var(--color-action); }
.destination-method-list { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); }
.destination-method-list li { min-width: 0; padding: 20px 16px 22px 0; }
.destination-method-list li + li { padding-left: 16px; border-left: 1px solid var(--color-border); }
.destination-method-list h3 { margin: 0 0 10px; color: var(--color-heading); font-size: 17px; font-weight: 600; }
.destination-method-list p { margin: 0; color: var(--color-muted); font-size: 14px; line-height: 1.55; }
.destination-person { display: block; }
.destination-person h2 { margin: 0 0 8px; color: var(--color-heading); font-size: clamp(22px, 2.4vw, 32px); }
.destination-person p { max-width: 52ch; margin: 0 0 18px; color: var(--color-muted); line-height: 1.7; }
.destination-status { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 14px 24px; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 22px 0; }
.destination-status h3 { margin: 0; color: var(--color-heading); font-size: 20px; }
.destination-status p { max-width: 54ch; margin: 0; color: var(--color-muted); line-height: 1.6; }
.destination-contact-layout { display: grid; grid-template-columns: minmax(220px, .72fr) minmax(0, 1.28fr); gap: clamp(36px, 6vw, 88px); align-items: start; }
.destination-contact-methods { display: grid; gap: 12px; }
.destination-contact-methods a { display: inline-flex; align-items: center; min-height: 44px; width: fit-content; color: var(--color-heading); text-underline-offset: .25em; }
.destination-contact-methods a:hover { color: var(--color-action); }
.destination-form { display: grid; gap: 8px; }
.destination-form label { margin-top: 10px; color: var(--color-muted); font-size: 13px; }
.destination-form label span { opacity: .8; }
.destination-form input, .destination-form textarea { width: 100%; min-height: 48px; padding: 12px 14px; border: 1px solid var(--color-border); border-radius: 6px; background: var(--color-surface); color: var(--color-heading); font: inherit; }
.destination-form textarea { min-height: 128px; resize: vertical; }
.destination-form :is(input, textarea):focus-visible { outline: 2px solid var(--color-action); outline-offset: 2px; }
.destination-submit { width: fit-content; min-height: 48px; margin-top: 16px; padding: 0 22px; border-radius: 6px; background: var(--color-action); color: var(--color-action-text); font-weight: 600; }
.destination-submit:disabled { opacity: .65; cursor: wait; }
.destination-form-error { margin: 8px 0 0; color: var(--color-error); }
.destination-form-success { margin-top: 12px; padding: 18px 0; border-top: 1px solid var(--color-border); }
.destination-form-success h2 { margin: 0 0 8px; color: var(--color-heading); font-size: 22px; }
.destination-form-success p { color: var(--color-text); }
.destination-contact-note { margin: 22px 0 0; color: var(--color-muted); font-size: 13px; line-height: 1.65; }
@media (max-width: 900px) and (min-width: 768px) {
  .portfolio-destination { padding-left: max(calc(var(--portfolio-edge) + 30px), 36vw); padding-right: 28px; }
  .destination-method-list { grid-template-columns: 1fr; }
  .destination-method-list li, .destination-method-list li + li { display: grid; grid-template-columns: minmax(0, 150px) minmax(0, 1fr); gap: 20px; align-items: baseline; padding: 18px 0; border-left: 0; }
  .destination-method-list li + li { border-top: 1px solid var(--color-border); }
  .destination-method-list h3 { margin: 0; }
}
@media (max-width: 767px) {
  .portfolio-destination { min-height: 100svh; padding: 104px 20px 72px; }
  .destination-header { margin-bottom: 58px; }
  .destination-header h1 { max-width: none; font-size: min(60px, calc((100vw - 40px) / 8.8)); overflow-wrap: normal; }
  .destination-header p { margin-top: 18px; font-size: 16px; }
  .destination-section { margin-top: 58px; }
  .destination-service-link { min-height: 88px; gap: 12px; }
  .destination-service-link h2, .destination-resource-link h2 { font-size: clamp(21px, 6vw, 28px); }
  .destination-service-link p, .destination-resource-link p { font-size: 14px; }
  .destination-method-list { grid-template-columns: 1fr; }
  .destination-method-list li, .destination-method-list li + li { padding: 16px 0; border-left: 0; }
  .destination-method-list li + li { border-top: 1px solid var(--color-border); }
  .destination-person h2 { font-size: 20px; }
  .destination-person p { font-size: 14px; }
  .destination-contact-layout { grid-template-columns: 1fr; gap: 30px; }
  .destination-contact-methods { grid-template-columns: 1fr; }
}
@media (max-width: 380px) {
  .portfolio-destination { padding-inline: 16px; }
  .destination-header h1 { font-size: calc((100vw - 32px) / 8.8); }
}
/* Studio: Oscar as a cut-out. Fixed to the right edge on wide screens (the body leaves the frame at the bottom,
   as in the photo); in the flow under the headline on tablet and phone, fading into the backdrop. */
.studio-portrait { margin: 0; pointer-events: none; }
.studio-portrait img { display: block; width: 100%; height: auto; }
@media (max-width: 1099px) {
  .studio-portrait { width: min(72vw, 380px); margin: -12px calc(-1 * clamp(24px, 5vw, 88px)) 44px auto; -webkit-mask-image: linear-gradient(#000 78%, transparent); mask-image: linear-gradient(#000 78%, transparent); }
}
@media (max-width: 900px) and (min-width: 768px) { .studio-portrait { margin-right: -28px; } }
@media (max-width: 767px) { .studio-portrait { width: min(84vw, 340px); margin-right: -20px; margin-bottom: 36px; } }
@media (max-width: 380px) { .studio-portrait { margin-right: -16px; } }
@media (min-width: 1100px) {
  [data-destination="studio"] { --fig-h: min(88vh, 980px); --fig-w: calc(var(--fig-h) * .593); padding-right: calc(var(--fig-w) * .84 + 24px); }
  /* No container-type/contain/transform here: any of them would turn this box into the containing block of the fixed portrait. */
  [data-destination="studio"] .destination-inner { position: relative; z-index: 2; width: 100%; }
  [data-destination="studio"] { --col: calc(100vw - max(calc(var(--portfolio-edge) + 48px), 38vw) - (var(--fig-w) * .84 + 24px)); }
  [data-destination="studio"] .destination-header h1 { max-width: none; font-size: min(80px, calc(var(--col) / 9.4)); overflow-wrap: normal; }
  [data-destination="studio"] .destination-method-list { grid-template-columns: 1fr; }
  [data-destination="studio"] .destination-method-list li, [data-destination="studio"] .destination-method-list li + li { display: grid; grid-template-columns: minmax(0, 150px) minmax(0, 1fr); gap: 20px; align-items: baseline; padding: 18px 0; border-left: 0; }
  [data-destination="studio"] .destination-method-list li + li { border-top: 1px solid var(--color-border); }
  [data-destination="studio"] .destination-method-list h3 { margin: 0; }
  /* z-index -1 keeps the figure behind the text of the same stacking context (the inner container). */
  .studio-portrait { position: fixed; right: -64px; bottom: 0; z-index: -1; width: var(--fig-w); height: var(--fig-h); margin: 0; }
  .studio-portrait img { height: 100%; object-fit: contain; object-position: right bottom; }
}
</style>
