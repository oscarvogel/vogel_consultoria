import simbolo from '../assets/brand/vogel-simbolo.svg'
import { capabilities } from '../content/capabilities.js'
import { site, whatsappUrl } from '../content/site'

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 pt-16 pb-10 sm:px-8 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {/* Manual: below 24 px of legend use the symbol, with the wordmark set in Chillax. */}
          <p className="flex items-center gap-4">
            <img src={simbolo} alt="" width={540} height={438} className="h-12 w-auto" />
            <span className="text-xl font-semibold tracking-[0.08em] uppercase">{site.name}</span>
          </p>
          <p className="mt-6 max-w-sm text-cream/70">Convertimos datos y procesos en decisiones que mejoran tu rentabilidad.</p>
        </div>
        <nav aria-label="Soluciones" className="lg:col-span-4">
          <p className="eyebrow text-muted">Soluciones</p>
          <ul className="mt-4 grid gap-2">
            {capabilities.map((c) => (
              <li key={c.id}><a className="ink-link" href={c.href}>{c.title}</a></li>
            ))}
          </ul>
        </nav>
        <div className="lg:col-span-3">
          <p className="eyebrow text-muted">Contacto</p>
          <ul className="mt-4 grid gap-2">
            <li><a className="ink-link" href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a className="ink-link" href={whatsappUrl()} target="_blank" rel="noopener">WhatsApp</a></li>
            <li><a className="ink-link" href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a className="ink-link" href={site.instagram} target="_blank" rel="noopener">Instagram</a></li>
          </ul>
        </div>
      </div>
      <p className="eyebrow mt-16 text-muted">© {new Date().getFullYear()} {site.name}</p>
    </footer>
  )
}
