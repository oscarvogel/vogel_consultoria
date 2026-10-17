import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import { whatsappUrl } from '../content/site'
import { pageMeta } from '../lib/meta'

export const meta = () =>
  pageMeta({
    title: 'Encuesta para Contadores | Vogel Consultoría',
    description: 'Encuesta breve posterior a la charla de Vogel Consultoría para contadores. Opinión, intereses, newsletter y contacto para demos personalizadas.',
    path: '/encuesta-contadores/',
    crumbs: [],
    name: 'Encuesta para contadores',
    robots: 'noindex, follow',
  })

// Same Google Form as the Vue SurveyApp, overridable by the same env vars.
const formUrl = import.meta.env.VITE_CONTADORES_SURVEY_FORM_URL?.trim() || 'https://docs.google.com/forms/d/e/1FAIpQLSeaiBYhag8RyIfKPR_80svwIHljgIxQY5OBT7LkxkBlRrWXfQ/viewform?usp=send_form'
const embedUrl = import.meta.env.VITE_CONTADORES_SURVEY_EMBED_URL?.trim() || 'https://docs.google.com/forms/d/e/1FAIpQLSeaiBYhag8RyIfKPR_80svwIHljgIxQY5OBT7LkxkBlRrWXfQ/viewform?embedded=true'
const metrics = [['2 min', 'Tiempo estimado'], ['7', 'Preguntas'], ['Opcional', 'Correo de contacto']]
const topics = [
  { title: 'ARCA y procesos', description: 'Ideas para reducir tareas repetitivas en estudios contables.' },
  { title: 'Prompts de IA', description: 'Ejemplos listos para adaptar en informes, mails y análisis.' },
  { title: 'Recursos útiles', description: 'Novedades, demos y materiales aplicables al día a día.' },
]

export default function Encuesta() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'slow'>('loading')

  useEffect(() => {
    const timer = window.setTimeout(() => setStatus((s) => (s === 'loading' ? 'slow' : s)), 8000)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <PageHero
        eyebrow="Post charla para contadores"
        title="Gracias por participar."
        lead="Tu opinión nos ayuda a preparar mejores herramientas. Son unos dos minutos, y podés suscribirte al newsletter para recibir recursos para estudios contables y prompts de IA aplicados al trabajo diario."
      >
        <a className="btn cursor-target" href={whatsappUrl('Hola Oscar, participe de la charla para contadores y quiero consultar por una demo')} target="_blank" rel="noopener">Consultar demo <span aria-hidden="true">↗</span></a>
        <a className="ink-link" href={formUrl} target="_blank" rel="noopener">Abrir encuesta en otra pestaña <span aria-hidden="true">↗</span></a>
      </PageHero>

      <section aria-label="Encuesta" className="grid gap-12 px-5 pb-24 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-4">
          <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6 lg:grid-cols-1">
            {metrics.map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-2xl font-extrabold">{v}</dd>
                <dd className="text-sm text-muted">{l}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex items-center gap-5 rounded-lg border border-line p-5">
            <a href="https://www.consejomisiones.org.ar/" target="_blank" rel="noopener" aria-label="Visitar sitio del CPCE Misiones" className="flex h-16 w-28 shrink-0 items-center justify-center rounded bg-white p-3">
              <img src="/logo-cpce.png" alt="Logo CPCE Misiones" className="max-h-10 w-auto" loading="lazy" />
            </a>
            <div>
              <p className="eyebrow text-amber">Actividad realizada</p>
              <p className="mt-2 text-sm text-cream/75">Esta encuesta acompaña la charla para contadores dictada junto al CPCE Misiones.</p>
              <a className="ink-link mt-3 text-sm" href={whatsappUrl('Hola Oscar, quiero recibir información para dictar una charla de IA para una institución o empresa')} target="_blank" rel="noopener">Charla para una institución o empresa</a>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-cream p-2 text-ink-dark lg:col-span-8">
          <p role="status" aria-live="polite" className="p-3 text-sm">
            {status === 'slow' ? 'La encuesta está tardando en responder. Podés abrirla directamente en Google Forms.' : status === 'loading' ? 'Conectando con Google Forms…' : 'La encuesta está disponible en este bloque.'}
          </p>
          <iframe src={embedUrl} title="Encuesta breve para contadores" onLoad={() => setStatus('ready')} aria-busy={status === 'loading'} className="h-[760px] min-h-[680px] w-full rounded bg-white" />
          <p className="px-3 pb-3 text-xs text-ink-dark-muted">Son 7 preguntas. El correo para newsletter o contacto es opcional.</p>
        </div>
      </section>

      <section aria-labelledby="newsletter-titulo" className="grid gap-10 border-t border-line px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-muted">Newsletter</p>
          <h2 id="newsletter-titulo" className="mt-5 text-[clamp(1.6rem,3vw,2.75rem)]">Información práctica para estudios contables.</h2>
        </div>
        <ul className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
          {topics.map((t) => (
            <li key={t.title} className="rounded-lg border border-line p-6">
              <p className="display text-lg">{t.title}</p>
              <p className="mt-2 text-sm text-cream/70">{t.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
