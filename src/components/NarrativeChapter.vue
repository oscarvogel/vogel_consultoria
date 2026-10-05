<script setup>
defineProps({id:String,chapter:String,title:String,description:String,steps:{type:Array,required:true}});
</script>
<template>
 <section :id="id" class="section-space capability-story" :aria-labelledby="id+'-heading'">
  <div class="section-shell">
   <h2 :id="id+'-heading'" class="section-title">{{ title }}</h2><p class="section-description">{{ description }}</p>
   <div class="capability-story-grid"><article v-for="step in steps" :key="step.title"><h3>{{ step.title }}</h3><p>{{ step.text }}</p><ul v-if="step.items"><li v-for="item in step.items" :key="item">{{ item }}</li></ul><figure v-if="step.image"><img :src="step.image" alt="Visual conceptual del servicio, no representa resultados de un cliente." width="640" height="360" loading="lazy" decoding="async"/><figcaption>Visual conceptual.</figcaption></figure></article></div>
  </div>
 </section>
</template>
<style scoped>
.capability-story-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:40px 64px;margin-top:48px}
.capability-story-grid article{border-top:1px solid var(--color-border);padding-top:28px}
.capability-story-grid h3{font-size:26px;font-weight:450;line-height:1.2}
.capability-story-grid p,.capability-story-grid ul{font-size:16px;line-height:1.8;color:var(--color-muted);margin-top:18px}
.capability-story-grid ul{list-style:disc;padding-left:20px}
.capability-story-grid figure{margin-top:24px}.capability-story-grid img{width:100%;border-radius:10px}.capability-story-grid figcaption{font-size:12px;color:var(--color-muted);margin-top:10px}
@media(max-width:767px){.capability-story-grid{grid-template-columns:1fr;gap:32px}.capability-story-grid h3{font-size:24px}}
</style>
