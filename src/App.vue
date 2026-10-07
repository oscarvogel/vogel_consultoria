<script setup>
import { provide, defineAsyncComponent } from 'vue';
import { spatialOwnershipKey } from './lib/spatialScenes.js';
import Navbar from './components/Navbar.vue';
import HeroSection from './components/HeroSection.vue';
import SpatialNarrativeArc from './components/SpatialNarrativeArc.vue';
import EvidenceSection from './components/EvidenceSection.vue';
import SecondaryContent from './components/SecondaryContent.vue';
import MiniCasesSection from './components/MiniCasesSection.vue';
import ServicesSection from './components/ServicesSection.vue';
import ProcessSection from './components/ProcessSection.vue';
import AboutSection from './components/AboutSection.vue';
import CTASection from './components/CTASection.vue';
import FooterSection from './components/FooterSection.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';
import CapabilityIndex from './components/editorial/CapabilityIndex.vue';
import MethodVogel from './components/editorial/MethodVogel.vue';
import PersonChapter from './components/editorial/PersonChapter.vue';
import RealWork from './components/editorial/RealWork.vue';
import PerspectivesSection from './components/editorial/PerspectivesSection.vue';
import ConversationSection from './components/editorial/ConversationSection.vue';
import { useScrollReveal } from './composables/useScrollReveal.js';
import { useEditorialMotion } from './composables/useEditorialMotion.js';
import './styles/home.css';
useScrollReveal();
// Phase 05 closes the Home editorially; it implies Phase 04 and, through it, the whole spatial chain.
const phase05Enabled = import.meta.env.VITE_SPATIAL_PHASE_05 === 'true';
if (phase05Enabled) useEditorialMotion();
const phase04Enabled = phase05Enabled || import.meta.env.VITE_SPATIAL_PHASE_04 === 'true';
const phase03Enabled = phase04Enabled || import.meta.env.VITE_SPATIAL_PHASE_03 === 'true';
const narrativeEnabled = phase03Enabled || import.meta.env.VITE_SPATIAL_NARRATIVE === 'true';
const spatialEnabled = narrativeEnabled || import.meta.env.VITE_SPATIAL_CORE === 'true';
provide(spatialOwnershipKey, spatialEnabled);
const SpatialExperience = spatialEnabled ? defineAsyncComponent(() => import('./components/SpatialExperience.vue')) : null;
</script>
<template>
  <div class="home-page">
    <SpatialExperience v-if="spatialEnabled" :narrative="narrativeEnabled" :phase03="phase03Enabled" :phase04="phase04Enabled" />
    <div class="home-page-content">
      <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
      <Navbar />
      <main id="main-content" tabindex="-1">
        <SpatialNarrativeArc v-if="narrativeEnabled" :phase03="phase03Enabled" :phase04="phase04Enabled" />
        <HeroSection v-else />
        <template v-if="phase05Enabled">
          <CapabilityIndex />
          <MethodVogel />
          <PersonChapter />
          <RealWork />
          <PerspectivesSection />
          <ConversationSection />
        </template>
        <template v-else>
          <ServicesSection />
          <MiniCasesSection v-if="!phase04Enabled" />
          <EvidenceSection />
          <ProcessSection />
          <AboutSection />
          <SecondaryContent />
          <CTASection />
        </template>
      </main>
      <FooterSection />
      <WhatsAppButton />
    </div>
  </div>
</template>
