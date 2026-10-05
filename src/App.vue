<script setup>
import Navbar from './components/Navbar.vue';
import HeroSection from './components/HeroSection.vue';
import ProblemsSection from './components/ProblemsSection.vue';
import MiniCasesSection from './components/MiniCasesSection.vue';
import ServicesSection from './components/ServicesSection.vue';
import ProcessSection from './components/ProcessSection.vue';
import AboutSection from './components/AboutSection.vue';
import CTASection from './components/CTASection.vue';
import FooterSection from './components/FooterSection.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';
import { useHomeMotion } from './composables/useHomeMotion.js';
import './styles/home.css';
useHomeMotion();
</script>
<template>
  <div class="home-page">
    <div class="home-page-content">
      <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
      <Navbar />
      <main id="main-content" tabindex="-1">
        <HeroSection />
        <ProblemsSection />
        <MiniCasesSection />
        <ServicesSection />
        <ProcessSection />
        <AboutSection />
        <CTASection />
      </main>
      <FooterSection />
      <WhatsAppButton />
    </div>
  </div>
</template>
