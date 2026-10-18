import { resources } from '../content/resources.js'
import PageHero from '../components/PageHero'
import Contacto from '../sections/Contacto'
import { pageMeta } from '../lib/meta'
import { formatDate } from '../lib/format'

export const meta = () =>
  pageMeta({
    title: 'Recursos para Empresas | Sistemas, Dashboards e IA | Vogel',
    description: 'Guías prácticas de Vogel Consultoría para decidir sobre sistemas a medida, dashboards ejecutivos, automatización de procesos e IA aplicada.',
    path: '/recursos/',
    crumbs: [],
    name: 'Recursos',
    graph: [{ '@type': 'CollectionPage', name: 'Recursos para empresas', url: 'https://vogelconsultoria.com.ar/recursos/', mainEntity: { '@type': 'ItemList', itemListElement: resources.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://vogelconsultoria.com.ar${r.path}`, name: r.title })) } }],
  })


export default function Recursos() {
  return (
    <>
      <PageHero
        eyebrow="Recursos"
        title="Guías para decidir con claridad."
        lead="Ideas prácticas para ordenar tecnología, datos e IA en empresas. Un punto de partida para detectar oportunidades y definir prioridades antes de invertir."
      />
      <section aria-label="Guías" className="px-5 pb-28 sm:px-8 lg:px-12">
        <ol className="border-t border-line" data-anim="stagger">
          {resources.map((r, i) => (
            <li key={r.id} className="border-b border-line">
              <a href={r.path} className="cursor-target group grid gap-6 py-10 lg:grid-cols-12 lg:items-baseline lg:py-14" data-cursor-label="Leer">
                <span className="font-display text-sm font-extrabold text-amber lg:col-span-1">{String(i + 1).padStart(2, '0')}</span>
                <div className="lg:col-span-7">
                  <h2 className="text-[clamp(1.6rem,3.4vw,3.25rem)] transition-colors duration-500 group-hover:text-amber">{r.title}</h2>
                  <p className="mt-4 max-w-2xl text-cream/75">{r.summary}</p>
                </div>
                <p className="eyebrow flex flex-wrap gap-x-4 gap-y-2 text-muted lg:col-span-3 lg:col-start-10 lg:justify-end">
                  <span>{r.eyebrow}</span>
                  <span>{r.readTime}</span>
                  <time dateTime={r.published}>{formatDate(r.published)}</time>
                </p>
              </a>
            </li>
          ))}
        </ol>
      </section>
      <Contacto />
    </>
  )
}
