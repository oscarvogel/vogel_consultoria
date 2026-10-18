import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ElectricMark from '../components/ElectricMark'
import HudClock from '../components/HudClock'
import Shuffle from '../components/reactbits/Shuffle'
import { desktopMotion, EASE_MOVE, registerEases, stagger } from '../lib/motion'
import { homeCards } from '../content/homeCards.js'
import { capabilities } from '../content/capabilities.js'
import { oscarProfile } from '../content/oscar.js'
import dashboard from '../assets/forestal-dashboard-desktop.webp'

gsap.registerPlugin(ScrollTrigger)

const lines = ['Tu empresa', 'ya tiene datos.', 'Falta convertirlos', 'en decisiones.']

// Real figures only: the published projects, the solutions on offer and Oscar's years.
const readouts = [
  ['Proyectos', String(homeCards.length).padStart(2, '0')],
  ['Soluciones', String(capabilities.length).padStart(2, '0')],
  ['Experiencia', `${oscarProfile.years} años`],
  ['Cobertura', 'Argentina'],
]

const Corner = ({ className }: { className: string }) => <span aria-hidden="true" className={`absolute h-6 w-6 border-cream/50 ${className}`} />

/**
 * HUD opening. Pinned on desktop: the VOGEL readout lifts away, the thesis rises line by line and a real
 * interface unclips beside it. Elsewhere both blocks simply stack. The light pillar behind is the site-wide one.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const mm = gsap.matchMedia()
    mm.add(desktopMotion, () => {
      registerEases() // child layout effects run before root's useReveals registers them
      el.dataset.motion = 'on'
      const tl = gsap.timeline({
        defaults: { ease: EASE_MOVE },
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })
      tl.to(q('[data-intro]'), { yPercent: -16, autoAlpha: 0, duration: 0.9 })
      // One tween per line: a staggered tween that hasn't started would show its pre-tween state mid-scrub.
      q('[data-line]').forEach((line, n) => {
        tl.fromTo(line, { yPercent: 110 }, { yPercent: 0, duration: 0.7, immediateRender: true }, 0.55 + n * 0.12)
      })
      tl.fromTo(q('[data-shot]'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, immediateRender: true }, 0.75)
        .fromTo(q('[data-shot] img'), { scale: 1.15 }, { scale: 1, duration: 1.1, immediateRender: true }, '<')
        .fromTo(q('[data-after]'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08, immediateRender: true }, 1.45)
        .to({}, { duration: 0.5 })
      return () => {
        delete el.dataset.motion
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} data-pillar="hero" aria-labelledby="hero-titulo" className="group/hero relative data-[motion=on]:h-[280svh]">
      <div className="relative flex flex-col overflow-hidden group-data-[motion=on]/hero:sticky group-data-[motion=on]/hero:top-0 group-data-[motion=on]/hero:h-svh">
        {/* HUD furniture: hairline grid and visor corners frame the whole opening. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(243_241_226/0.045)_1px,transparent_1px),linear-gradient(90deg,rgb(243_241_226/0.045)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-4 sm:inset-6 lg:inset-8">
          <Corner className="top-0 left-0 border-t border-l" />
          <Corner className="top-0 right-0 border-t border-r" />
          <Corner className="bottom-0 left-0 border-b border-l" />
          <Corner className="right-0 bottom-0 border-r border-b" />
        </div>

        {/* Thesis + real interface. First in the DOM so the intro sits on top while both are layered; order-2 keeps it second when stacked. */}
        <div className="relative order-2 grid gap-10 px-5 pt-8 pb-24 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-12 group-data-[motion=on]/hero:absolute group-data-[motion=on]/hero:inset-0 group-data-[motion=on]/hero:py-0">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6 text-amber" data-after>[02] Lo que hacemos</p>
            <h2 className="text-[clamp(1.75rem,3.5vw,4rem)] leading-[0.95]">
              {lines.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <span data-line className="block">{line}</span>
                </span>
              ))}
            </h2>
            <p data-after className="mt-8 max-w-md text-lg text-cream/80">
              Implementamos soluciones concretas para ordenar operaciones, ahorrar tiempo y decidir con datos confiables.
            </p>
            <div data-after className="mt-8">
              <a className="ink-link cursor-target" href="#proyectos" data-cursor-label="Proyectos">Ver proyectos <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <figure className="lg:col-span-7">
            <div data-shot className="glass overflow-hidden rounded-lg shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)]">
              <img src={dashboard} width={1440} height={1151} loading="lazy" decoding="async" className="block h-auto w-full" alt="Dashboard operativo forestal del Sistema Registro de Producción. Todos los valores son ficticios." />
            </div>
            <figcaption data-after className="eyebrow mt-4 text-muted">Sistema Registro de Producción · interfaz real, datos de demostración</figcaption>
          </figure>
        </div>

        <div data-intro className="relative order-1 flex min-h-svh flex-col justify-between px-5 pt-28 pb-10 sm:px-8 lg:px-12 group-data-[motion=on]/hero:absolute group-data-[motion=on]/hero:inset-0">
          <p className="eyebrow intro flex items-center gap-2 text-muted" style={stagger(0)}>
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber" /> Sistema en línea · <HudClock />
          </p>

          <div className="grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow intro text-[#4a9bff]" style={stagger(1)}>[01] Consultoría tecnológica — Argentina</p>
              <h1 id="hero-titulo" className="sr-only">Vogel Consultoría: convertimos datos y procesos en decisiones.</h1>
              <div aria-hidden="true" className="mt-4">
                <Shuffle
                  tag="p"
                  text="VOGEL"
                  textAlign="left"
                  className="font-display text-[clamp(4rem,15vw,15rem)] leading-[0.85] font-extrabold [font-stretch:125%]"
                  shuffleTimes={3}
                  scrambleCharset="01ABCDEF#%&"
                  colorFrom="#0b61c8"
                  colorTo="#f3f1e2"
                  triggerOnHover
                  respectReducedMotion
                />
              </div>
              <p className="intro mt-6 max-w-2xl text-[clamp(1.1rem,2vw,1.75rem)] text-cream/90" style={stagger(2)}>
                Convertimos datos y procesos en decisiones que mejoran tu rentabilidad.
              </p>
              <div className="intro mt-8 flex flex-wrap items-center gap-6" style={stagger(3)}>
                <a className="btn cursor-target" href="#contacto" data-cursor-label="Contacto">Solicitar diagnóstico <span aria-hidden="true">→</span></a>
                <a className="ink-link cursor-target" href="#metodo">Cómo trabajamos</a>
              </div>
            </div>
            <ElectricMark className="mx-auto hidden w-full max-w-[22rem] lg:col-span-4 lg:block" />
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-cream/15 pt-5 sm:grid-cols-4">
            {readouts.map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow text-muted">{k}</dt>
                <dd className="mt-1 font-display text-lg [font-stretch:110%]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
