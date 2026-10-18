import type { ReactNode } from 'react'
import { stagger } from '../lib/motion'

type Crumb = { href: string; label: string }

const Corner = ({ className }: { className: string }) => <span aria-hidden="true" className={`absolute h-5 w-5 border-cream/40 ${className}`} />

/** Interior page opening: same type scale, HUD furniture and CSS first-paint entrance as the home hero. */
export default function PageHero({ eyebrow, title, lead, crumbs = [], children }: { eyebrow: string; title: string; lead?: string; crumbs?: Crumb[]; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden px-5 pt-36 pb-20 sm:px-8 lg:px-12 lg:pt-44 lg:pb-28">
      {/* HUD furniture shared with the home hero: hairline grid and visor corners. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(243_241_226/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(243_241_226/0.04)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-4 sm:inset-6 lg:inset-8">
        <Corner className="top-0 left-0 border-t border-l" />
        <Corner className="top-0 right-0 border-t border-r" />
      </div>
      {crumbs.length > 0 && (
        <nav aria-label="Ruta de navegación" className="intro mb-10 text-sm text-muted" style={stagger(0)}>
          <ol className="flex flex-wrap items-center gap-2">
            {[{ href: '/', label: 'Inicio' }, ...crumbs].map((c) => (
              <li key={c.href} className="flex items-center gap-2">
                <a className="transition-colors hover:text-cream" href={c.href}>{c.label}</a>
                <span aria-hidden="true">/</span>
              </li>
            ))}
            <li aria-current="page" className="text-cream/80">{eyebrow}</li>
          </ol>
        </nav>
      )}
      <p className="eyebrow intro text-amber" style={stagger(1)}>// {eyebrow}</p>
      <h1 className="mt-6 max-w-6xl text-[clamp(2.1rem,6.4vw,6.75rem)] [overflow-wrap:anywhere]">
        <span className="intro-line" style={stagger(2)}>{title}</span>
      </h1>
      {lead && <p className="intro mt-8 max-w-2xl text-lg text-cream/80 sm:text-xl" style={stagger(3)}>{lead}</p>}
      {children && <div className="intro mt-10 flex flex-wrap items-center gap-6" style={stagger(4)}>{children}</div>}
    </header>
  )
}
