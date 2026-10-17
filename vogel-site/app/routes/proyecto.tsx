import { useParams } from 'react-router'
import { getProject, homeCards } from '../content/homeCards.js'
import { forestCase } from '../content/forestCase.js'
import projectSummaries from '../content/projectSummaries.json'
import NotFound from '../components/NotFound'
import Contacto from '../sections/Contacto'
import { pageMeta } from '../lib/meta'
import { stagger } from '../lib/motion'

type Shot = { src: string; alt: string; width: number; height: number; label: string }
type Project = {
  id: string; title: string; category: string; tag: string; href: string; image: string; imageSmall?: string; alt: string
  description: string; context: string; url?: string; linkLabel?: string; gallery?: Shot[]; forest?: boolean
}
type Step = { id: string; title: string; text: string; displayImage: string; desktopDisplayImage?: string; width: number; height: number; desktopWidth?: number; desktopHeight?: number; alt: string }

const summaries = projectSummaries as Record<string, { name: string; summary: string }>

// Verbatim from the Vue site's scripts/generate-project-pages.mjs, so descriptions match: whole sentences under ~160 characters.
const shorten = (text: string) => {
  const sentences = (text.match(/[^.]+\.?/g) ?? [text]).map((part) => part.trim())
  let out = ''
  for (const sentence of sentences) {
    if ((out + ' ' + sentence).trim().length > 158) break
    out = (out + ' ' + sentence).trim()
  }
  return out || sentences[0]
}

export const meta = ({ params }: { params: { id?: string } }) => {
  const s = summaries[params.id ?? '']
  return s ? pageMeta({ title: `${s.name} — Vogel Consultoría`, description: shorten(s.summary), path: `/proyectos/${params.id}/`, crumbs: [{ name: 'Proyectos', path: '/#proyectos' }], name: s.name }) : [{ title: 'Página no encontrada | Vogel Consultoría' }]
}

export default function Proyecto() {
  const id = useParams().id
  const project = getProject(id) as Project | null
  if (!project) return <NotFound />
  const list = homeCards as Project[]
  const next = list[(list.findIndex((p) => p.id === project.id) + 1) % list.length]
  const steps = forestCase.steps as Step[]

  return (
    <>
      <header className="px-5 pt-36 sm:px-8 lg:px-12 lg:pt-44">
        <nav aria-label="Ruta de navegación" className="intro text-sm text-muted" style={stagger(0)}>
          <a className="transition-colors hover:text-cream" href="/">Inicio</a> <span aria-hidden="true">/</span>{' '}
          <a className="transition-colors hover:text-cream" href="/#proyectos">Proyectos</a>
        </nav>
        <p className="eyebrow intro mt-10 text-amber" style={stagger(1)}>{project.category} · {project.tag}</p>
        <h1 className="mt-6 max-w-6xl text-[clamp(2.25rem,7vw,7.5rem)] [overflow-wrap:anywhere]">
          <span className="intro-line" style={stagger(2)}>{project.title}</span>
        </h1>
      </header>

      <figure className="intro mt-14 px-5 sm:px-8 lg:px-12" style={stagger(3)}>
        <div className="overflow-hidden rounded-lg border border-line">
          <img
            src={project.image}
            srcSet={project.imageSmall ? `${project.imageSmall} 800w, ${project.image} 1600w` : undefined}
            sizes="(min-width: 1024px) calc(100vw - 96px), calc(100vw - 40px)"
            alt={project.alt}
            width={1600}
            height={900}
            fetchPriority="high"
            className="aspect-[4/3] h-auto w-full object-cover object-top sm:aspect-video"
          />
        </div>
      </figure>

      <section aria-label="Contexto" className="grid gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-28">
        <p className="text-[clamp(1.25rem,2.2vw,2rem)] leading-snug lg:col-span-7" data-anim="fade">{project.description}</p>
        <div className="text-muted lg:col-span-4 lg:col-start-9" data-anim="fade">
          <p>{project.context}</p>
          {project.forest && (
            <>
              <p className="mt-4">{forestCase.disclaimer}</p>
              <p className="mt-4">{forestCase.caveat}</p>
            </>
          )}
          {project.url && (
            <a className="ink-link cursor-target mt-6 text-cream" href={project.url} target="_blank" rel="noopener" data-cursor-label="Sitio">{project.linkLabel ?? <>Ver sitio <span aria-hidden="true">↗</span></>}</a>
          )}
        </div>
      </section>

      <section hidden={!project.forest && !project.gallery?.length} aria-label="Galería" className="grid gap-20 px-5 py-24 sm:px-8 lg:gap-28 lg:px-12 lg:py-32">
        {project.forest
          ? steps.map((step, i) => (
              <article key={step.id} className="grid gap-8 lg:grid-cols-12 lg:items-start">
                <div className="lg:sticky lg:top-28 lg:col-span-4">
                  <p className="font-display text-sm font-extrabold">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="mt-4 text-[clamp(1.6rem,3vw,3rem)]" data-anim="lines">{step.title}</h2>
                  <p className="mt-4 text-muted" data-anim="fade">{step.text}</p>
                </div>
                <div className="lg:col-span-8" data-anim="media">
                  <img
                    src={step.desktopDisplayImage ?? step.displayImage}
                    alt={step.alt}
                    width={step.desktopWidth ?? step.width}
                    height={step.desktopHeight ?? step.height}
                    loading="lazy"
                    decoding="async"
                    className={`h-auto rounded-lg border border-line ${step.desktopDisplayImage ? 'w-full' : 'mx-auto w-full max-w-[390px]'}`}
                  />
                </div>
              </article>
            ))
          : project.gallery?.map((shot) => (
              <figure key={shot.src} className="grid gap-6 lg:grid-cols-12">
                <figcaption className="eyebrow text-muted lg:col-span-2">{shot.label}</figcaption>
                <div className="lg:col-span-10" data-anim="media">
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    loading="lazy"
                    decoding="async"
                    className={`h-auto rounded-lg border border-line ${shot.label === 'Móvil' ? 'mx-auto w-full max-w-[390px]' : 'w-full'}`}
                  />
                </div>
              </figure>
            ))}
      </section>

      <a href={next.href} className="cursor-target group block border-b border-line px-5 py-20 sm:px-8 lg:px-12 lg:py-28" data-cursor-label="Siguiente">
        <p className="eyebrow text-muted">Siguiente proyecto</p>
        <p className="display mt-6 text-[clamp(2rem,6vw,6.5rem)] transition-colors duration-500 group-hover:text-amber">{next.title} <span aria-hidden="true">→</span></p>
      </a>

      <Contacto title="¿Trabajamos juntos?" text="Contanos qué necesitás resolver. Definimos un próximo paso con alcance claro." />
    </>
  )
}
