<script setup>
defineProps({ number: { type: String, required: true }, label: { type: String, required: true } });
</script>
<template>
  <p class="home-chapter-label"><span>{{ number }} / {{ label }}</span><span class="home-chapter-rule" aria-hidden="true"></span></p>
</template>
