<template>
  <section data-home-chapter="about" id="nosotros" class="home-section home-about" aria-labelledby="nosotros-heading">
    <LandscapeTraces variant="trajectory" />
    <div class="section-shell">
      <div data-chapter-outro class="about-intro">
        <div>
          <p class="home-business-label">Tecnología con criterio de negocio</p><h2 id="nosotros-heading" class="section-title">Oscar Vogel.</h2>
          <p class="section-description">Oscar Vogel es desarrollador de software y consultor tecnológico. Cuenta con más de 25 años de experiencia en sistemas de gestión, facturación, automatización y soluciones web.</p>
          <p class="about-body">Oscar participa directamente en los proyectos de Vogel Consultoría: releva procesos, diseña soluciones y acompaña su implementación. El trabajo integra desarrollo, administración y capacitación para ordenar ventas, trazabilidad, reportes e información dispersa.</p>
          <div class="about-actions">
            <ActionButton label="Descargar CV" href="/cv-jose-oscar-vogel.pdf" variant="secondary" data-analytics-cta="about_download_cv" data-analytics-funnel="lead_journey" data-analytics-step="about" />
            <ActionButton label="Agendar diagnóstico" href="#contacto" variant="secondary" data-analytics-cta="about_schedule_meeting" data-analytics-funnel="lead_journey" data-analytics-step="about" />
          </div>
        </div>
        <div class="about-credentials">
          <img v-if="portraitSrc" :src="portraitSrc" alt="Oscar Vogel, consultor tecnológico" class="about-portrait" width="720" height="900" loading="lazy" decoding="async" />
          <p class="home-experience-number">+25<span>años</span></p><p class="about-quote">Sistemas que acompañan el trabajo real.</p>
          <dl>

            <div><dt>PyFE</dt><dd>Facturación electrónica open source publicada en GitHub.</dd></div>
            <div><dt>Formación aplicada</dt><dd>Charlas y capacitación para contadores, gerentes y equipos.</dd></div>
          </dl>
        </div>
      </div>
      <details class="home-detail"><summary>Ver capacidades y trayectoria de Oscar</summary>
        <div class="about-detail">
          <div>
            <h3>Capacidades técnicas</h3>
            <ul class="about-skills"><li v-for="skill in skills" :key="skill">{{ skill }}</li></ul>
          </div>
          <div>
            <h3>Experiencia profesional</h3>
            <div class="about-experience">
              <article v-for="item in experience" :key="item.title">
                <p class="about-period">{{ item.period }}</p>
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
              </article>
            </div>
          </div>
        </div>
      </details>
    </div>
  </section>
</template>
<script setup>
import ActionButton from "./ActionButton.vue";
import LandscapeTraces from './LandscapeTraces.vue';

// A supplied real portrait can be added without leaving an empty placeholder today.
defineProps({ portraitSrc: { type: String, default: '' } });
const skills = [
  "Python",
  "Django",
  "Django REST Framework",
  "MySQL",
  "Visual FoxPro",
  "PyQt",
  "Facturación electrónica",
  "APIs REST",
  "Dashboards",
  "Automatización",
  "Ecommerce",
  "Capacitación técnica",
];

const experience = [
  {
    period: "2024 - actualidad",
    title: "Ferretería Avenida S.A.",
    description: "Desarrollo y mantenimiento de soluciones internas en Python, Django, DRF y MySQL para gestión, ventas y administración.",
  },
  {
    period: "2021 - 2024",
    title: "Forestal Garuhapé S.A.",
    description: "Administración, servicios y desarrollo de sistemas internos para acompañar procesos operativos y soporte a usuarios.",
  },
  {
    period: "2008 - 2021",
    title: "Responsable de sistemas",
    description: "Implementación de sistema de ventas y facturación con Visual FoxPro y MySQL, más herramientas internas en Python y Django.",
  },
  {
    period: "1998 - 2003",
    title: "Docencia y dirección en informática",
    description: "Formación en programación, sistemas de procesamiento de datos y capacitación técnica, base clave para acompañar equipos.",
  },
];
</script>
