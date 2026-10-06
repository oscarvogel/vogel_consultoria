<script setup>
defineProps({id:{type:String,default:''},eyebrow:{type:String,default:''},title:{type:String,required:true},description:{type:String,default:''}});
</script>
<template><div class="max-w-3xl"><h2 :id="id || undefined" class="section-title" data-text-reveal>{{ title }}</h2><p v-if="description" class="section-description">{{ description }}</p></div></template>
