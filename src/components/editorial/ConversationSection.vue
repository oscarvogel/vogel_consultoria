<script setup>
import { useContactForm } from '../../composables/useContactForm.js';
import '../../styles/editorial.css';
const { accessKey, state, successMessage, nameInput, handleSubmit, resetForm } = useContactForm();
</script>
<template>
  <section id="contacto" class="ed-section ed-conversation" aria-labelledby="contacto-heading"
    data-ed-section data-analytics-view="contact_section" data-analytics-funnel="lead_journey" data-analytics-step="contact">
    <div class="ed-shell conversation-grid">
      <div class="conversation-copy">
        <p class="ed-kicker" data-ed-item>Conversación</p>
        <h2 id="contacto-heading" class="ed-title" data-ed-item>Los problemas complejos empiezan con una conversación clara.</h2>
        <p class="ed-lede" data-ed-item>Contanos dónde se traba el trabajo. Revisamos el contexto y definimos un próximo paso con alcance claro.</p>
        <div class="conversation-contact" data-ed-item>
          <p class="conversation-name">Oscar Vogel</p>
          <a class="ed-link" href="mailto:oscar@vogelconsultoria.com.ar">oscar@vogelconsultoria.com.ar</a>
          <div class="conversation-actions">
            <a class="ed-btn ed-btn--ghost" href="mailto:oscar@vogelconsultoria.com.ar?subject=Quiero%20agendar%20un%20diagn%C3%B3stico" data-analytics-cta="contact_email_schedule" data-analytics-funnel="lead_journey" data-analytics-step="contact">Agendar diagnóstico <span aria-hidden="true">→</span></a>
            <a class="ed-btn ed-btn--ghost" href="https://wa.me/543743667526?text=Hola%20quiero%20agendar%20una%20reuni%C3%B3n" target="_blank" rel="noopener noreferrer" data-analytics-cta="contact_whatsapp_schedule" data-analytics-funnel="lead_journey" data-analytics-step="contact">Conversar por WhatsApp <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>

      <div class="conversation-form" data-ed-item>
        <div v-if="state === 'success'" ref="successMessage" tabindex="-1" class="form-success" role="status" aria-live="polite">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          <p class="form-success-title">¡Consulta enviada!</p>
          <p>Te respondemos a la brevedad con un plan inicial.</p>
          <button type="button" class="ed-link" @click="resetForm">Enviar otra consulta</button>
        </div>
        <form v-else aria-label="Formulario de contacto" :aria-busy="state === 'loading'" data-analytics-cta="contact_form_main" data-analytics-funnel="lead_journey" data-analytics-step="contact" @submit.prevent="handleSubmit">
          <input type="hidden" name="access_key" :value="accessKey" />
          <input type="hidden" name="subject" value="Nuevo lead desde vogelconsultoria.com.ar" />
          <input type="hidden" name="from_name" value="Vogel Consultoría" />

          <div class="field">
            <label for="contacto-nombre">Nombre y apellido</label>
            <input id="contacto-nombre" ref="nameInput" name="Nombre" autocomplete="name" required />
          </div>
          <div class="field">
            <label for="contacto-email">Email</label>
            <input id="contacto-email" name="email" type="email" autocomplete="email" spellcheck="false" required />
          </div>
          <div class="field">
            <label for="contacto-telefono">WhatsApp o teléfono <span>— opcional</span></label>
            <input id="contacto-telefono" type="tel" name="Telefono" autocomplete="tel" inputmode="tel" aria-describedby="contacto-telefono-ayuda" />
            <p id="contacto-telefono-ayuda" class="field-help">Si preferís que te contactemos por WhatsApp, dejá tu número.</p>
          </div>
          <div class="field">
            <label for="contacto-objetivo">Objetivo principal</label>
            <select id="contacto-objetivo" name="Objetivo">
              <option>Diagnóstico</option>
              <option>Demo de tablero</option>
              <option>Automatización de procesos</option>
              <option>Implementación de IA</option>
              <option>Desarrollo web</option>
            </select>
          </div>
          <div class="field">
            <label for="contacto-mensaje">Contanos qué necesitás resolver</label>
            <textarea id="contacto-mensaje" name="Mensaje" rows="4"></textarea>
          </div>

          <p v-if="state === 'error'" class="form-error" role="alert">Hubo un problema al enviar. Intentá de nuevo o escribinos por WhatsApp.</p>
          <button type="submit" class="ed-btn ed-btn--accent" :disabled="state === 'loading'">{{ state === 'loading' ? 'Enviando…' : 'Enviar consulta' }} <span aria-hidden="true">→</span></button>
        </form>
      </div>
    </div>
    <!-- The ordered world, as a still: no GPU work in the second half of the page. -->
    <div class="conversation-world" aria-hidden="true"><img src="/landscape/closing-ordered.webp" alt="" width="1672" height="660" loading="lazy" decoding="async" /></div>
  </section>
</template>
