<template>
  <section id="contacto" class="pb-24 pt-10" aria-label="Contacto y llamado a la acción">
    <div class="section-shell">
      <div class="relative overflow-hidden rounded-3xl border border-vogel-amber/30 px-6 py-16 sm:px-10 sm:py-20">
        <!-- Ambient blobs -->
        <div class="ambient-blob h-80 w-80 bg-vogel-blue/30" style="top: -80px; left: -80px;"></div>
        <div class="ambient-blob h-60 w-60 bg-vogel-amber/20" style="bottom: -50px; right: -50px;"></div>
        <!-- Background -->
        <div class="absolute inset-0 -z-10 bg-gradient-to-br from-vogel-blue/30 via-vogel-deep to-vogel-navy"></div>

        <div class="relative reveal text-center">
          <p class="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-vogel-amber">¿Listo para dar el siguiente paso?</p>
          <h2 class="mx-auto max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            Tu empresa ya tiene los datos.<br class="hidden sm:block" />
            <span class="text-vogel-amber">Falta convertirlos en decisiones.</span>
          </h2>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <ActionButton label="Agendar reunión" href="mailto:oscarvogel@gmail.com" />
            <ActionButton
              label="Enviar WhatsApp"
              href="https://wa.me/543743667526"
              :external="true"
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ActionButton from "./ActionButton.vue";
</script>
