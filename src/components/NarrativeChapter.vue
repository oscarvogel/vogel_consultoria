<script setup>
import ChapterVisual from './ChapterVisual.vue';
import StoryArtifact from './StoryArtifact.vue';
defineProps({id:String,chapter:{type:String,default:'connect'},title:String,description:String,steps:{type:Array,required:true}});
</script>
<template>
 <section :id="id" class="section-space" data-narrative-steps :data-chapter="chapter" :aria-labelledby="id+'-heading'">
  <div class="section-shell">
   <h2 :id="id+'-heading'" class="section-title">{{ title }}</h2><p class="section-description">{{ description }}</p>
   <div class="chapter-layout">
    <ol class="chapter-copy" data-narrative-copy>
     <li v-for="(step,index) in steps" :key="step.title" class="chapter-step" data-narrative-step>
      <span class="chapter-step-index">{{ String(index+1).padStart(2,'0') }} / {{ String(steps.length).padStart(2,'0') }}</span>
      <h3>{{ step.title }}</h3><p>{{ step.text }}</p>
      <ul v-if="step.items" class="chapter-detail-list"><li v-for="item in step.items" :key="item">{{ item }}</li></ul>
      <div class="chapter-mobile-art" aria-hidden="true"><img v-if="step.image" :src="step.image" alt="" width="640" height="360" loading="lazy"/><StoryArtifact v-else :mode="step.mode"/><small>{{ step.image?'Visual conceptual.':'Esquema de proceso.' }}</small></div>
     </li>
    </ol>
    <ChapterVisual :frames="steps.map(step=>({...step,label:step.title}))" />
   </div>
  </div>
 </section>
</template>
