<template>
  <div class="relative">
    <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
    <Navbar />
    <main id="main-content" class="overflow-x-hidden" role="main" tabindex="-1">
      <HeroSection />
      <EventProgramSection />
      <ServicesSectionAsync />
      <ResourcesSectionAsync />
      <ProblemsSectionAsync />
      <SolutionsSectionAsync />
      <ProcessSectionAsync />
      <AISectionAsync />
      <MiniCasesSectionAsync />
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
import EventProgramSection from "./components/EventProgramSection.vue";
import FooterSection from "./components/FooterSection.vue";
import WhatsAppButton from "./components/WhatsAppButton.vue";

const ServicesSectionAsync = defineAsyncComponent(() => import("./components/ServicesSection.vue"));
const ResourcesSectionAsync = defineAsyncComponent(() => import("./components/ResourcesSection.vue"));
const ProblemsSectionAsync = defineAsyncComponent(() => import("./components/ProblemsSection.vue"));
const SolutionsSectionAsync = defineAsyncComponent(() => import("./components/SolutionsSection.vue"));
const ProcessSectionAsync = defineAsyncComponent(() => import("./components/ProcessSection.vue"));
const AISectionAsync = defineAsyncComponent(() => import("./components/AISection.vue"));
const MiniCasesSectionAsync = defineAsyncComponent(() => import("./components/MiniCasesSection.vue"));
const AboutSectionAsync = defineAsyncComponent(() => import("./components/AboutSection.vue"));
const CTASectionAsync = defineAsyncComponent(() => import("./components/CTASection.vue"));

useScrollReveal();
</script>
