<script setup>
import { nextTick, ref, watch } from 'vue';
import { servicePages } from '../../data/servicePages.js';
import { resources } from '../../data/resources.js';
import { methodSteps } from '../../data/method.js';
import { oscarProfile } from '../../data/oscar.js';
import { useContactForm } from '../../composables/useContactForm.js';
import portrait480 from '../../assets/oscar/oscar-vogel-480.webp';
import portrait720 from '../../assets/oscar/oscar-vogel-720.webp';

const props = defineProps({ open: Boolean, portfolio: Boolean, section: String });
const emit = defineEmits(['close']);
const panel = ref(null);
const closeButton = ref(null);
const { accessKey, state, successMessage, nameInput, handleSubmit, resetForm } = useContactForm();

const serviceLinks = [
  ...Object.values(servicePages).map((s) => ({ label: s.shortTitle, href: s.path })),
  { label: 'Inteligencia artificial', href: '/inteligencia-artificial/' },
  { label: 'Automatizaciones ARCA', href: '/automatizaciones/' },
];

const capabilityGroups = [
 {title:'Sistemas y operación', paths:['/sistemas-a-medida/','/mantenimiento-de-equipos/']},
 {title:'Datos y conexiones', paths:['/dashboards-ejecutivos/','/contaflow-api-facturacion-electronica/','/integraciones-whatsapp/']},
 {title:'Automatización e IA', paths:['/automatizacion-de-procesos/','/inteligencia-artificial/','/automatizaciones/','/talleres-ia/']},
 {title:'Experiencias web', paths:['/desarrollo-web/']},
].map(group=>({...group,items:serviceLinks.filter(item=>group.paths.includes(item.href))}));
watch(() => [props.open, props.section], async ([open]) => {
  if (!open) return;
  await nextTick();
  let id = props.section;
  if (!id) { try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = ''; } }
  if (id === 'soluciones') id = 'servicios';
  const target = id && panel.value?.querySelector(`#${CSS.escape(id)}`);
  if (target) { target.scrollIntoView({block:'start',behavior:'instant'}); target.focus({preventScroll:true}); }
  else closeButton.value?.focus({preventScroll:true});
}, {immediate:true});

