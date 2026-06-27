<template>
  <a
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="inline-flex items-center justify-center whitespace-nowrap rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vogel-amber focus-visible:ring-offset-2 focus-visible:ring-offset-vogel-deep"
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
    validator: (value) => ["primary", "secondary", "accent"].includes(value),
  },
});

const variantClass = computed(() => {
  if (props.variant === "accent") {
    return "border-vogel-amber bg-vogel-amber text-vogel-deep shadow-[0_14px_34px_-18px_rgba(242,169,0,0.9)] hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-vogel-deep";
  }
  if (props.variant === "secondary") {
    return "border-vogel-gray/40 bg-transparent text-vogel-gray hover:border-vogel-amber hover:text-vogel-amber";
  }
  return "border-vogel-blue bg-vogel-blue text-white hover:-translate-y-0.5 hover:border-vogel-amber hover:bg-vogel-amber hover:text-vogel-deep";
});
</script>
