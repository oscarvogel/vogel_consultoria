<template>
  <div class="relative overflow-x-hidden">
    <a class="skip-link" href="#main-content-ia">Saltar al contenido principal</a>
    <main id="main-content-ia" role="main" tabindex="-1">
      <HeroIA />
      <ProblemIAAsync />
      <SolutionIAAsync />
      <UseCasesIAAsync />
      <ServicesIAAsync />
      <ProcessIAAsync />
      <CustomGPTIAAsync />
      <OfferIAAsync />
      <FAQIAAsync />
      <CTAIAAsync />
    </main>
    <WhatsAppButton />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import { useScrollReveal } from "./composables/useScrollReveal.js";
import HeroIA from "./components/HeroIA.vue";
import WhatsAppButton from "./components/WhatsAppButton.vue";

const ProblemIAAsync = defineAsyncComponent(() => import("./components/ProblemIA.vue"));
const SolutionIAAsync = defineAsyncComponent(() => import("./components/SolutionIA.vue"));
const UseCasesIAAsync = defineAsyncComponent(() => import("./components/UseCasesIA.vue"));
const ServicesIAAsync = defineAsyncComponent(() => import("./components/ServicesIA.vue"));
const ProcessIAAsync = defineAsyncComponent(() => import("./components/ProcessIA.vue"));
const CustomGPTIAAsync = defineAsyncComponent(() => import("./components/CustomGPTIA.vue"));
const OfferIAAsync = defineAsyncComponent(() => import("./components/OfferIA.vue"));
const FAQIAAsync = defineAsyncComponent(() => import("./components/FAQIA.vue"));
const CTAIAAsync = defineAsyncComponent(() => import("./components/CTAIA.vue"));

useScrollReveal();
</script>
