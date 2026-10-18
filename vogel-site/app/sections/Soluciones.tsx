import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { capabilities, alsoServices } from '../content/capabilities.js'
import { servicePages } from '../content/servicePages.js'
import { desktopMotion } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

type Page = { path: string; deliverables?: string[] }
const deliverables = (href: string) => (Object.values(servicePages) as Page[]).find((p) => p.path === href)?.deliverables ?? []

/** Six capabilities on one pinned horizontal rail (desktop); a plain grid everywhere else. Pattern from fg-site Capacidades. */
export default function Soluciones() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const mm = gsap.matchMedia()
    mm.add(desktopMotion, () => {
      el.dataset.motion = 'on'
      const track = q('[data-track]')[0]
      const distance = () => track.scrollWidth - window.innerWidth
      const trigger = { trigger: el, start: 'top top', end: () => `+=${distance()}`, invalidateOnRefresh: true }
      gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { ...trigger, pin: true, scrub: 0.6 } })
      gsap.fromTo(q('[data-progress]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...trigger, scrub: true } })
      return () => {
        delete el.dataset.motion
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} data-pillar="soluciones" id="soluciones" aria-labelledby="soluciones-titulo" className="group/sol relative overflow-hidden py-24 data-[motion=on]:flex data-[motion=on]:h-svh data-[motion=on]:flex-col data-[motion=on]:justify-center data-[motion=on]:pt-20 data-[motion=on]:pb-0">
      <div className="mb-12 grid gap-6 px-5 sm:px-8 lg:mb-10 lg:grid-cols-12 lg:items-end lg:px-12">
        <div className="lg:col-span-8">
          <p className="eyebrow text-muted" data-anim="fade">Soluciones</p>
          <h2 id="soluciones-titulo" className="mt-5 text-[clamp(1.9rem,6vw,6rem)] group-data-[motion=on]/sol:text-[clamp(2.5rem,4.4vw,4.75rem)]" data-anim="lines">
            Seis formas de ordenar la operación.
          </h2>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end" data-anim="fade">
          <p className="eyebrow text-muted">También</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
            {alsoServices.map((s) => (
              <li key={s.href}><a className="ink-link" href={s.href}>{s.label}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <ol data-track className="grid gap-5 px-5 sm:px-8 md:grid-cols-2 lg:px-12 group-data-[motion=on]/sol:flex group-data-[motion=on]/sol:w-max group-data-[motion=on]/sol:gap-[2vw]">
        {capabilities.map((c, i) => (
          <li key={c.id} className="group-data-[motion=on]/sol:w-[min(40vw,40rem)]">
            <a
              href={c.href}
              data-cursor-label="Ver solución"
              className="cursor-target group/card flex h-full min-h-[22rem] flex-col justify-between rounded-lg glass p-5 transition-colors duration-500 hover:border-amber/60 lg:p-9 group-data-[motion=on]/sol:h-[54svh]"
            >
              <span aria-hidden="true" className="font-display text-[clamp(5rem,9vw,9rem)] leading-none font-extrabold tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_rgb(243_241_226/0.5)] [font-stretch:125%] transition-[-webkit-text-stroke-color] duration-500 group-hover/card:[-webkit-text-stroke-color:var(--color-amber)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[clamp(1.4rem,2.6vw,2.75rem)]">{c.title}</h3>
                <p className="mt-4 max-w-md text-lg text-cream/80">{c.line}</p>
                {deliverables(c.href).length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {deliverables(c.href).map((d) => (
                      <li key={d} className="eyebrow rounded-full border border-line px-3 py-1.5 text-muted">{d}</li>
                    ))}
                  </ul>
                )}
                <span className="ink-link mt-7">Ver solución <span aria-hidden="true">↗</span></span>
              </div>
            </a>
          </li>
        ))}
      </ol>

      <div aria-hidden="true" className="mx-12 mt-10 hidden h-px bg-line group-data-[motion=on]/sol:block">
        <div data-progress className="h-px origin-left bg-amber" />
      </div>
    </section>
  )
}
