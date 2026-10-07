<script setup>
import { methodSteps } from '../../data/method.js';
import '../../styles/editorial.css';
const inputs = [
  { label: 'PERSONAS', y: 56 }, { label: 'PROCESOS', y: 128 }, { label: 'DATOS', y: 200 }, { label: 'TECNOLOGÍA', y: 272 },
];
const curve = y => `M200 ${y} H300 C390 ${y} 420 164 500 164`;
</script>
<template>
  <section id="metodologia" class="ed-section ed-method" aria-labelledby="metodo-heading" data-ed-section>
    <div class="ed-shell">
      <header class="ed-head ed-head--split" data-ed-item>
        <div>
          <p class="ed-kicker">Método Vogel</p>
          <h2 id="metodo-heading" class="ed-title">Así trabajamos.</h2>
        </div>
        <p class="ed-lede">Un lenguaje de trabajo en cinco pasos: de entender cómo funciona la operación a mejorarla con información propia. No es una fórmula cerrada, es la forma en que ordenamos cada proyecto.</p>
      </header>

      <figure class="method-diagram" data-ed-method>
        <svg viewBox="0 0 1000 360" role="img" aria-labelledby="method-diagram-title method-diagram-desc" preserveAspectRatio="xMidYMid meet">
          <title id="method-diagram-title">Del trabajo cotidiano a la decisión</title>
          <desc id="method-diagram-desc">Personas, procesos, datos y tecnología convergen en un sistema que conduce a una decisión; los resultados se miden y vuelven a empezar el ciclo.</desc>
          <g class="m-lines" fill="none">
            <path v-for="input in inputs" :key="input.label" class="m-path m-path--in" :d="curve(input.y)" pathLength="1" />
            <path class="m-path m-path--rail" d="M40 56V272" pathLength="1" />
            <path class="m-path m-path--rail" d="M300 40V288" pathLength="1" />
            <path class="m-path m-path--main" d="M500 164H748" pathLength="1" />
            <path class="m-path m-path--loop" d="M772 164C880 164 944 176 944 236C944 322 840 330 500 330S200 326 200 298" pathLength="1" />
            <path class="m-arrow" d="M194 306 200 297 206 306" pathLength="1" />
          </g>
          <g class="m-inputs">
            <g v-for="input in inputs" :key="input.label" class="m-input">
              <text :x="184" :y="input.y + 4" text-anchor="end" class="m-label m-label--input">{{ input.label }}</text>
              <circle :cx="200" :cy="input.y" r="3.5" class="m-dot" />
            </g>
          </g>
          <g class="m-nodes">
            <g class="m-node" transform="translate(40 164)"><circle r="13" class="m-ring" /><text y="4" text-anchor="middle" class="m-num">01</text></g>
            <g class="m-node" transform="translate(300 164)"><circle r="13" class="m-ring" /><text y="4" text-anchor="middle" class="m-num">02</text></g>
            <g class="m-node" transform="translate(500 164)"><circle r="13" class="m-ring" /><text y="4" text-anchor="middle" class="m-num">03</text></g>
            <g class="m-node m-node--key" transform="translate(760 164)"><circle r="22" class="m-halo" /><circle r="13" class="m-ring m-ring--key" /><text y="4" text-anchor="middle" class="m-num m-num--key">04</text></g>
            <g class="m-node" transform="translate(500 330)"><circle r="13" class="m-ring" /><text y="4" text-anchor="middle" class="m-num">05</text></g>
          </g>
          <g class="m-labels">
            <text x="0" y="22" class="m-label m-label--step">OBSERVAR</text>
            <text x="300" y="22" text-anchor="middle" class="m-label m-label--step">ORDENAR</text>
            <text x="520" y="140" class="m-label m-label--step">CONECTAR</text>
            <text x="520" y="196" class="m-label m-label--noun">SISTEMA</text>
            <text x="760" y="124" text-anchor="middle" class="m-label m-label--step">DECIDIR</text>
            <text x="760" y="206" text-anchor="middle" class="m-label m-label--noun">DECISIÓN</text>
            <text x="500" y="358" text-anchor="middle" class="m-label m-label--step">MEJORAR</text>
          </g>
        </svg>
      </figure>

      <ol class="method-steps">
        <li v-for="step in methodSteps" :key="step.id" :id="'metodo-' + step.id" data-ed-item>
          <span class="method-num">{{ step.number }}</span>
          <h3>{{ step.label }}</h3>
          <p>{{ step.text }}</p>
          <p v-if="step.detail" class="method-detail">{{ step.detail }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
