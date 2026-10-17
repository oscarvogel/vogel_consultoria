import { useParams } from 'react-router'
import { resources } from '../content/resources.js'
import { getRelatedServices, getServicePage } from '../content/servicePages.js'
import PageHero from '../components/PageHero'
import NotFound from '../components/NotFound'
import Contacto from '../sections/Contacto'
import { pageMeta } from '../lib/meta'
import { formatDate } from '../lib/format'

type Resource = (typeof resources)[number]
type Service = { id: string; path: string; shortTitle: string; summary: string }

const find = (slug?: string) => resources.find((r) => r.id === slug) as Resource | undefined

export const meta = ({ params }: { params: { slug?: string } }) => {
  const r = find(params.slug)
  return r ? pageMeta({
        title: r.metaTitle, description: r.metaDescription, path: r.path, type: 'article', crumbs: [{ name: 'Recursos', path: '/recursos/' }], name: r.shortTitle,
        graph: [{ '@type': 'Article', headline: r.title, description: r.metaDescription, datePublished: r.published, dateModified: r.published, author: { '@type': 'Person', name: 'Oscar Vogel' }, publisher: { '@id': 'https://vogelconsultoria.com.ar/#organization' }, mainEntityOfPage: `https://vogelconsultoria.com.ar${r.path}`, keywords: r.keywords }],
      }) : [{ title: 'Página no encontrada | Vogel Consultoría' }]
}

export default function Recurso() {
  const resource = find(useParams().slug)
  if (!resource) return <NotFound />
  const related = getRelatedServices(getServicePage(resource.primaryService)) as Service[]

  return (
    <>
      <PageHero eyebrow={resource.eyebrow} title={resource.title} lead={resource.summary} crumbs={[{ href: '/recursos/', label: 'Recursos' }]}>
        <p className="eyebrow flex gap-4 text-muted">
          <span>{resource.readTime}</span>
          <time dateTime={resource.published}>{formatDate(resource.published)}</time>
        </p>
      </PageHero>

      <article className="grid gap-16 px-5 pb-28 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-7">
          {resource.sections.map((s) => (
            <section key={s.heading} className="border-t border-line py-10">
              <h2 className="text-[clamp(1.4rem,2.6vw,2.4rem)]" data-anim="lines">{s.heading}</h2>
              <p className="mt-5 text-lg leading-8 text-cream/80" data-anim="fade">{s.body}</p>
            </section>
          ))}
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="glass rounded-lg p-7 lg:sticky lg:top-28">
            <p className="eyebrow text-amber">Checklist rápido</p>
            <ul className="mt-6 grid gap-4">
              {resource.checklist.map((item) => (
                <li key={item} className="flex gap-3 text-cream/85">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  {item}
                </li>
              ))}
            </ul>
            <a className="btn cursor-target mt-8 w-full justify-center" href={resource.ctaUrl}>{resource.ctaText}</a>
          </div>
        </aside>
      </article>

      <section aria-labelledby="relacionados-titulo" className="px-5 pb-28 sm:px-8 lg:px-12">
        <p className="eyebrow text-muted" data-anim="fade">Siguiente paso</p>
        <h2 id="relacionados-titulo" className="mt-5 text-[clamp(1.75rem,3.6vw,3.5rem)]" data-anim="lines">Servicios relacionados.</h2>
        <ul className="mt-12 grid gap-5 md:grid-cols-3" data-anim="stagger">
          {related.map((s) => (
            <li key={s.id}>
              <a href={s.path} className="cursor-target flex h-full flex-col justify-between gap-8 rounded-lg border border-line p-7 transition-colors duration-500 hover:border-amber/60" data-cursor-label="Ver servicio">
                <div>
                  <p className="display text-xl">{s.shortTitle}</p>
                  <p className="mt-3 text-cream/70">{s.summary}</p>
                </div>
                <span className="ink-link">Ver servicio <span aria-hidden="true">↗</span></span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Contacto />
    </>
  )
}
