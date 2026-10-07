<script setup>
import { nextTick } from 'vue';
import { useContactForm } from '../../../composables/useContactForm.js';

const { accessKey, state, successMessage, nameInput, handleSubmit, resetForm } = useContactForm();
const emailUrl = 'mailto:oscar@vogelconsultoria.com.ar?subject=Quiero%20agendar%20un%20diagn%C3%B3stico';
const whatsappUrl = 'https://wa.me/543743667526?text=Hola%20quiero%20agendar%20una%20reuni%C3%B3n';

async function resetContactForm() {
  await resetForm();
  await nextTick();
}
</script>

<template>
  <main class="portfolio-destination" data-destination="contact">
    <div class="destination-inner">
      <header class="destination-header">
        <h1 data-destination-heading tabindex="-1">Hablemos de lo que necesitás resolver.</h1>
        <p>Contanos dónde se traba el trabajo. Definimos un próximo paso con alcance claro.</p>
      </header>

      <section id="contacto" class="destination-section destination-contact-layout" tabindex="-1" aria-label="Canales de contacto" data-analytics-view="contact_section" data-analytics-funnel="lead_journey" data-analytics-step="contact">
        <div class="destination-contact-methods" v-animateonscroll.once="{ enterClass: 'vogel-rise', threshold: .12 }">
          <a :href="emailUrl" data-analytics-cta="contact_email_schedule" data-analytics-funnel="lead_journey" data-analytics-step="contact">Agendar diagnóstico →</a>
          <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" data-analytics-cta="contact_whatsapp_schedule" data-analytics-funnel="lead_journey" data-analytics-step="contact">WhatsApp →</a>
          <p class="destination-contact-note"><a href="mailto:oscar@vogelconsultoria.com.ar">oscar@vogelconsultoria.com.ar</a><br />+54 3743 66-7526</p>
        </div>

        <div>
          <div v-if="state === 'success'" ref="successMessage" tabindex="-1" class="destination-form-success" role="status" aria-live="polite">
            <h2>¡Consulta enviada!</h2>
            <p>Te respondemos a la brevedad con un plan inicial.</p>
            <button type="button" class="destination-text-link" @click="resetContactForm">Enviar otra consulta</button>
          </div>
          <form v-else class="destination-form" aria-label="Formulario de contacto" aria-describedby="contacto-datos-notice" :aria-busy="state === 'loading'" data-analytics-cta="contact_form_main" data-analytics-funnel="lead_journey" data-analytics-step="contact" @submit.prevent="handleSubmit">
            <input type="hidden" name="access_key" :value="accessKey" />
            <input type="hidden" name="subject" value="Nuevo lead desde vogelconsultoria.com.ar" />
            <input type="hidden" name="from_name" value="Vogel Consultoría" />
            <label for="contacto-nombre">Nombre y apellido</label>
            <input id="contacto-nombre" ref="nameInput" name="Nombre" autocomplete="name" required />
            <label for="contacto-email">Email</label>
            <input id="contacto-email" name="email" type="email" autocomplete="email" spellcheck="false" required />
            <label for="contacto-telefono">WhatsApp o teléfono <span>— opcional</span></label>
            <input id="contacto-telefono" type="tel" name="Telefono" autocomplete="tel" inputmode="tel" />
            <label for="contacto-mensaje">Contanos qué necesitás resolver</label>
            <textarea id="contacto-mensaje" name="Mensaje" rows="4"></textarea>
            <p id="contacto-datos-notice" class="destination-form-privacy">Al enviar, tu nombre, email, mensaje y teléfono opcional se transmiten a Web3Forms para que podamos responderte. Evitá incluir información sensible.</p>
            <p v-if="state === 'error'" class="destination-form-error" role="alert">Hubo un problema al enviar. Intentá de nuevo o escribinos por WhatsApp.</p>
            <button type="submit" class="destination-submit" :disabled="state === 'loading'">{{ state === 'loading' ? 'Enviando…' : 'Enviar consulta →' }}</button>
          </form>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.destination-form-privacy {
  max-width: 64ch;
  margin: 4px 0 8px;
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1.55;
}
</style>
