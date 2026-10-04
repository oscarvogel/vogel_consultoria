<script setup>
import { shallowRef, ref, nextTick } from "vue";
import ActionButton from "./ActionButton.vue";
import { trackEvent } from "../lib/analytics.js";

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "";

const state = shallowRef("idle");
const successMessage = ref(null);
const nameInput = ref(null); // idle | loading | success | error

async function handleSubmit(event) {
  const form = event.currentTarget;

  if (state.value === "loading") {
    return;
  }

  state.value = "loading";

  const data = new FormData(form);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    });

    const json = await response.json();

    if (response.ok && json.success) {
      state.value = "success";
      trackEvent("contact_form_submit", {
        page_location: window.location.pathname,
        placement: "contacto",
        form_name: "Formulario de contacto",
      });
      form.reset();
      await nextTick();
      successMessage.value?.focus();
    } else {
      state.value = "error";
    }
  } catch {
    state.value = "error";
  }
}

async function resetForm() {
  state.value = "idle";
  await nextTick();
  nameInput.value?.focus();
}
</script>

<template>
  <section
    id="contacto"
    class="section-space"
    aria-labelledby="contacto-heading"
    data-analytics-view="contact_section"
    data-analytics-funnel="lead_journey"
    data-analytics-step="contact"
  >
    <div class="section-shell">
      <div class="border-t border-vogel-gray/20 pt-16">
        <div class="relative text-left">

          <h2 id="contacto-heading" class="section-title max-w-3xl">
            Agendemos un diagnóstico de tu operación.
          </h2>
          <p class="section-description mt-5 max-w-2xl">
            Contanos dónde se traba el trabajo. Revisamos el contexto y definimos un próximo paso con alcance claro.
          </p>

          <div class="mt-8 grid gap-8 lg:grid-cols-2 lg:text-left">
            <!-- Form panel -->
            <div class="rounded-2xl border border-vogel-gray/20 bg-vogel-deep/60 p-5 sm:p-6">

              <!-- Success state -->
              <div
                v-if="state === 'success'" ref="successMessage" tabindex="-1"
                class="flex flex-col items-center gap-4 py-6 text-center"
                role="status"
                aria-live="polite"
              >
                <div class="flex h-12 w-12 items-center justify-center rounded-full border border-vogel-amber/50 bg-vogel-amber/15">
                  <svg class="h-6 w-6 text-vogel-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="text-base font-semibold text-white">¡Consulta enviada!</p>
                <p class="text-sm text-vogel-gray">Te respondemos a la brevedad con un plan inicial.</p>
                <button
                  type="button"
                  class="mt-2 text-sm font-medium text-vogel-amber underline-offset-2 hover:underline"
                  @click="resetForm"
                >
                  Enviar otra consulta
                </button>
              </div>

              <!-- Form -->
              <form
                v-else
                aria-label="Formulario de contacto" :aria-busy="state === 'loading'"
                data-analytics-cta="contact_form_main"
                data-analytics-funnel="lead_journey"
                data-analytics-step="contact"
                @submit.prevent="handleSubmit"
              >
                <input type="hidden" name="access_key" :value="WEB3FORMS_KEY" />
                <input type="hidden" name="subject" value="Nuevo lead desde vogelconsultoria.com.ar" />
                <input type="hidden" name="from_name" value="Vogel Consultoría" />

                <div class="grid gap-4">
                  <div>
                    <label for="contacto-nombre" class="mb-1.5 block text-sm font-medium text-vogel-gray">Nombre y apellido</label>
                    <input
                      id="contacto-nombre" ref="nameInput"
                      name="Nombre" autocomplete="name"
                      required
                      class="w-full rounded-xl border border-vogel-gray/30 bg-vogel-navy/80 px-4 py-2.5 text-sm text-white placeholder:text-vogel-muted"
                      placeholder="Ej: Juan Perez"
                    />
                  </div>
                  <div>
                    <label for="contacto-email" class="mb-1.5 block text-sm font-medium text-vogel-gray">Email</label>
                    <input
                      id="contacto-email"
                      name="email" autocomplete="email"
                      type="email" spellcheck="false"
                      required
                      class="w-full rounded-xl border border-vogel-gray/30 bg-vogel-navy/80 px-4 py-2.5 text-sm text-white placeholder:text-vogel-muted"
                      placeholder="Ej: contacto@empresa.com"
                    />
                  </div>
                  <div>
                    <label for="contacto-objetivo" class="mb-1.5 block text-sm font-medium text-vogel-gray">Objetivo principal</label>
                    <select
                      id="contacto-objetivo"
                      name="Objetivo"
                      class="w-full rounded-xl border border-vogel-gray/30 bg-vogel-navy/80 px-4 py-2.5 text-sm text-white"
                    >
                      <option>Diagnóstico</option>
                      <option>Demo de tablero</option>
                      <option>Automatización de procesos</option>
                      <option>Implementación de IA</option>
                      <option>Desarrollo web</option>
                    </select>
                  </div>
                  <div>
                    <label for="contacto-mensaje" class="mb-1.5 block text-sm font-medium text-vogel-gray">Contanos un poco más</label>
                    <textarea
                      id="contacto-mensaje"
                      name="Mensaje"
                      rows="5"
                      class="w-full resize-y rounded-xl border border-vogel-gray/30 bg-vogel-navy/80 px-4 py-2.5 text-sm text-white placeholder:text-vogel-muted"
                      placeholder="Contá qué problema querés resolver, plazos, contexto o cualquier detalle útil."
                    ></textarea>
                  </div>

                  <!-- Error message -->
                  <p
                    v-if="state === 'error'"
                    class="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm text-[#FECACA]"
                    role="alert"
                  >
                    Hubo un problema al enviar. Intentá de nuevo o escribinos por WhatsApp.
                  </p>

                  <button
                    type="submit"
                    :disabled="state === 'loading'"
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-vogel-amber bg-vogel-amber px-6 py-3 text-sm font-semibold text-vogel-deep transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vogel-amber focus-visible:ring-offset-2 focus-visible:ring-offset-vogel-deep disabled:opacity-60"
                  >
                    <svg v-if="state === 'loading'" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    {{ state === 'loading' ? 'Enviando…' : 'Enviar consulta' }}
                  </button>
                </div>
              </form>
            </div>

            <div class="flex flex-col justify-center gap-4 rounded-2xl border border-vogel-gray/20 bg-vogel-navy p-5 sm:p-6">
              <p class="text-sm font-semibold uppercase tracking-[0.14em] text-vogel-amber">Conversemos</p>
              <p class="text-sm leading-relaxed text-vogel-gray sm:text-base">
                Elegí el canal que te resulte más cómodo para coordinar una reunión de 20 minutos.
              </p>
              <div class="flex flex-wrap items-center gap-3">
                <ActionButton
                  label="Agendar por email"
                  href="mailto:oscar@vogelconsultoria.com.ar?subject=Quiero%20agendar%20una%20reuni%C3%B3n"
                  data-analytics-cta="contact_email_schedule"
                  data-analytics-funnel="lead_journey"
                  data-analytics-step="contact"
                />
                <ActionButton
                  label="Agendar por WhatsApp"
                  href="https://wa.me/543743667526?text=Hola%20quiero%20agendar%20una%20reuni%C3%B3n"
                  :external="true"
                  variant="secondary"
                  data-analytics-cta="contact_whatsapp_schedule"
                  data-analytics-funnel="lead_journey"
                  data-analytics-step="contact"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
