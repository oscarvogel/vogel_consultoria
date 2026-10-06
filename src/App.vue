<script setup>
import Navbar from './components/Navbar.vue';
import HeroSection from './components/HeroSection.vue';
import EvidenceSection from './components/EvidenceSection.vue';
import SecondaryContent from './components/SecondaryContent.vue';
import MiniCasesSection from './components/MiniCasesSection.vue';
import ServicesSection from './components/ServicesSection.vue';
import ProcessSection from './components/ProcessSection.vue';
import AboutSection from './components/AboutSection.vue';
import CTASection from './components/CTASection.vue';
import FooterSection from './components/FooterSection.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';
import { useScrollReveal } from './composables/useScrollReveal.js';
import './styles/home.css';
useScrollReveal();
</script>
<template>
  <div class="home-page">
    <div class="home-page-content">
      <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
      <Navbar />
      <main id="main-content" tabindex="-1">
        <HeroSection />
        <ServicesSection />
        <MiniCasesSection />
        <EvidenceSection />
        <ProcessSection />
        <AboutSection />
        <SecondaryContent />
        <CTASection />
      </main>
      <FooterSection />
      <WhatsAppButton />
    </div>
  </div>
</template>
