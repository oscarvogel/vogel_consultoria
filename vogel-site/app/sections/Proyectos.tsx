import { useEffect, useState } from 'react'
import OptionWheel from '../components/reactbits/OptionWheel'
import { homeCards } from '../content/homeCards.js'

type Card = { id: string; title: string; category: string; tag: string; href: string; artSmall?: string; imageSmall?: string; image: string }
const projects = homeCards as Card[]
// Card art when the project has it (decorative, like the Vue home); FEMAG falls back to its site capture.
const cover = (p: Card) => p.artSmall ?? p.imageSmall ?? p.image

/** OptionWheel as the project picker on fine pointers; touch and the prerendered HTML get a plain list of links. */
export default function Proyectos() {
  const [wheel, setWheel] = useState(false)
  const [active, setActive] = useState(0)
  const project = projects[active]

  useEffect(() => {
    // The wheel blocks touch scrolling (touch-action: none), so only fine pointers get it.
    setWheel(window.matchMedia('(pointer: fine)').matches)
  }, [])

  return (
    <section data-pillar="proyectos" id="proyectos" aria-labelledby="proyectos-titulo" className="px-5 py-28 sm:px-8 lg:px-12">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="eyebrow text-muted" data-anim="fade">Proyectos</p>
          <h2 id="proyectos-titulo" className="mt-6 text-[clamp(2.5rem,6vw,6.5rem)]" data-anim="lines">Trabajo real, clientes reales.</h2>
        </div>
        <p className="max-w-sm text-cream/80 lg:col-span-4 lg:justify-self-end" data-anim="fade">
          {projects.length} proyectos publicados: sistemas internos y sitios web para empresas e instituciones de la región.
        </p>
      </div>

      {wheel ? (
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12">
          <div className="h-[62svh] lg:col-span-6">
            <OptionWheel
              items={projects.map((p) => p.title)}
              defaultSelected={0}
              onChange={(index) => setActive(index)}
              ariaLabel="Elegir proyecto"
              textColor="#a8a596"
              activeColor="#f3f1e2"
              fontSize={2}
              inset={32}
              className="font-display uppercase [font-stretch:125%]"
            />
          </div>
          <a href={project.href} className="cursor-target group block lg:col-span-6" data-cursor-label="Ver proyecto">
            <div className="relative aspect-[4/3] overflow-hidden glass rounded-lg">
              {projects.map((p, i) => (
                <img
                  key={p.id}
                  src={cover(p)}
                  alt={i === active ? `Proyecto ${p.title}` : ''}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 ease-[var(--ease-vogel-out)] group-hover:scale-[1.03] ${i === active ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
            </div>
            <p className="mt-5 flex items-baseline justify-between gap-6">
              <span className="eyebrow text-muted">{project.category} · {project.tag}</span>
              <span className="ink-link">Ver proyecto <span aria-hidden="true">↗</span></span>
            </p>
          </a>
        </div>
      ) : (
        <ul className="mt-14 border-t border-line">
          {projects.map((p) => (
            <li key={p.id} className="border-b border-line">
              <a href={p.href} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="display text-2xl sm:text-4xl">{p.title}</span>
                <span className="eyebrow text-muted sm:shrink-0">{p.category}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
