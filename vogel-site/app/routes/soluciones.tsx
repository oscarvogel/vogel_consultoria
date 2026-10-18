import { servicePages } from '../content/servicePages.js'
import PageHero from '../components/PageHero'
import Contacto from '../sections/Contacto'
import { pageMeta } from '../lib/meta'

export const meta = () =>
  pageMeta({
    title: 'Soluciones — Vogel Consultoría',
    description: 'Sistemas, automatización, datos e inteligencia artificial para empresas que necesitan trabajar con más control.',
    path: '/soluciones/',
    crumbs: [],
    name: 'Soluciones',
  })

type Service = { path: string; shortTitle: string; summary: string }
const pages = Object.values(servicePages) as Service[]
const extra: Record<string, Service> = {
  '/inteligencia-artificial/': { path: '/inteligencia-artificial/', shortTitle: 'Inteligencia artificial', summary: 'Definimos qué tarea puede asistir la IA, qué información necesita y cómo revisa el equipo cada resultado.' },
  '/automatizaciones/': { path: '/automatizaciones/', shortTitle: 'Automatizaciones ARCA', summary: 'Organizamos la descarga mensual de retenciones y percepciones por cliente delegado, con revisión del estudio y evidencia por CUIT.' },
}
const byPath = (path: string) => pages.find((p) => p.path === path) ?? extra[path]

// Grouping from the Vue site's InfoPanel capabilityGroups.
const groups = [
  { title: 'Sistemas y operación', paths: ['/sistemas-a-medida/', '/mantenimiento-de-equipos/'] },
  { title: 'Datos y conexiones', paths: ['/dashboards-ejecutivos/', '/contaflow-api-facturacion-electronica/', '/integraciones-whatsapp/'] },
  { title: 'Automatización e IA', paths: ['/automatizacion-de-procesos/', '/inteligencia-artificial/', '/automatizaciones/', '/talleres-ia/'] },
  { title: 'Experiencias web', paths: ['/desarrollo-web/'] },
]

export default function Soluciones() {
  return (
    <>
      <PageHero
        eyebrow="Soluciones"
        title="Soluciones que ordenan el trabajo."
        lead="Sistemas, automatización, datos e IA para empresas que necesitan trabajar con más control y mejores decisiones."
      />
      {groups.map((g, gi) => (
        <section key={g.title} aria-labelledby={`grupo-${gi}`} className="grid gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-12 lg:px-12">
          <h2 id={`grupo-${gi}`} className="eyebrow pt-8 font-sans text-muted [font-stretch:100%] lg:col-span-3" data-anim="fade">{g.title}</h2>
          <ul className="border-t border-line lg:col-span-9" data-anim="stagger">
            {g.paths.map(byPath).map((s) => (
              <li key={s.path} className="border-b border-line">
                <a href={s.path} className="cursor-target group grid gap-3 py-8 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10" data-cursor-label="Ver">
                  <div>
                    <p className="display text-[clamp(1.5rem,3vw,3rem)] transition-colors duration-500 group-hover:text-amber">{s.shortTitle}</p>
                    <p className="mt-3 max-w-2xl text-cream/70">{s.summary}</p>
                  </div>
                  <span aria-hidden="true" className="text-2xl text-amber transition-transform duration-500 group-hover:translate-x-2">→</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <Contacto title="¿No sabés qué solución encaja?" text="Contanos qué necesitás resolver y te ayudamos a definir el primer paso." />
    </>
  )
}
