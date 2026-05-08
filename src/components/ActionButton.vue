<template>
  <a
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-300"
    :class="variantClass"
  >
    {{ label }}
  </a>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    default: "#",
  },
  external: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "secondary"].includes(value),
  },
});

const variantClass = computed(() => {
  if (props.variant === "secondary") {
    return "border-vogel-gray/40 bg-transparent text-vogel-gray hover:border-vogel-amber hover:text-vogel-amber";
  }
  return "border-vogel-blue bg-vogel-blue text-white hover:-translate-y-0.5 hover:border-vogel-amber hover:bg-vogel-amber hover:text-vogel-deep";
});
</script>
