import { useState } from 'react'
import LogoLoop, { type LogoItem } from '../components/reactbits/LogoLoop'
import PauseButton from '../components/PauseButton'
import { portfolioProjects } from '../content/projects.js'

// Only the web projects have a client logo; the software projects (FEMAG, PyFE, ...) have none.
const logos: LogoItem[] = (portfolioProjects as { name: string; logo?: string }[]).filter((p) => p.logo).map((p) => ({ src: p.logo as string, alt: p.name, title: p.name }))

export default function Clientes() {
  const [paused, setPaused] = useState(false)
  return (
    <section data-pillar="clientes" aria-labelledby="clientes-titulo" className="glass border-x-0 py-10 lg:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <h2 id="clientes-titulo" className="eyebrow font-sans tracking-[0.14em] text-muted [font-stretch:100%]">
          Empresas e instituciones que trabajan con Vogel
        </h2>
        <PauseButton paused={paused} onToggle={() => setPaused((p) => !p)} label="la cinta de clientes" className="text-cream hover:bg-cream/10" />
      </div>
      <LogoLoop
        logos={logos}
        speed={40}
        gap={56}
        logoHeight={64}
        fadeOut
        fadeOutColor="#020f1f"
        pauseOnHover
        paused={paused}
        ariaLabel="Clientes de Vogel Consultoría"
        renderItem={(item) => {
          const logo = item as Extract<LogoItem, { src: string }>
          return (
            <span className="group flex h-16 w-44 items-center justify-center rounded bg-cream/90 px-3">
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                decoding="async"
                className="max-h-14 max-w-[160px] object-contain grayscale transition-[filter] duration-500 group-hover:grayscale-0"
              />
            </span>
          )
        }}
      />
    </section>
  )
}
