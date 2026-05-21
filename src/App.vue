<template>
  <div class="relative">
    <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
    <EventModal @show-program="scrollToProgram" />
    <Navbar />
    <main id="main-content" class="overflow-x-hidden" role="main" tabindex="-1">
      <HeroSection />
      <EventProgramSection />
      <ServicesSectionAsync />
      <ProblemsSectionAsync />
      <SolutionsSectionAsync />
      <ProcessSectionAsync />
      <AISectionAsync />
      <AboutSectionAsync />
      <CTASectionAsync />
    </main>
    <FooterSection />
    <WhatsAppButton />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import { useScrollReveal } from "./composables/useScrollReveal.js";
import Navbar from "./components/Navbar.vue";
import HeroSection from "./components/HeroSection.vue";
import EventModal from "./components/EventModal.vue";
import EventProgramSection from "./components/EventProgramSection.vue";
import FooterSection from "./components/FooterSection.vue";
import WhatsAppButton from "./components/WhatsAppButton.vue";

const ServicesSectionAsync = defineAsyncComponent(() => import("./components/ServicesSection.vue"));
const ProblemsSectionAsync = defineAsyncComponent(() => import("./components/ProblemsSection.vue"));
const SolutionsSectionAsync = defineAsyncComponent(() => import("./components/SolutionsSection.vue"));
const ProcessSectionAsync = defineAsyncComponent(() => import("./components/ProcessSection.vue"));
const AISectionAsync = defineAsyncComponent(() => import("./components/AISection.vue"));
const AboutSectionAsync = defineAsyncComponent(() => import("./components/AboutSection.vue"));
const CTASectionAsync = defineAsyncComponent(() => import("./components/CTASection.vue"));

function scrollToProgram() {
  window.requestAnimationFrame(() => {
    document.getElementById("charla-ia-2026")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

useScrollReveal();
</script>
