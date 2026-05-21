<template>
  <a
    :href="waLink"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center gap-2 rounded-full border border-green-400 bg-green-500 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vogel-amber focus-visible:ring-offset-2 focus-visible:ring-offset-vogel-deep sm:h-auto sm:w-auto sm:px-4 sm:py-3"
    aria-label="Hablar por WhatsApp"
    data-analytics-cta="floating_whatsapp"
    data-analytics-funnel="lead_journey"
    data-analytics-step="contact"
  >
    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path
        d="M20.52 3.48A11.84 11.84 0 0012.08 0C5.5 0 .12 5.36.12 11.95c0 2.1.55 4.17 1.6 6L0 24l6.2-1.64a11.95 11.95 0 005.73 1.46h.01c6.58 0 11.95-5.37 11.95-11.95 0-3.2-1.25-6.2-3.37-8.39zm-8.58 18.3h-.01a9.91 9.91 0 01-5.05-1.39l-.36-.22-3.68.97.98-3.58-.23-.37a9.88 9.88 0 01-1.52-5.24C2.08 6.47 6.54 2 12.08 2c2.64 0 5.13 1.02 6.99 2.88a9.79 9.79 0 012.9 6.98c0 5.54-4.51 10.05-10.03 10.05zm5.5-7.53c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5a9.2 9.2 0 01-1.68-2.08c-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.1 4.48.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.18-1.42-.07-.12-.27-.2-.57-.35z"
      />
    </svg>
    <span class="hidden sm:inline">Hablar por WhatsApp</span>
  </a>
</template>

<script setup>
const waLink = "https://wa.me/543743667526?text=Hola%20quiero%20implementar%20IA%20en%20mi%20empresa";
</script>
