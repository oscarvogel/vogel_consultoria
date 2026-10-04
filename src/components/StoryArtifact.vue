<script setup>
defineProps({ mode: { type: String, default: 'order' }, label: { type: String, default: '' } });
</script>

<template>
  <svg class="story-artifact" viewBox="0 0 600 440" fill="none" aria-hidden="true">
    <g v-if="mode === 'order'" class="artifact-geometry">
      <path d="M116 130 300 220 470 106M300 220 146 337M300 220 467 330" class="artifact-path artifact-path--pending"/>
      <g transform="translate(44 74) rotate(-6 72 42)"><rect width="150" height="90" rx="12" class="artifact-node"/><path d="M24 28h82M24 46h102M24 64h58" class="artifact-detail"/></g>
      <g transform="translate(399 56) rotate(6 72 42)"><rect width="150" height="90" rx="12" class="artifact-node"/><path d="M24 28h82M24 46h102M24 64h58" class="artifact-detail"/></g>
      <g transform="translate(60 291) rotate(4 72 42)"><rect width="150" height="90" rx="12" class="artifact-node"/><path d="M24 28h82M24 46h102M24 64h58" class="artifact-detail"/></g>
      <g transform="translate(401 286) rotate(-4 72 42)"><rect width="150" height="90" rx="12" class="artifact-node"/><path d="M24 28h82M24 46h102M24 64h58" class="artifact-detail"/></g>
      <rect x="254" y="173" width="92" height="94" rx="16" class="artifact-hub"/><path d="M277 205h46M277 222h46M277 239h26" class="artifact-detail"/>
    </g>
    <g v-else-if="mode === 'connect'" class="artifact-geometry">
      <path d="M151 118h72q24 0 24 24v54h54M448 118h-72q-24 0-24 24v54h-51M151 327h72q24 0 24-24v-60h54M448 327h-72q-24 0-24-24v-60h-51" class="artifact-path" pathLength="1"/>
      <rect x="42" y="72" width="160" height="92" rx="12" class="artifact-node"/><rect x="398" y="72" width="160" height="92" rx="12" class="artifact-node"/>
      <rect x="42" y="281" width="160" height="92" rx="12" class="artifact-node"/><rect x="398" y="281" width="160" height="92" rx="12" class="artifact-node"/>
      <rect x="248" y="162" width="104" height="112" rx="16" class="artifact-hub"/>
      <path d="M72 100h80M72 121h103M428 100h80M428 121h103M72 309h80M72 330h103M428 309h80M428 330h103M273 196h54M273 219h54M273 242h34" class="artifact-detail"/>
      <circle cx="300" cy="218" r="83" class="artifact-orbit"/>
    </g>
    <g v-else-if="mode === 'resolve'" class="artifact-geometry">
      <path d="M116 218h368" class="artifact-path" pathLength="1"/>
      <rect x="48" y="150" width="136" height="136" rx="20" class="artifact-node"/>
      <rect x="232" y="150" width="136" height="136" rx="20" class="artifact-hub"/>
      <rect x="416" y="150" width="136" height="136" rx="20" class="artifact-node"/>
      <path d="M80 193h72M80 218h72M80 243h44M264 193h72M264 218h72M264 243h44M448 193h72M448 218h72M448 243h44" class="artifact-detail"/>
      <circle cx="300" cy="114" r="5" class="artifact-dot"/>
    </g>
    <g v-else-if="mode === 'automate' || mode === 'assist'" class="artifact-geometry">
      <rect v-if="mode === 'assist'" x="16" y="22" width="568" height="360" rx="20" class="artifact-orbit" stroke-dasharray="5 7"/>
      <path d="M94 216h410M300 216v-80" class="artifact-path" pathLength="1"/>
      <rect x="32" y="172" width="120" height="88" rx="12" class="artifact-node"/><rect x="184" y="172" width="120" height="88" rx="12" class="artifact-hub"/>
      <rect x="338" y="172" width="120" height="88" rx="12" class="artifact-node"/><rect x="490" y="172" width="78" height="88" rx="12" class="artifact-node"/>
      <path d="M57 200h63M57 222h43M209 200h63M209 222h43M363 200h63M363 222h43m77-7 12 12 19-25" class="artifact-detail"/>
      <circle cx="300" cy="108" r="32" class="artifact-hub"/><path d="m285 108 10 10 21-22" class="artifact-check"/>
      <text x="300" y="51" text-anchor="middle" class="artifact-label">Control humano</text>
      <text x="92" y="302" text-anchor="middle" class="artifact-label">Entrada</text><text x="244" y="302" text-anchor="middle" class="artifact-label">Proceso</text><text x="398" y="302" text-anchor="middle" class="artifact-label">Revisión</text><text x="529" y="302" text-anchor="middle" class="artifact-label">Salida</text>
    </g>
    <g v-else class="artifact-geometry">
      <rect x="62" y="44" width="476" height="348" rx="18" class="artifact-node"/>
      <path d="M62 106h476M193 106v286" class="artifact-detail"/>
      <path d="M89 77h94M88 143h76M88 171h61M88 199h70M88 227h46M88 255h64" class="artifact-detail"/>
      <rect x="220" y="135" width="135" height="76" rx="8" class="artifact-hub"/><rect x="377" y="135" width="135" height="76" rx="8" class="artifact-node"/>
      <path d="M242 158h87M242 179h56M399 158h87M399 179h56" class="artifact-detail"/>
      <rect x="220" y="234" width="292" height="130" rx="8" class="artifact-node"/><path d="M244 263h155M244 285h239M244 307h210M244 329h227" class="artifact-detail"/>
      <circle cx="484" cy="76" r="5" class="artifact-dot"/>
    </g>
    <text v-if="label" x="300" y="430" text-anchor="middle" class="artifact-label">{{ label }}</text>
  </svg>
</template>

<style scoped>
.story-artifact{display:block;width:100%;height:auto;overflow:visible}.artifact-node{fill:rgb(var(--vogel-navy)/.94);stroke:rgb(var(--vogel-blueLight)/.5);stroke-width:1.4}.artifact-hub{fill:rgb(var(--vogel-slate));stroke:rgb(var(--vogel-blueLight));stroke-width:1.6}.artifact-path{stroke:rgb(var(--vogel-blueLight));stroke-width:2;stroke-linecap:round}.artifact-path--pending{stroke-dasharray:4 8;opacity:.5}.artifact-detail{stroke:rgb(var(--vogel-blueLight));stroke-width:2;stroke-linecap:round}.artifact-orbit{stroke:rgb(var(--vogel-blueLight)/.35);stroke-width:1}.artifact-check{stroke:rgb(var(--vogel-amber));stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.artifact-dot{fill:rgb(var(--vogel-amber))}.artifact-label{fill:rgb(var(--vogel-white));font:500 15px var(--font-body)}
</style>
