<template>
  <div class="max-w-3xl">
    <p v-if="eyebrow" class="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-vogel-amber">
      {{ eyebrow }}
    </p>
    <h2 :id="id || undefined" class="text-3xl font-bold text-white sm:text-4xl">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-4 text-base leading-relaxed text-vogel-gray/90 sm:text-lg">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: "",
  },
  eyebrow: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});
</script>
