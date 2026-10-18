import { useParams } from 'react-router'
import { getRelatedServices, servicePages } from '../content/servicePages.js'
import PageHero from '../components/PageHero'
import Steps from '../components/Steps'
import Faq from '../components/Faq'
import NotFound from '../components/NotFound'
import Contacto from '../sections/Contacto'
import { ld, pageMeta } from '../lib/meta'

type Service = {
  id: string; path: string; eyebrow: string; title: string; shortTitle: string; metaTitle: string; metaDescription: string
  summary: string; intro?: string; ctaLabel: string; ctaUrl: string; secondaryCtaLabel?: string; secondaryCtaUrl?: string
  problems: string[]; includes: string[]; process: string[]; deliverables: string[]
  benefits?: { title: string; description: string }[]; apiExamples?: { success: string; error: string }
  faqs: { question: string; answer: string }[]
}

const find = (slug?: string) => (servicePages as Record<string, Service>)[slug ?? '']

// Flow per service, verbatim from the Vue ServicePage. Orientative: the real steps are agreed with each organization.
const flows: Record<string, { title: string; nodes: { title: string; text: string }[] }> = {
  'sistemas-a-medida': { title: 'De los datos separados a una operación compartida.', nodes: [{ title: 'Fuentes', text: 'Ventas, existencias y clientes.' }, { title: 'Reglas', text: 'Permisos y validaciones del proceso.' }, { title: 'Operación', text: 'Tareas con contexto y trazabilidad.' }] },
  'dashboards-ejecutivos': { title: 'De la fuente a una lectura que la dirección puede usar.', nodes: [{ title: 'Fuentes', text: 'Planillas y sistemas disponibles.' }, { title: 'Indicadores', text: 'Criterios definidos con el negocio.' }, { title: 'Lectura', text: 'Una vista comparable para decidir.' }] },
  'automatizacion-de-procesos': { title: 'Una tarea repetida convertida en un flujo revisable.', nodes: [{ title: 'Evento', text: 'Qué inicia el trabajo.' }, { title: 'Reglas', text: 'Qué se procesa y qué se deriva.' }, { title: 'Revisión', text: 'Cómo se valida el resultado.' }] },
  'contaflow-api-facturacion-electronica': { title: 'Una solicitud. Una respuesta fiscal normalizada.', nodes: [{ title: 'Solicitud', text: 'Datos del comprobante.' }, { title: 'AFIP / ARCA', text: 'Autorización o rechazo.' }, { title: 'Respuesta', text: 'CAE, vencimiento o error.' }] },
  'desarrollo-web': { title: 'De una propuesta clara a una consulta.', nodes: [{ title: 'Propuesta', text: 'Qué ofrece la organización.' }, { title: 'Contenido', text: 'Servicios y evidencia.' }, { title: 'Consulta', text: 'Contacto desde cada pantalla.' }] },
  'talleres-ia': { title: 'Una tarea cotidiana, practicada con criterio.', nodes: [{ title: 'Tarea', text: 'Un ejercicio del trabajo real.' }, { title: 'Práctica', text: 'Herramientas y fuentes.' }, { title: 'Criterio', text: 'Revisión y buenas prácticas.' }] },
  'mantenimiento-de-equipos': { title: 'De cada equipo a un trabajo de mantenimiento trazable.', nodes: [{ title: 'Equipo', text: 'Lecturas y vencimientos.' }, { title: 'Plan', text: 'Mantenimiento preventivo.' }, { title: 'Trabajo', text: 'Solicitudes y órdenes.' }] },
  'integraciones-whatsapp': { title: 'Un contacto que conserva el contexto operativo.', nodes: [{ title: 'Evento', text: 'Qué inicia la conversación.' }, { title: 'Mensaje', text: 'La información que necesita cada parte.' }, { title: 'Registro', text: 'La respuesta queda en el proceso.' }] },
}
const fallbackFlow = { title: 'Del proceso actual a una salida revisable.', nodes: [{ title: 'Contexto', text: 'Información y tareas.' }, { title: 'Solución', text: 'Alcance acordado.' }, { title: 'Revisión', text: 'Validación con el equipo.' }] }

