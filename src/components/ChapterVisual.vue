<script setup>
import StoryArtifact from './StoryArtifact.vue';
defineProps({ frames: { type: Array, required: true } });
</script>
<template>
  <div class="chapter-visual" data-narrative-visual aria-hidden="true">
    <div v-for="(frame,index) in frames" :key="frame.label" class="chapter-frame" data-scene-frame :data-frame-index="index">
      <div class="chapter-frame-art">
        <img v-if="frame.image" :src="frame.image" alt="" width="640" height="360" loading="lazy" decoding="async" />
        <StoryArtifact v-else :mode="frame.mode" />
      </div>
      <div class="chapter-frame-caption"><span>{{ frame.label }}</span><span>{{ frame.demo ? 'Interfaz real · datos de demostración' : frame.image ? 'Visual conceptual' : 'Esquema de proceso' }}</span></div>
    </div>
    <div class="chapter-progress"><span v-for="(frame,index) in frames" :key="frame.label" :data-progress-index="index"></span></div>
  </div>
</template>
