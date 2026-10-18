import { useEffect, useRef, useState } from 'react'
import simbolo from '../assets/brand/vogel-simbolo.svg'
import { lenis } from '../lib/smooth'
import { diagnosticMail, whatsappUrl } from '../content/site'

const links = [
  { href: '/soluciones/', label: 'Soluciones' },
  { href: '/#proyectos', label: 'Proyectos' },
  { href: '/estudio/', label: 'Estudio' },
  { href: '/recursos/', label: 'Recursos' },
]

const chip = 'rounded-full border border-line bg-ink/75 backdrop-blur-md'

/** Floating chips (fg-site pattern) so the bar stays legible over ink and cream; a full sheet menu below lg. */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    // The page behind the sheet leaves the tab order and stops scrolling while it is open.
    const behind = document.querySelectorAll<HTMLElement>('main, footer')
    behind.forEach((el) => (el.inert = true))
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      behind.forEach((el) => (el.inert = false))
      lenis?.start()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      toggle.current?.focus()
    }
  }, [open])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-4 pt-4 sm:px-6 lg:px-10">
        <a href="/" className={`pointer-events-auto flex items-center gap-3 py-2 pr-5 pl-3 ${chip}`} aria-label="Vogel Consultoría, inicio">
          <img src={simbolo} alt="" width={36} height={29} className="h-7 w-auto" />
          <span className="text-sm font-semibold tracking-[0.08em] uppercase">Vogel</span>
        </a>
        <nav aria-label="Principal" className={`pointer-events-auto hidden items-center gap-1 p-1 lg:flex ${chip}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-4 py-2 text-sm text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="pointer-events-auto flex items-center gap-2">
          <a href="/contacto/" className="cursor-target rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-ink-dark transition-colors hover:bg-cream">
            Contacto
          </a>
          <button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((o) => !o)}
            className={`px-5 py-2.5 text-sm font-semibold lg:hidden ${chip}`}
          >
            {open ? 'Cerrar' : 'Menú'}
          </button>
        </div>
      </header>

      <div
        id="menu-movil"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col justify-end overflow-y-auto bg-ink px-5 pt-28 pb-10 sm:px-8 lg:hidden"
      >
        <nav aria-label="Menú">
          <ul className="border-t border-line">
            {[{ href: '/', label: 'Inicio' }, ...links, { href: '/contacto/', label: 'Contacto' }].map((l, i) => (
              <li key={l.href} className="border-b border-line">
                <a href={l.href} onClick={() => setOpen(false)} className="intro display flex items-baseline justify-between py-5 text-[clamp(2rem,9vw,3.5rem)]" style={{ '--i': i } as React.CSSProperties}>
                  {l.label}
                  <span aria-hidden="true" className="text-base text-amber">→</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 flex flex-wrap gap-6">
          <a className="ink-link" href={diagnosticMail}>Solicitar diagnóstico</a>
          <a className="ink-link" href={whatsappUrl()} target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </>
  )
}
