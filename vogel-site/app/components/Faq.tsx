type Item = { question: string; answer: string }

export default function Faq({ items, title = 'Antes de empezar', eyebrow = 'Preguntas frecuentes' }: { items: Item[]; title?: string; eyebrow?: string }) {
  return (
    <section aria-labelledby="faq-titulo" className="px-5 py-24 sm:px-8 lg:px-12">
      <div className="grid gap-10">
        <div>
          <p className="eyebrow text-muted" data-anim="fade">{eyebrow}</p>
          <h2 id="faq-titulo" className="mt-5 max-w-4xl text-[clamp(1.9rem,4vw,4rem)]" data-anim="lines">{title}</h2>
        </div>
        <div className="max-w-4xl border-t border-line" data-anim="stagger">
          {items.map((f) => (
            <details key={f.question} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium sm:text-xl [&::-webkit-details-marker]:hidden">
                {f.question}
                <span aria-hidden="true" className="text-2xl text-amber transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-2xl pb-7 text-cream/75">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
