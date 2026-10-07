<script setup>
import ClientProof from './ClientProof.vue';
import HomeEvidence from './HomeEvidence.vue';
import LandscapeTraces from './LandscapeTraces.vue';
</script>
<template><section class="home-section evidence-section" aria-labelledby="proof-title"><LandscapeTraces variant="network"/><div class="section-shell"><div class="section-introduction"><h2 id="proof-title" class="section-title">Tecnología puesta<br>a trabajar.</h2><p class="section-description">Proyectos web para empresas y organizaciones, y sistemas construidos alrededor de su operación.</p></div></div><ClientProof/><div class="section-shell"><HomeEvidence kind="projects"/></div></section></template>
