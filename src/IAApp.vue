<template>
  <div class="relative overflow-x-hidden">
    <main>
      <HeroIA />
      <ProblemIA />
      <SolutionIA />
      <UseCasesIA />
      <ServicesIA />
      <ProcessIA />
      <OfferIA />
      <FAQIA />
      <CTAIA />
    </main>
    <WhatsAppButton />
  </div>
</template>

<script setup>
import { useScrollReveal } from "./composables/useScrollReveal.js";
import HeroIA from "./components/HeroIA.vue";
import ProblemIA from "./components/ProblemIA.vue";
import SolutionIA from "./components/SolutionIA.vue";
import UseCasesIA from "./components/UseCasesIA.vue";
import ServicesIA from "./components/ServicesIA.vue";
import ProcessIA from "./components/ProcessIA.vue";
import OfferIA from "./components/OfferIA.vue";
import FAQIA from "./components/FAQIA.vue";
import CTAIA from "./components/CTAIA.vue";
import WhatsAppButton from "./components/WhatsAppButton.vue";
useScrollReveal();
</script>
