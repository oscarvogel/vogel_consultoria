<script setup>
import diagnosticIcon from '../assets/vogel-navbar-svg-icons/agendar-diagnostico.svg?raw';
import LandscapeTraces from './LandscapeTraces.vue';
import designIcon from '../assets/vogel-navbar-svg-icons/servicios.svg?raw';
import implementationIcon from '../assets/vogel-navbar-svg-icons/como-trabajamos.svg?raw';
import resultsIcon from '../assets/vogel-navbar-svg-icons/casos.svg?raw';
const steps=[
 {label:'Diagnóstico',icon:diagnosticIcon,description:'Entendemos tu operación y priorizamos las fricciones que vale la pena resolver.'},
 {label:'Diseño',icon:designIcon,description:'Definimos el alcance, el circuito y la solución antes de construir.'},
 {label:'Implementación',icon:implementationIcon,description:'Desarrollamos e integramos por etapas, con tu equipo y feedback continuo.'},
 {label:'Resultados',icon:resultsIcon,description:'Medimos, ajustamos y acompañamos la mejora de la operación.'}
];
</script>
<template>
 <section id="metodologia" class="home-section home-process" data-home-chapter="methodology" aria-labelledby="proceso-heading">
  <LandscapeTraces variant="method" />
  <div class="section-shell">
   <div class="section-introduction"><h2 id="proceso-heading" class="section-title">Un proceso claro.<br>De principio a resultados.</h2><a class="text-link" href="#contacto">Empezar con un diagnóstico</a></div>
   <div class="home-method" data-home-moment="methodology">
    <div class="home-method-line" aria-hidden="true"><span></span></div>
    <ol><li v-for="(step,index) in steps" :key="step.label"><div class="home-method-marker"><span aria-hidden="true" v-html="step.icon"></span><span>{{ String(index+1).padStart(2,'0') }}</span></div><h3>{{ step.label }}</h3><p>{{ step.description }}</p></li></ol>
   </div>
  </div>
 </section>
</template>
