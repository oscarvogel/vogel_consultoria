import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { oscarCapabilities, oscarMilestones, oscarProfile } from '../content/oscar.js'
import { desktopMotion } from '../lib/motion'

// three.js is the heaviest dependency on the site: its own chunk, requested only on desktop once the section is near.
const Lanyard = lazy(() => import('../components/reactbits/Lanyard'))

const front = '/oscar/credencial-frente.webp'
const back = '/oscar/credencial-dorso.webp'

export default function Estudio() {
  const stage = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!window.matchMedia(desktopMotion).matches) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setLive(true)
      io.disconnect()
    }, { rootMargin: '400px 0px' })
    io.observe(stage.current!)
    return () => io.disconnect()
  }, [])

  return (
    <section id="estudio" data-pillar="estudio" aria-labelledby="estudio-titulo" className="px-5 py-28 sm:px-8 lg:px-12">
      <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
        <div ref={stage} className="relative h-[34rem] lg:col-span-5 lg:h-[86svh]">
          {/* Static credential: the first paint, the touch/reduced-motion view, and what shows if WebGL fails. */}
          {!live && (
            <img
              src={front}
              width={800}
              height={1125}
              loading="lazy"
              alt="Credencial de Oscar Vogel, desarrollador y consultor tecnológico."
              className="absolute top-1/2 left-1/2 w-[min(19rem,70%)] -translate-x-1/2 -translate-y-1/2 -rotate-3 rounded-2xl shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]"
            />
          )}
          {live && (
            <Suspense fallback={null}>
              <Lanyard
                className="cursor-grab active:cursor-grabbing"
                frontImage={front}
                backImage={back}
                cardColor="#020f1f"
                strapColor="#ffbc54"
                metal="graphite"
                finish="glossy"
                size={0.7}
                strapLength={0.55}
              />
            </Suspense>
          )}
        </div>

        <div className="lg:col-span-7">
          <p className="eyebrow text-muted" data-anim="fade">Estudio</p>
          <h2 id="estudio-titulo" className="mt-6 text-[clamp(1.75rem,4.2vw,4.5rem)]" data-anim="lines">
            {oscarProfile.years} años construyendo sistemas para empresas.
          </h2>
          <p className="mt-8 max-w-xl text-lg text-cream/80" data-anim="fade">
            {oscarProfile.name}, {oscarProfile.role.toLowerCase()}. Del aula a la facturación electrónica, de los sistemas de ventas a los dashboards: acompaña cada proyecto de punta a punta.
          </p>

          <ol className="mt-12 grid border-t border-line sm:grid-cols-4" data-anim="stagger">
            {oscarMilestones.map((m) => (
              <li key={m.year} className="border-b border-line py-5 sm:border-r sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:border-r-0">
                <p className="font-display text-[clamp(1.5rem,2vw,1.875rem)] font-extrabold [font-stretch:125%]">{m.year}</p>
                <p className="mt-2 text-sm text-muted">{m.milestone}</p>
              </li>
            ))}
          </ol>

          <ul className="mt-10 flex flex-wrap gap-2" data-anim="fade">
            {oscarCapabilities.map((c) => (
              <li key={c} className="eyebrow rounded-full border border-line px-3 py-1.5 text-muted">{c}</li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-center gap-6" data-anim="fade">
            <a className="btn cursor-target" href={oscarProfile.cv} download data-cursor-label="PDF">Descargar CV <span aria-hidden="true">↓</span></a>
            <a className="ink-link cursor-target" href="/estudio/">Conocer el estudio</a>
          </div>
        </div>
      </div>
    </section>
  )
}