function trap(event) {
  if (event.key === 'Escape') { event.stopPropagation(); emit('close'); return; }
  if (event.key !== 'Tab') return;
  const focusables = [...panel.value.querySelectorAll('a[href],button:not([disabled]),input,select,textarea')].filter((el) => el.offsetParent !== null);
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}
</script>
<template>
  <Transition name="info">
    <div v-if="open" class="info-layer" :class="{'is-portfolio':portfolio}" @keydown="trap">
      <div class="info-backdrop" @click="emit('close')"></div>
      <aside id="info-panel" ref="panel" class="info-sheet" role="dialog" aria-modal="true" aria-label="Información de Vogel Consultoría">
        <button ref="closeButton" type="button" class="info-close" aria-label="Cerrar" @click="emit('close')">Cerrar <span aria-hidden="true">×</span></button>

        <a v-if="portfolio" class="info-brand" href="/">Vogel Consultoría</a>
        <section id="info" tabindex="-1" class="info-block info-lead">
          <p class="info-label">Vogel Consultoría</p>
          <p class="info-statement">Convertimos datos y procesos en decisiones que mejoran tu rentabilidad.</p>
          <p class="info-note">No vendemos software. Resolvemos problemas.</p>
        </section>

        <section id="contacto" tabindex="-1" class="info-block" aria-labelledby="info-contacto" data-analytics-view="contact_section" data-analytics-funnel="lead_journey" data-analytics-step="contact">
          <h2 id="info-contacto" class="info-label">Contacto</h2>
          <p class="info-statement info-statement--sm">Contanos dónde se traba el trabajo. Definimos un próximo paso con alcance claro.</p>
          <div class="info-actions">
            <a class="info-btn is-accent" href="mailto:oscar@vogelconsultoria.com.ar?subject=Quiero%20agendar%20un%20diagn%C3%B3stico" data-analytics-cta="contact_email_schedule" data-analytics-funnel="lead_journey" data-analytics-step="contact">Agendar diagnóstico →</a>
            <a class="info-btn" href="https://wa.me/543743667526?text=Hola%20quiero%20agendar%20una%20reuni%C3%B3n" target="_blank" rel="noopener noreferrer" data-analytics-cta="contact_whatsapp_schedule" data-analytics-funnel="lead_journey" data-analytics-step="contact">WhatsApp →</a>
          </div>
          <p class="info-note"><a href="mailto:oscar@vogelconsultoria.com.ar">oscar@vogelconsultoria.com.ar</a> · +54 3743 66-7526</p>

          <div v-if="state === 'success'" ref="successMessage" tabindex="-1" class="form-success" role="status" aria-live="polite">
            <p class="info-name">¡Consulta enviada!</p>
            <p>Te respondemos a la brevedad con un plan inicial.</p>
            <button type="button" class="info-link" @click="resetForm">Enviar otra consulta</button>
          </div>
          <form v-else class="info-form" aria-label="Formulario de contacto" aria-describedby="info-contacto-datos-notice" :aria-busy="state === 'loading'" data-analytics-cta="contact_form_main" data-analytics-funnel="lead_journey" data-analytics-step="contact" @submit.prevent="handleSubmit">
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
            <p id="info-contacto-datos-notice" class="info-form-privacy">Al enviar, tu nombre, email, mensaje y teléfono opcional se transmiten a Web3Forms para que podamos responderte. Evitá incluir información sensible.</p>
            <p v-if="state === 'error'" class="form-error" role="alert">Hubo un problema al enviar. Intentá de nuevo o escribinos por WhatsApp.</p>
            <button type="submit" class="info-btn is-accent" :disabled="state === 'loading'">{{ state === 'loading' ? 'Enviando…' : 'Enviar consulta →' }}</button>
          </form>
        </section>

        <section id="servicios" tabindex="-1" class="info-block" aria-labelledby="info-servicios">
          <h2 id="info-servicios" class="info-label">Servicios</h2>
          <div v-for="group in capabilityGroups" :key="group.title" class="capability-group"><h3>{{group.title}}</h3><ul class="info-list"><li v-for="item in group.items" :key="item.href"><a :href="item.href">{{item.label}}</a></li></ul></div>
        </section>

        <section id="metodologia" tabindex="-1" class="info-block" aria-labelledby="info-metodo">
          <h2 id="info-metodo" class="info-label">Método Vogel</h2>
          <ol class="info-method">
            <li v-for="step in methodSteps" :key="step.id"><span>{{ step.number }}</span><div><strong>{{ step.label }}</strong><p>{{ step.text }}</p></div></li>
          </ol>
        </section>

        <section id="nosotros" tabindex="-1" class="info-block info-person" aria-labelledby="info-nosotros">
          <img :src="portrait480" :srcset="`${portrait480} 480w, ${portrait720} 720w`" sizes="160px" alt="Oscar Vogel" width="160" height="200" loading="lazy" />
          <div>
            <h2 id="info-nosotros" class="info-label">Quién está detrás</h2>
            <p class="info-name">{{ oscarProfile.name }}</p>
            <p>{{ oscarProfile.role }}, con +{{ oscarProfile.years }} años de experiencia en sistemas de gestión, facturación y automatización. Participa directamente en cada proyecto.</p>
            <a :href="oscarProfile.cv" target="_blank" rel="noopener noreferrer">Ver CV</a>
          </div>
        </section>

        <section id="recursos" tabindex="-1" class="info-block" aria-labelledby="info-recursos">
          <h2 id="info-recursos" class="info-label">Recursos</h2>
          <ul class="info-list">
            <li v-for="item in resources" :key="item.id"><a :href="item.path">{{ item.shortTitle }}</a></li>
            <li><a href="/recursos/">Todos los recursos</a></li>
            <li><a href="/talleres-ia/">Talleres y capacitación en IA</a></li>
          </ul>
        </section>


        <section id="femag" tabindex="-1" class="info-block">
          <h2 class="info-label">FEMAG · En desarrollo</h2>
          <p>Proyecto en desarrollo. Su presentación estará disponible cuando exista material publicado.</p>
        </section>
        <footer class="info-foot">
          <a href="https://portal.vogelconsultoria.com.ar" target="_blank" rel="noopener noreferrer" data-analytics-cta="navbar_portal_access_desktop">Ingresar al portal</a>
          <a href="https://www.instagram.com/vogelconsultoria.ar/" target="_blank" rel="noopener noreferrer" data-analytics-cta="footer_instagram" data-analytics-funnel="social_follow" data-analytics-step="footer">Instagram</a>
          <a href="https://www.linkedin.com/company/123134273/" target="_blank" rel="noopener noreferrer" data-analytics-cta="footer_linkedin" data-analytics-funnel="social_follow" data-analytics-step="footer">LinkedIn</a>
        </footer>
      </aside>
    </div>
  </Transition>
