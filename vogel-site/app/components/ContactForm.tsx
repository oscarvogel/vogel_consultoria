import { useRef, useState, type FormEvent } from 'react'
import { whatsappUrl } from '../content/site'
import { trackEvent } from '../lib/analytics.js'

// Ported from the Vue site's useContactForm: same endpoint, fields, states and focus handling.
const ENDPOINT = 'https://api.web3forms.com/submit'
const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || ''

const field = 'glass w-full rounded-[2px] px-4 py-3.5 text-cream outline-none transition-colors focus:border-amber'

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const success = useRef<HTMLDivElement>(null)
  const name = useRef<HTMLInputElement>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'loading') return
    const form = event.currentTarget
    setState('loading')
    try {
      const response = await fetch(ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
      const json = await response.json()
      if (!response.ok || !json.success) return setState('error')
      form.reset()
      setState('success')
      trackEvent('contact_form_submit', { page_location: window.location.pathname, placement: 'contacto', form_name: 'Formulario de contacto' })
      requestAnimationFrame(() => success.current?.focus())
    } catch {
      setState('error')
    }
  }

  if (state === 'success')
    return (
      <div ref={success} tabIndex={-1} role="status" aria-live="polite" className="border-t border-line pt-8">
        <p className="display text-3xl">¡Consulta enviada!</p>
        <p className="mt-3 text-muted">Te respondemos a la brevedad con un plan inicial.</p>
        <button
          type="button"
          className="ink-link mt-6"
          onClick={() => {
            setState('idle')
            requestAnimationFrame(() => name.current?.focus())
          }}
        >
          Enviar otra consulta
        </button>
      </div>
    )

  return (
    <form onSubmit={submit} aria-label="Formulario de contacto" aria-describedby="contacto-datos" aria-busy={state === 'loading'} className="grid gap-5">
      <input type="hidden" name="access_key" value={accessKey} />
      <input type="hidden" name="subject" value="Nuevo lead desde vogelconsultoria.com.ar" />
      <input type="hidden" name="from_name" value="Vogel Consultoría" />
      <label className="grid gap-2 text-sm text-muted">
        Nombre y apellido
        <input ref={name} name="Nombre" autoComplete="name" required className={field} />
      </label>
      <label className="grid gap-2 text-sm text-muted">
        Email
        <input name="email" type="email" autoComplete="email" spellCheck={false} required className={field} />
      </label>
      <label className="grid gap-2 text-sm text-muted">
        <span>WhatsApp o teléfono — opcional</span>
        <input name="Telefono" type="tel" autoComplete="tel" inputMode="tel" className={field} />
      </label>
      <label className="grid gap-2 text-sm text-muted">
        Contanos qué necesitás resolver
        <textarea name="Mensaje" rows={5} className={field} />
      </label>
      <p id="contacto-datos" className="text-xs leading-relaxed text-muted">
        Al enviar, tu nombre, email, mensaje y teléfono opcional se transmiten a Web3Forms para que podamos responderte. Evitá incluir información sensible.
      </p>
      {state === 'error' && (
        <p role="alert" className="text-sm text-[#ff8a7a]">
          Hubo un problema al enviar. Intentá de nuevo o <a className="underline" href={whatsappUrl()} target="_blank" rel="noopener">escribinos por WhatsApp</a>.
        </p>
      )}
      <div>
        <button type="submit" disabled={state === 'loading'} className="btn cursor-target disabled:opacity-60">
          {state === 'loading' ? 'Enviando…' : 'Enviar consulta'} <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  )
}