export const meta = ({ params }: { params: { servicio?: string } }) => {
  const page = find(params.servicio)
  return page ? pageMeta({
        title: page.metaTitle, description: page.metaDescription, path: page.path, crumbs: [{ name: 'Soluciones', path: '/soluciones/' }], name: page.shortTitle,
        graph: [ld.service(page.path, page.eyebrow, page.summary), ld.faq(page.path, page.faqs)],
      }) : [{ title: 'Página no encontrada | Vogel Consultoría' }]
}

export default function Servicio() {
  const page = find(useParams().servicio)
  if (!page) return <NotFound />
  const flow = flows[page.id] ?? fallbackFlow
  const related = getRelatedServices(page) as Service[]

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.summary} crumbs={[{ href: '/soluciones/', label: 'Soluciones' }]}>
        <a className="btn cursor-target" href={page.ctaUrl} target="_blank" rel="noopener">{page.ctaLabel} <span aria-hidden="true">↗</span></a>
        <a className="ink-link cursor-target" href={page.secondaryCtaUrl || '#contacto'}>{page.secondaryCtaLabel || 'Agendar diagnóstico'}</a>
      </PageHero>

      <section aria-labelledby="flujo-titulo" className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mb-10 grid gap-4 lg:grid-cols-12 lg:items-end">
          <h2 id="flujo-titulo" className="text-[clamp(1.6rem,3.4vw,3.25rem)] lg:col-span-8" data-anim="lines">{flow.title}</h2>
          <p className="text-sm text-muted lg:col-span-4 lg:justify-self-end" data-anim="fade">Esquema orientativo. Los pasos y el alcance se definen con cada organización.</p>
        </div>
        <Steps steps={flow.nodes} />
        {page.intro && <p className="mt-10 max-w-2xl text-cream/75" data-anim="fade">{page.intro}</p>}
      </section>

      <section aria-labelledby="problemas-titulo" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <p className="eyebrow text-muted" data-anim="fade">Problemas que resolvemos</p>
        <h2 id="problemas-titulo" className="mt-5 max-w-4xl text-[clamp(1.9rem,5vw,5rem)]" data-anim="lines">Menos fricción, más información útil.</h2>
        <ol className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-3" data-anim="stagger">
          {page.problems.map((p, i) => (
            <li key={p}>
              <span aria-hidden="true" className="font-display text-[clamp(3.5rem,6vw,6rem)] leading-none font-extrabold text-transparent [-webkit-text-stroke:1.5px_rgb(243_241_226/0.6)] [font-stretch:125%]">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-6 text-xl">{p}</p>
            </li>
          ))}
        </ol>
      </section>

      {page.benefits && (
        <section aria-labelledby="beneficios-titulo" className="px-5 py-24 sm:px-8 lg:px-12">
          <p className="eyebrow text-muted" data-anim="fade">Beneficios</p>
          <h2 id="beneficios-titulo" className="mt-5 max-w-4xl text-[clamp(1.9rem,4.4vw,4.5rem)]" data-anim="lines">Una capa fiscal pensada para equipos técnicos.</h2>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" data-anim="stagger">
            {page.benefits.map((b) => (
              <li key={b.title} className="glass rounded-lg p-7">
                <p className="display text-xl">{b.title}</p>
                <p className="mt-3 text-cream/70">{b.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {page.apiExamples && (
        <section aria-labelledby="api-titulo" className="grid gap-10 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-muted" data-anim="fade">Respuesta API</p>
            <h2 id="api-titulo" className="mt-5 text-[clamp(1.6rem,2.8vw,3rem)]" data-anim="lines">Mandá el comprobante. Recibí una respuesta lista para usar.</h2>
            <p className="mt-6 text-cream/75" data-anim="fade">La documentación técnica queda preparada para revisar el caso de uso, validar el circuito de emisión y definir los campos necesarios antes de integrar.</p>
          </div>
          <div className="grid gap-5 lg:col-span-7" data-anim="stagger">
            {[{ label: 'Autorizado', badge: '200 OK', code: page.apiExamples.success }, { label: 'Rechazado', badge: 'Error detallado', code: page.apiExamples.error }].map((x) => (
              <figure key={x.label} className="glass overflow-hidden rounded-lg">
                <figcaption className="flex items-center justify-between border-b border-line px-5 py-3">
                  <span className="eyebrow text-amber">{x.label}</span>
                  <span className="eyebrow text-muted">{x.badge}</span>
                </figcaption>
                <pre className="overflow-x-auto p-5 text-sm leading-relaxed text-cream/85"><code>{x.code}</code></pre>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="incluye-titulo" className="grid gap-16 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div>
          <p className="eyebrow text-muted" data-anim="fade">Qué incluye</p>
          <h2 id="incluye-titulo" className="mt-5 text-[clamp(1.75rem,3.6vw,3.5rem)]" data-anim="lines">Trabajo concreto, no diagnóstico eterno.</h2>
          <ul className="mt-10 border-t border-line" data-anim="stagger">
            {page.includes.map((item) => (
              <li key={item} className="flex gap-4 border-b border-line py-5 text-cream/85">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-muted" data-anim="fade">Proceso</p>
          <h2 className="mt-5 text-[clamp(1.75rem,3.6vw,3.5rem)]" data-anim="lines">Cómo avanzamos.</h2>
          <ol className="mt-10 border-t border-line" data-anim="stagger">
            {page.process.map((step, i) => (
              <li key={step} className="flex gap-5 border-b border-line py-5 text-cream/85">
                <span className="font-display text-sm font-extrabold text-amber">{String(i + 1).padStart(2, '0')}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="entregables-titulo" className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="glass rounded-lg p-7 lg:p-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-muted">Entregables</p>
              <h2 id="entregables-titulo" className="mt-4 text-[clamp(1.75rem,3.6vw,3.5rem)]">Qué queda funcionando.</h2>
            </div>
            <a className="ink-link cursor-target" href={page.ctaUrl} target="_blank" rel="noopener">Consultar alcance <span aria-hidden="true">↗</span></a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-3" data-anim="stagger">
            {page.deliverables.map((d) => (
              <li key={d} className="rounded-full border border-line px-5 py-2.5 text-cream/90">{d}</li>
            ))}
          </ul>
        </div>
      </section>

      <Faq items={page.faqs} />

      <section aria-labelledby="relacionados-titulo" className="px-5 pb-28 sm:px-8 lg:px-12">
        <p className="eyebrow text-muted" data-anim="fade">Servicios relacionados</p>
        <h2 id="relacionados-titulo" className="mt-5 text-[clamp(1.75rem,3.6vw,3.5rem)]" data-anim="lines">También puede servirte.</h2>
        <ul className="mt-12 grid gap-5 md:grid-cols-3" data-anim="stagger">
          {related.map((s) => (
            <li key={s.id}>
              <a href={s.path} className="cursor-target group flex h-full flex-col justify-between gap-8 rounded-lg border border-line p-7 transition-colors duration-500 hover:border-amber/60" data-cursor-label="Ver servicio">
                <div>
                  <p className="display text-xl">{s.shortTitle}</p>
                  <p className="mt-3 text-cream/70">{s.summary}</p>
                </div>
                <span className="ink-link">Ver servicio <span aria-hidden="true">↗</span></span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Contacto title="Veamos si este servicio encaja." text="Una conversación inicial alcanza para ordenar el problema, detectar oportunidades y definir si conviene avanzar con un diagnóstico más concreto." />
    </>
  )
}
