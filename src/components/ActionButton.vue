<script setup>
defineProps({label:{type:String,required:true},href:{type:String,default:'#'},external:Boolean,variant:{type:String,default:'primary',validator:v=>['primary','secondary','accent'].includes(v)}});
</script>
<template>
  <a :href="href" :target="external ? '_blank' : undefined" :rel="external ? 'noopener noreferrer' : undefined" class="action-button" :class="variant === 'secondary' ? 'action-secondary' : variant === 'accent' ? 'action-primary' : 'action-blue'">{{ label }}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>
</template>
