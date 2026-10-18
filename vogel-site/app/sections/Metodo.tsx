import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { methodSteps } from '../content/method.js'
import { desktopMotion, EASE_MOVE, registerEases } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

const total = String(methodSteps.length).padStart(2, '0')

/**
 * The five steps in one sticky frame (desktop): each verb rises out of its mask as the last one leaves,
 * with the counter and progress line following. Elsewhere the steps simply stack. Pattern from fg-site Operacion.
 */
export default function Metodo() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = root.current!
    const q = gsap.utils.selector(el)
    const mm = gsap.matchMedia()
    mm.add(desktopMotion, () => {
      registerEases()
      el.dataset.motion = 'on'
      const steps = q('[data-step]')
      const counter = q('[data-count]')[0]
      let current = -1
      const show = (index: number) => {
        if (index === current) return
        current = index
        counter.textContent = methodSteps[index].number
      }
      const tl = gsap.timeline({
        defaults: { ease: EASE_MOVE },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => show(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))),
        },
      })
      steps.forEach((step, i) => {
        if (i === 0) return
        const previous = steps[i - 1]
        const at = i - 1 + 0.3
        tl.to(previous.querySelector('[data-word]'), { yPercent: -110, duration: 0.6 }, at)
          .to(previous.querySelector('[data-copy]'), { y: -40, autoAlpha: 0, duration: 0.4 }, at)
          .fromTo(step.querySelector('[data-word]'), { yPercent: 110 }, { yPercent: 0, duration: 0.6, immediateRender: true }, at + 0.15)
          .fromTo(step.querySelector('[data-copy]'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, immediateRender: true }, at + 0.35)
      })
      tl.to({}, { duration: 0.3 })
      gsap.fromTo(q('[data-fill]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true } })
      show(0)
      return () => {
        delete el.dataset.motion
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="metodo" data-pillar="metodo" aria-labelledby="metodo-titulo">
      <div className="grid gap-6 px-5 pt-24 pb-12 sm:px-8 lg:grid-cols-12 lg:items-end lg:px-12 lg:pt-32">
        <div className="lg:col-span-8">
          <p className="eyebrow text-muted" data-anim="fade">Método Vogel</p>
          <h2 id="metodo-titulo" className="mt-5 text-[clamp(1.75rem,6vw,6rem)]" data-anim="lines">
            No digitalizamos desorden.
          </h2>
        </div>
        <p className="max-w-sm text-lg text-muted lg:col-span-4 lg:justify-self-end" data-anim="fade">
          Primero entendemos cómo trabaja hoy la operación. Después decidimos qué conviene ordenar, conectar o automatizar.
        </p>
      </div>

      <div ref={root} className="group/met relative data-[motion=on]:h-[420svh]">
        <div className="group-data-[motion=on]/met:sticky group-data-[motion=on]/met:top-0 group-data-[motion=on]/met:h-svh group-data-[motion=on]/met:overflow-hidden">
          <ol className="border-t border-line group-data-[motion=on]/met:border-0">
            {methodSteps.map((step) => (
              <li
                key={step.id}
                data-step
                className="grid gap-4 border-b border-line px-5 py-10 sm:px-8 lg:grid-cols-12 lg:items-end lg:px-12 group-data-[motion=on]/met:absolute group-data-[motion=on]/met:inset-0 group-data-[motion=on]/met:border-0 group-data-[motion=on]/met:pb-28"
              >
                <p className="eyebrow text-muted lg:hidden">{step.number} / {total}</p>
                <h3 className="overflow-hidden pb-[0.04em] text-[clamp(3rem,11vw,12rem)] leading-[0.85] lg:col-span-12">
                  <span data-word className="block">{step.label}</span>
                </h3>
                <div data-copy className="max-w-sm lg:col-span-5 lg:col-start-8 lg:mt-4">
                  <p className="text-xl">{step.text}</p>
                  {step.detail && <p className="mt-3 text-muted">{step.detail}</p>}
                </div>
              </li>
            ))}
          </ol>

          <div aria-hidden="true" className="absolute right-12 bottom-10 left-12 hidden items-center gap-6 group-data-[motion=on]/met:flex">
            <p className="font-display text-sm font-extrabold">
              <span data-count>01</span> <span className="text-muted">/ {total}</span>
            </p>
            <div className="h-px flex-1 bg-line"><div data-fill className="h-px origin-left bg-amber" /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
