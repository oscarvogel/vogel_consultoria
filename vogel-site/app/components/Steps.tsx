type Step = { title?: string; text?: string }

/** Numbered sequence joined by a rule: replaces the Vue site's ProcessFlowDiagram and narrative chapters.
 *  Steps without a title are full sentences, so they read at body size instead of the display face. */
export default function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className={`grid gap-px sm:grid-cols-2 ${steps.length > 3 ? 'xl:grid-cols-4' : 'lg:grid-cols-3'}`} data-anim="stagger">
      {steps.map((s, i) => (
        <li key={i} className="border-t border-line pt-6 pr-6 pb-8">
          <span className="eyebrow text-amber">{String(i + 1).padStart(2, '0')}</span>
          {s.title && <p className="display mt-4 text-[clamp(1.25rem,1.8vw,2rem)]">{s.title}</p>}
          {s.text && <p className={s.title ? 'mt-3 max-w-xs text-muted' : 'mt-4 max-w-xs text-xl'}>{s.text}</p>}
        </li>
      ))}
    </ol>
  )
}
