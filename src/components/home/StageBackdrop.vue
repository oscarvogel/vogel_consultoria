<script setup>
// Portfolio backdrop: company colour rising from the bottom into charcoal, a slow wave and a light grain.
// Pure CSS (no per-frame JS). The colour interpolates through the registered --accent property.
// `soft` lowers the colour mix on text-heavy pages (destinations) so muted copy keeps its contrast.
defineProps({ accent: { type: String, default: '#161515' }, active: Boolean, soft: Boolean });
</script>
<template>
  <div class="stage-backdrop" :class="{ 'is-idle': !active, 'is-soft': soft }" :style="{ '--accent': accent }" aria-hidden="true">
    <div class="backdrop-swell"><div class="backdrop-wave backdrop-wave--back"></div></div>
    <div class="backdrop-swell backdrop-swell--front"><div class="backdrop-wave"></div></div>
    <div class="backdrop-grain"></div>
  </div>
</template>
<style>
@property --accent { syntax: '<color>'; inherits: true; initial-value: #161515; }
.stage-backdrop {
  position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none;
  background: linear-gradient(to top, color-mix(in srgb, var(--accent) 62%, #161515) 0%, color-mix(in srgb, var(--accent) 30%, #161515) 34%, #161515 70%);
  transition: --accent 900ms cubic-bezier(.22, 1, .36, 1);
}
/* The swell breathes vertically; the wave inside it flows sideways. One tile = one viewport, so the loop is seamless. */
.backdrop-swell { position: absolute; inset: auto 0 0; height: 44%; transform-origin: bottom; animation: backdrop-breathe 11s ease-in-out infinite alternate; }
.backdrop-swell--front { height: 34%; animation-duration: 8s; animation-direction: alternate-reverse; }
.backdrop-wave {
  position: absolute; inset: 0 -100%; opacity: .5;
  background: linear-gradient(to top, var(--accent), transparent 90%);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200' preserveAspectRatio='none'%3E%3Cpath d='M0 60 C150 60 150 20 300 20 S450 60 600 60 S750 100 900 100 S1050 60 1200 60 V200 H0Z'/%3E%3C/svg%3E") 0 0 / 33.3334% 100% repeat-x;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200' preserveAspectRatio='none'%3E%3Cpath d='M0 60 C150 60 150 20 300 20 S450 60 600 60 S750 100 900 100 S1050 60 1200 60 V200 H0Z'/%3E%3C/svg%3E") 0 0 / 33.3334% 100% repeat-x;
  animation: backdrop-flow 26s linear infinite;
}
.backdrop-wave--back { opacity: .32; animation-duration: 38s; animation-direction: reverse; }
.backdrop-grain {
  position: absolute; inset: 0; opacity: .07;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.stage-backdrop.is-soft { background: linear-gradient(to top, color-mix(in srgb, var(--accent) 44%, #161515) 0%, color-mix(in srgb, var(--accent) 18%, #161515) 30%, #161515 62%); }
.stage-backdrop.is-soft .backdrop-wave { opacity: .2; }
.stage-backdrop.is-soft .backdrop-wave--back { opacity: .12; }
.stage-backdrop.is-idle .backdrop-swell, .stage-backdrop.is-idle .backdrop-wave { animation-play-state: paused; }
@keyframes backdrop-flow { to { transform: translateX(33.3334%); } }
@keyframes backdrop-breathe { from { transform: scaleY(.88); } to { transform: scaleY(1.08); } }
@media (prefers-reduced-motion: reduce) {
  .stage-backdrop { transition-duration: 150ms; }
  .backdrop-swell, .backdrop-wave { animation: none; }
}
</style>
