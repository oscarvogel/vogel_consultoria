<template>
  <section id="nosotros" class="py-20 sm:py-24" aria-labelledby="nosotros-heading">
    <div class="section-shell">
      <div class="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div class="reveal rounded-3xl border border-vogel-gray/20 bg-vogel-deep/70 p-8 shadow-glow sm:p-10">
          <SectionHeading id="nosotros-heading" eyebrow="Quién soy" title="Oscar Vogel, tecnología con criterio de negocio" />
          <p class="mt-5 text-base leading-relaxed text-vogel-gray/90">
            Soy desarrollador de software y consultor tecnológico con más de 25 años de experiencia implementando
            sistemas de gestión, facturación, automatizaciones y soluciones web para empresas. En Vogel Consultoría
            combino desarrollo, administración y capacitación para ordenar procesos y convertir información dispersa
            en decisiones útiles.
          </p>
          <p class="mt-4 text-base leading-relaxed text-vogel-muted">
            Trabajo sobre necesidades reales de operación: ventas, administración, trazabilidad, reportes, integración
            de bases de datos, modernización de sistemas existentes e inteligencia artificial aplicada con criterio.
          </p>

          <div class="mt-7 flex flex-wrap gap-3">
            <ActionButton
              label="Descargar CV"
              href="/cv-jose-oscar-vogel.pdf"
              variant="accent"
              data-analytics-cta="about_download_cv"
              data-analytics-funnel="lead_journey"
              data-analytics-step="about"
            />
            <ActionButton
              label="Agendar reunión"
              href="#contacto"
              variant="secondary"
              data-analytics-cta="about_schedule_meeting"
              data-analytics-funnel="lead_journey"
              data-analytics-step="about"
            />
          </div>
        </div>

        <div class="reveal reveal-d2 rounded-3xl border border-vogel-amber/30 bg-gradient-to-br from-vogel-blue/15 to-vogel-navy p-8 sm:p-10">
          <p class="font-display text-2xl font-bold leading-snug text-vogel-amber sm:text-3xl">
            "No vendemos software.<br />Resolvemos problemas."
          </p>
          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            <div v-for="metric in metrics" :key="metric.label" class="rounded-2xl border border-vogel-gray/15 bg-white/[0.04] p-4">
              <p class="font-display text-2xl font-bold text-white">{{ metric.value }}</p>
              <p class="mt-1 text-sm leading-relaxed text-vogel-muted">{{ metric.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="reveal reveal-d3 rounded-3xl border border-vogel-gray/15 bg-white/[0.04] p-8">
          <h3 class="font-display text-xl font-bold text-white">Especialidades</h3>
          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="skill in skills"
              :key="skill"
              class="rounded-full border border-vogel-blueLight/25 bg-vogel-blue/10 px-3 py-2 text-sm font-semibold text-vogel-gray"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <div class="reveal reveal-d4 rounded-3xl border border-vogel-gray/15 bg-white/[0.04] p-8">
          <h3 class="font-display text-xl font-bold text-white">Experiencia que se traduce en implementación</h3>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <article v-for="item in experience" :key="item.title" class="border-l border-vogel-amber/50 pl-4">
              <p class="text-sm font-semibold uppercase tracking-[0.14em] text-vogel-amber">{{ item.period }}</p>
              <h4 class="mt-2 font-semibold text-white">{{ item.title }}</h4>
              <p class="mt-2 text-sm leading-relaxed text-vogel-muted">{{ item.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ActionButton from "./ActionButton.vue";
import SectionHeading from "./SectionHeading.vue";

const metrics = [
  { value: "+25 años", label: "desarrollando e implementando sistemas de gestión" },
  { value: "Python, Django y MySQL", label: "stack principal para soluciones web y operativas" },
  { value: "PyFE", label: "facturación electrónica open source publicada en GitHub" },
  { value: "IA aplicada", label: "charlas y capacitación para contadores, gerentes y equipos" },
];

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
