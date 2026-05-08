<template>
  <div class="relative overflow-x-hidden">
    <Navbar />
    <main>
      <HeroSection />
      <ServicesSection />
      <ProblemsSection />
      <SolutionsSection />
      <ProcessSection />
      <AISection />
      <AboutSection />
      <CTASection />
    </main>
    <FooterSection />
  </div>
</template>

<script setup>
import { useScrollReveal } from "./composables/useScrollReveal.js";
import Navbar from "./components/Navbar.vue";
import HeroSection from "./components/HeroSection.vue";
import ServicesSection from "./components/ServicesSection.vue";
import ProblemsSection from "./components/ProblemsSection.vue";
import SolutionsSection from "./components/SolutionsSection.vue";
import ProcessSection from "./components/ProcessSection.vue";
import AISection from "./components/AISection.vue";
import AboutSection from "./components/AboutSection.vue";
import CTASection from "./components/CTASection.vue";
import FooterSection from "./components/FooterSection.vue";
useScrollReveal();
</script>
