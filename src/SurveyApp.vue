<template>
  <div class="min-h-screen overflow-x-hidden">
    <a class="skip-link" href="#survey-content">Saltar al contenido principal</a>

    <header class="border-b border-white/10 bg-vogel-deep/90 backdrop-blur" role="banner">
      <div class="section-shell flex h-18 items-center justify-between">
        <a href="/" class="flex items-center gap-3" aria-label="Volver a Vogel Consultoria">
          <img :src="logoVogel" alt="Logo Vogel Consultoria" class="h-10 w-auto rounded-sm" loading="eager" decoding="async" />
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.12em] text-vogel-gray">Vogel Consultoria</p>
            <p class="hidden text-xs text-vogel-gray/70 sm:block">Recursos para estudios contables</p>
          </div>
        </a>

        <a
          href="https://wa.me/543743667526?text=Hola%20Oscar%2C%20participe%20de%20la%20charla%20para%20contadores%20y%20quiero%20consultar%20por%20una%20demo"
          class="inline-flex min-h-11 items-center rounded-lg border border-vogel-amber/60 px-4 text-sm font-semibold text-vogel-amber transition hover:bg-vogel-amber hover:text-vogel-deep"
          data-analytics-cta="survey_header_whatsapp"
          data-analytics-funnel="accountants_survey"
          data-analytics-step="header"
        >
          Consultar demo
        </a>
      </div>
    </header>

    <main id="survey-content" role="main" tabindex="-1">
      <section class="relative py-12 sm:py-16 lg:py-20" data-analytics-view="survey_hero" data-analytics-funnel="accountants_survey" data-analytics-step="intro">
        <div class="absolute inset-0 -z-10 bg-grid-soft bg-[length:44px_44px] opacity-45"></div>
        <div class="section-shell grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div class="max-w-2xl">
            <p class="fade-up inline-flex rounded-full border border-vogel-amber/35 bg-vogel-amber/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-vogel-amber">
              Post charla para contadores
            </p>
            <h1 class="fade-up mt-6 max-w-2xl font-body text-3xl font-bold leading-[1.14] text-white sm:text-4xl lg:text-5xl">
              Gracias por participar. Tu opinion nos ayuda a preparar mejores herramientas.
            </h1>
            <p class="fade-up-delay mt-5 max-w-xl text-lg leading-8 text-vogel-gray">
              Son menos de dos minutos. Ademas podes suscribirte al newsletter de Vogel Consultoria para recibir novedades, recursos para estudios contables y prompts de IA aplicados al trabajo diario.
            </p>

            <div class="mt-7 flex max-w-xl flex-col gap-4 rounded-lg border border-white/12 bg-white/[0.045] p-4 sm:flex-row sm:items-center">
              <a
                href="https://www.consejomisiones.org.ar/"
                target="_blank"
                rel="noopener noreferrer"
                class="flex h-16 w-28 shrink-0 items-center justify-center rounded-md bg-white p-3 transition hover:bg-vogel-gray"
                aria-label="Visitar sitio del CPCE Misiones"
              >
                <img src="/logo-cpce.png" alt="Logo CPCE Misiones" class="max-h-10 w-auto" loading="lazy" decoding="async" />
              </a>
              <div>
                <p class="text-sm font-bold uppercase tracking-[0.16em] text-vogel-amber">Actividad realizada</p>
                <p class="mt-1 text-sm leading-6 text-vogel-gray">
                  Esta encuesta acompana la charla para contadores dictada junto al CPCE Misiones.
                </p>
                <a
                  href="https://wa.me/543743667526?text=Hola%20Oscar%2C%20quiero%20recibir%20informacion%20para%20dictar%20una%20charla%20de%20IA%20para%20una%20institucion%20o%20empresa"
                  class="mt-3 inline-flex text-sm font-bold text-vogel-amber underline-offset-4 hover:text-white hover:underline"
                  data-analytics-cta="survey_institution_talk_info"
                  data-analytics-funnel="accountants_survey"
                  data-analytics-step="intro"
                >
                  Solicitar informacion para una institucion o empresa
                </a>
              </div>
            </div>

            <div class="mt-8 grid gap-3 sm:grid-cols-3">
              <div v-for="metric in metrics" :key="metric.label" class="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p class="text-2xl font-extrabold text-white">{{ metric.value }}</p>
                <p class="mt-1 text-sm text-vogel-muted">{{ metric.label }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-white/12 bg-[#f8fafc] p-2 text-vogel-deep shadow-glow-lg">
            <iframe
              v-if="embedUrl"
              :src="embedUrl"
              title="Encuesta breve para contadores"
              class="h-[760px] w-full rounded-md bg-white"
              loading="lazy"
            ></iframe>

            <div v-else class="rounded-md bg-white p-6 sm:p-8">
              <p class="text-sm font-bold uppercase tracking-[0.18em] text-vogel-blue">Formulario listo para conectar</p>
              <h2 class="mt-3 text-2xl font-extrabold text-vogel-deep">Falta pegar el link de Google Forms</h2>
              <p class="mt-3 leading-7 text-slate-700">
                Esta pagina ya esta preparada para enviar a los contadores. Cuando tengas el formulario, pega el enlace de insercion en <code class="rounded bg-slate-100 px-1.5 py-0.5">VITE_CONTADORES_SURVEY_EMBED_URL</code>.
              </p>

              <a
                v-if="formUrl"
                :href="formUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-6 inline-flex min-h-12 items-center rounded-lg bg-vogel-blue px-5 text-sm font-bold text-white transition hover:bg-vogel-bright"
                data-analytics-cta="survey_open_google_form"
                data-analytics-funnel="accountants_survey"
                data-analytics-step="form"
              >
                Abrir encuesta
              </a>

              <div class="mt-7 border-t border-slate-200 pt-6">
                <h3 class="text-base font-extrabold text-vogel-deep">Preguntas sugeridas</h3>
                <ol class="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
                  <li v-for="question in questions" :key="question" class="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    {{ question }}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="border-y border-white/10 bg-white/[0.035] py-10">
        <div class="section-shell grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p class="text-sm font-bold uppercase tracking-[0.18em] text-vogel-amber">Newsletter</p>
            <h2 class="mt-3 text-3xl font-extrabold text-white">Informacion practica para estudios contables.</h2>
          </div>
          <div class="grid gap-3 sm:grid-cols-3">
            <div v-for="topic in newsletterTopics" :key="topic.title" class="rounded-lg border border-white/10 bg-vogel-navy/50 p-5">
              <p class="text-base font-bold text-white">{{ topic.title }}</p>
              <p class="mt-2 text-sm leading-6 text-vogel-muted">{{ topic.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="py-8">
      <div class="section-shell flex flex-col gap-3 text-sm text-vogel-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Vogel Consultoria - Argentina</p>
        <div class="flex flex-wrap gap-4">
          <a href="/" class="hover:text-white">Inicio</a>
          <a href="mailto:oscarvogel@gmail.com" class="hover:text-white" data-analytics-cta="survey_footer_email">oscarvogel@gmail.com</a>
          <a
            href="https://www.instagram.com/vogelconsultoria.ar/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-white"
            data-analytics-cta="survey_footer_instagram"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/123134273/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-white"
            data-analytics-cta="survey_footer_linkedin"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import logoVogel from "./assets/brand/logo-vogel-generated.webp";

const defaultFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeaiBYhag8RyIfKPR_80svwIHljgIxQY5OBT7LkxkBlRrWXfQ/viewform?usp=send_form";
const defaultEmbedUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeaiBYhag8RyIfKPR_80svwIHljgIxQY5OBT7LkxkBlRrWXfQ/viewform?embedded=true";

const formUrl = import.meta.env.VITE_CONTADORES_SURVEY_FORM_URL?.trim() || defaultFormUrl;
const embedUrl = import.meta.env.VITE_CONTADORES_SURVEY_EMBED_URL?.trim() || defaultEmbedUrl;

const metrics = [
  { value: "2 min", label: "Tiempo estimado" },
  { value: "7", label: "Preguntas breves" },
  { value: "1 link", label: "Para responder" },
];

const questions = [
  "Que tan util te resulto la charla? Escala del 1 al 5.",
  "Que parte te intereso mas? Automatizacion ARCA, facturacion electronica, descarga de comprobantes, informes para clientes u otro.",
  "Te gustaria ver una demo mas personalizada para tu estudio? Si, tal vez o no por ahora.",
  "Cuantos clientes manejan aproximadamente en el estudio? 1-20, 21-50, 51-100 o mas de 100.",
  "Cual seria el mayor beneficio para tu estudio?",
  "Queres suscribirte al newsletter de Vogel Consultoria?",
  "Correo para newsletter o contacto. Puede ser tu correo profesional o el correo del estudio.",
];

const newsletterTopics = [
  {
    title: "ARCA y procesos",
    description: "Ideas para reducir tareas repetitivas en estudios contables.",
  },
  {
    title: "Prompts de IA",
    description: "Ejemplos listos para adaptar en informes, mails y analisis.",
  },
  {
    title: "Recursos utiles",
    description: "Novedades, demos y materiales aplicables al dia a dia.",
  },
];
</script>
