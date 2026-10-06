<script setup>
defineProps({ kind: { type: String, default: 'hero' } });
const modules = [0, 1, 2, 3, 4, 5];
</script>
<template>
  <svg v-if="kind === 'hero'" class="home-data-scene home-hero-art" viewBox="0 0 720 600" fill="none" aria-hidden="true">
    <path d="M24 516H696" class="home-scene-base" />
    <g class="home-scattered-records">
      <g transform="translate(28 134) rotate(-9)"><rect width="154" height="92" rx="5" class="home-scene-mass"/><path d="M24 27h98M24 47h72M24 67h88" class="home-scene-detail"/></g>
      <g transform="translate(62 274) rotate(7)"><rect width="154" height="92" rx="5" class="home-scene-mass"/><path d="M24 27h98M24 47h72M24 67h88" class="home-scene-detail"/></g>
      <g transform="translate(24 420) rotate(-4)"><rect width="154" height="68" rx="5" class="home-scene-mass"/><path d="M24 25h98M24 45h72" class="home-scene-detail"/></g>
    </g>
    <path class="home-scene-connection" pathLength="1" d="M182 170h38q34 0 34 34v110h42M210 320h86M178 446h42q34 0 34-34v-98"/>
    <g class="home-connected-records">
      <rect x="296" y="190" width="188" height="262" rx="6" class="home-scene-mass home-scene-mass--central"/>
      <path d="M296 245h188M296 314h188M296 383h188" class="home-scene-detail"/>
      <path d="M323 219h103M323 276h87M323 292h120M323 345h87M323 361h120M323 414h87M323 430h120" class="home-scene-detail"/>
    </g>
    <path class="home-scene-connection" pathLength="1" d="M484 314h70q20 0 20-20v-63h24M574 294v110h24"/>
    <g class="home-decision-record">
      <rect x="598" y="183" width="98" height="97" rx="6" class="home-scene-mass"/>
      <path d="m621 234 15 15 36-38" class="home-scene-active"/>
      <rect x="598" y="358" width="98" height="94" rx="6" class="home-scene-mass"/>
      <path d="M620 385h54M620 404h36M620 423h45" class="home-scene-detail"/>
    </g>
    <text x="24" y="566" class="home-scene-label">Datos</text><text x="296" y="566" class="home-scene-label">Procesos</text><text x="598" y="566" class="home-scene-label">Decisión</text>
  </svg>
  <svg v-else-if="kind === 'order'" class="home-data-scene home-order-art" viewBox="0 0 660 440" fill="none" aria-hidden="true">
    <rect x="24" y="24" width="612" height="392" rx="6" class="home-scene-mass"/>
    <path d="M24 92h612M194 92v324" class="home-scene-detail"/>
    <text x="52" y="66" class="home-scene-label">Un registro compartido</text>
    <path d="M52 133h102M52 171h77M52 209h87M52 247h62" class="home-scene-detail"/>
    <g v-for="index in modules" :key="index" class="home-order-module" :transform="`translate(${222 + index % 2 * 200} ${122 + Math.floor(index / 2) * 92})`">
      <rect width="174" height="66" rx="4" class="home-scene-module"/><path d="M18 22h119M18 43h82" class="home-scene-detail"/>
    </g>
  </svg>
  <svg v-else class="home-data-scene home-connect-art" viewBox="0 0 1100 340" fill="none" aria-hidden="true">
    <path class="home-scene-connection" pathLength="1" d="M155 77h145q30 0 30 30v63h145M155 263h145q30 0 30-30v-63M945 77H800q-30 0-30 30v63H625M945 263H800q-30 0-30-30v-63"/>
    <rect x="16" y="32" width="240" height="90" rx="5" class="home-scene-mass"/><rect x="16" y="218" width="240" height="90" rx="5" class="home-scene-mass"/>
    <rect x="844" y="32" width="240" height="90" rx="5" class="home-scene-mass"/><rect x="844" y="218" width="240" height="90" rx="5" class="home-scene-mass"/>
    <rect x="475" y="116" width="150" height="108" rx="5" class="home-scene-mass home-scene-mass--central"/>
    <text x="136" y="83" text-anchor="middle" class="home-scene-label">Operaciones</text><text x="136" y="269" text-anchor="middle" class="home-scene-label">Clientes</text>
    <text x="964" y="83" text-anchor="middle" class="home-scene-label">Administración</text><text x="964" y="269" text-anchor="middle" class="home-scene-label">Canales</text>
    <path d="M509 149h82M509 171h82M509 193h52" class="home-scene-detail"/>
  </svg>
</template>