</template>
<style scoped>
.info-brand{z-index:2;position:fixed;left:24px;top:20px;min-height:44px;display:flex;align-items:center;font-size:14px}
.capability-group{margin-top:32px}.capability-group h3{font-size:13px;color:var(--color-muted);margin-bottom:8px}
.info-layer{position:fixed;inset:0;z-index:80}
.info-backdrop{position:absolute;inset:0;background:var(--color-background);}
.info-sheet{position:absolute;top:0;right:0;bottom:0;width:min(640px,100vw);overflow-y:auto;overscroll-behavior:contain;background:rgb(var(--vogel-navy));border-left:1px solid var(--color-border);padding:24px clamp(20px,4vw,48px) 48px;color:var(--color-text)}
.info-close{position:sticky;top:0;display:flex;margin:0 0 8px auto;min-height:44px;align-items:center;gap:10px;padding:0 14px;border-radius:8px;background:rgb(var(--vogel-slate));font-size:13px;color:var(--color-heading);z-index:2}
.info-block{padding-block:28px;border-top:1px solid var(--color-border)}
.info-block:first-of-type{border-top:0}
.info-label{margin:0 0 16px;font-family:var(--font-body);font-size:12px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--color-muted)}
.info-statement{margin:0;font-family:var(--font-display);font-stretch:var(--display-stretch);font-weight:var(--display-weight);font-size:clamp(1.5rem,3.4vw,2.2rem);line-height:1.08;letter-spacing:-.035em;text-transform:uppercase;color:var(--color-heading)}
.info-statement--sm{font-size:clamp(1.1rem,2.4vw,1.4rem);margin-bottom:20px}
.info-note{margin:16px 0 0;font-size:14px;color:var(--color-muted)}
.info-list{list-style:none;margin:0;padding:0}
.info-list a{display:flex;min-height:44px;align-items:center;justify-content:space-between;border-bottom:1px solid var(--color-border);font-size:18px;color:var(--color-heading);transition:color 160ms,padding 200ms var(--ease-out)}
.info-list a:hover,.info-list a:focus-visible{color:rgb(var(--vogel-amber));padding-left:8px}
.info-method{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.info-method li{display:grid;grid-template-columns:34px 1fr;gap:12px;font-size:15px}
.info-method span{color:rgb(var(--vogel-amber));font-variant-numeric:tabular-nums}
.info-method p{margin:2px 0 0;color:var(--color-muted)}
.info-person{display:grid;grid-template-columns:120px 1fr;gap:20px;align-items:start;font-size:15px;line-height:1.6}
.info-person img{width:120px;height:auto;aspect-ratio:4/5;object-fit:cover;border-radius:10px}
.info-name{margin:0 0 6px;font-size:18px;font-weight:600;color:var(--color-heading)}
.info-person a,.info-note a,.info-link{color:rgb(var(--vogel-amber));text-decoration:underline;text-underline-offset:.24em}
.info-actions{display:flex;flex-wrap:wrap;gap:10px}
.info-btn{display:inline-flex;min-height:48px;align-items:center;justify-content:center;padding:0 22px;border:1px solid var(--color-border);border-radius:8px;font-size:15px;font-weight:600;color:var(--color-heading);transition:background 160ms,color 160ms}
.info-btn.is-accent{background:rgb(var(--vogel-amber));border-color:rgb(var(--vogel-amber));color:rgb(var(--vogel-navy))}
.info-btn:hover{background:rgb(var(--vogel-slate))}.info-btn.is-accent:hover{background:rgb(var(--vogel-white))}
.info-btn:disabled{opacity:.6}
.info-form{display:grid;gap:8px;margin-top:28px}
.info-form-privacy{margin:4px 0 8px;color:var(--color-muted);font-size:12px;line-height:1.55}
.info-form label{font-size:13px;color:var(--color-muted);margin-top:8px}.info-form label span{opacity:.8}
.info-form input,.info-form textarea{width:100%;min-height:48px;padding:12px 14px;border:1px solid var(--color-border);border-radius:8px;background:rgb(var(--vogel-deep));color:var(--color-heading);font-family:inherit}
.info-form .info-btn{margin-top:14px}
.form-error{margin:8px 0 0;color:var(--color-error);font-size:14px}
.form-success{margin-top:28px;padding:20px;border:1px solid var(--color-border);border-radius:10px}
.info-foot{display:flex;flex-wrap:wrap;gap:20px;padding-top:28px;border-top:1px solid var(--color-border);font-size:14px}
.info-foot a{color:var(--color-muted)}.info-foot a:hover{color:var(--color-heading)}
.info-enter-active,.info-leave-active{transition:opacity 280ms ease}
.info-enter-active .info-sheet,.info-leave-active .info-sheet{transition:transform 420ms var(--ease-out)}
.info-enter-from,.info-leave-to{opacity:0}
.info-enter-from .info-sheet,.info-leave-to .info-sheet{transform:translateX(24%)}

.is-portfolio .info-sheet{width:100%;padding:88px 24px 48px max(44vw,24px);border:0;background:var(--color-background)}
.is-portfolio .info-sheet::before{content:"";position:fixed;inset:0 0 auto;height:82px;background:var(--color-background);z-index:1}
.is-portfolio .info-close{position:fixed;right:24px;top:20px;margin:0;background:#3b3933}
.is-portfolio .info-block{padding:32px;background:#262523;border:0;border-radius:12px;margin-bottom:24px;scroll-margin-top:88px}
.is-portfolio .info-lead{background:#3b3933;min-height:280px;display:flex;flex-direction:column;justify-content:center}
.is-portfolio .info-statement{font-size:clamp(25px,3vw,48px)}
.is-portfolio .info-statement--sm{font-size:clamp(20px,2vw,30px)}
@media(max-width:767px){.is-portfolio .info-sheet{padding:88px 16px 32px}.is-portfolio .info-block{padding:24px}.info-person{grid-template-columns:1fr}.info-person img{width:120px}.info-list a{font-size:16px}}
@media(prefers-reduced-motion:reduce){.info-enter-active,.info-leave-active,.info-enter-active .info-sheet,.info-leave-active .info-sheet{transition:none}}
</style>
