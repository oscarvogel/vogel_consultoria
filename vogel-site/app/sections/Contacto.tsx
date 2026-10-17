import ContactForm from '../components/ContactForm'
import { diagnosticMail, site, whatsappUrl } from '../content/site'

/** Closing band on every page: the direct channels plus the Web3Forms form. */
export default function Contacto({
  title = 'Empecemos por un diagnóstico.',
  text = 'Relevamos tu proceso, detectamos oportunidades y te proponemos una solución aplicable al trabajo diario.',
}: { title?: string; text?: string }) {
  return (
    <section id="contacto" data-pillar="contacto" aria-labelledby="contacto-titulo" className="px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-muted" data-anim="fade">Contacto</p>
          <h2 id="contacto-titulo" className="mt-6 text-[clamp(1.9rem,4.4vw,4.75rem)]" data-anim="lines">{title}</h2>
          <p className="mt-8 max-w-lg text-lg text-muted" data-anim="fade">{text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-6" data-anim="fade">
            <a className="btn cursor-target" href={diagnosticMail} data-cursor-label="Email">Solicitar diagnóstico <span aria-hidden="true">→</span></a>
            <a className="ink-link cursor-target" href={whatsappUrl()} target="_blank" rel="noopener">Hablar por WhatsApp <span aria-hidden="true">↗</span></a>
          </div>
          <dl className="mt-16 grid gap-6 border-t border-line pt-8 sm:grid-cols-3" data-anim="stagger">
            <div>
              <dt className="eyebrow text-muted">Email</dt>
              <dd className="mt-2"><a className="ink-link" href={`mailto:${site.email}`}>{site.email}</a></dd>
            </div>
            <div>
              <dt className="eyebrow text-muted">WhatsApp</dt>
              <dd className="mt-2"><a className="ink-link" href={whatsappUrl()} target="_blank" rel="noopener">{site.phone}</a></dd>
            </div>
            <div>
              <dt className="eyebrow text-muted">Cobertura</dt>
              <dd className="mt-2">Argentina</dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-5 lg:pt-16" data-anim="fade">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
