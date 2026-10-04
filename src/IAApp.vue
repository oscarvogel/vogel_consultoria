<template>
  <div class="relative ia-page">
    <a class="skip-link" href="#main-content-ia">Saltar al contenido principal</a>
    <Navbar />
    <main id="main-content-ia" role="main" tabindex="-1">
      <HeroIA />
      <IAStoryChapter />
      <UseCasesIAAsync />
      <ServicesIAAsync />
      <ProcessIAAsync />
      <CustomGPTIAAsync />
      <OfferIAAsync />
      <FAQIAAsync />
      <CTAIAAsync />
    </main>
    <FooterSection />
    <WhatsAppButton />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import { useScrollReveal } from "./composables/useScrollReveal.js";
import Navbar from "./components/Navbar.vue";
import FooterSection from "./components/FooterSection.vue";
import HeroIA from "./components/HeroIA.vue";
import WhatsAppButton from "./components/WhatsAppButton.vue";

import IAStoryChapter from "./components/IAStoryChapter.vue";
const UseCasesIAAsync = defineAsyncComponent(() => import("./components/UseCasesIA.vue"));
const ServicesIAAsync = defineAsyncComponent(() => import("./components/ServicesIA.vue"));
const ProcessIAAsync = defineAsyncComponent(() => import("./components/ProcessIA.vue"));
const CustomGPTIAAsync = defineAsyncComponent(() => import("./components/CustomGPTIA.vue"));
const OfferIAAsync = defineAsyncComponent(() => import("./components/OfferIA.vue"));
const FAQIAAsync = defineAsyncComponent(() => import("./components/FAQIA.vue"));
const CTAIAAsync = defineAsyncComponent(() => import("./components/CTAIA.vue"));

useScrollReveal();
</script>
