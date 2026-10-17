import PageHero from '../components/PageHero'
import Steps from '../components/Steps'
import Faq from '../components/Faq'
import Contacto from '../sections/Contacto'
import { whatsappUrl } from '../content/site'
import { ld, pageMeta } from '../lib/meta'

export const meta = () =>
  pageMeta({
    title: 'Automatizaciones ARCA para Estudios Contables con IA | Vogel Consultoría',
    description: 'Automatizaciones ARCA para estudios contables: retenciones, percepciones, clientes delegados, evidencia y soporte con IA aplicada.',
    path: '/automatizaciones/',
    robots: 'index, follow, max-image-preview:large',
    crumbs: [{ name: 'Soluciones', path: '/soluciones/' }],
    name: 'Automatizaciones ARCA',
    graph: [
      ld.service('/automatizaciones/', 'Automatización contable con IA aplicada', 'Implementación de flujos ARCA para estudios contables: descarga mensual de retenciones y percepciones, clientes delegados, evidencia por CUIT y control humano.', {
        name: 'Automatizaciones ARCA para estudios contables',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Planes de automatización ARCA',
          itemListElement: plans.map((p) => p.price.startsWith('AR$')
            ? { '@type': 'Offer', name: `Plan ${p.name}`, price: p.price.replace(/\D/g, ''), priceCurrency: 'ARS' }
            : { '@type': 'Offer', name: `Plan ${p.name}`, priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'ARS', description: p.price } }),
        },
      }),
      ld.faq('/automatizaciones/', faqs),
    ],
  })

// Copy and prices verbatim from the Vue automatizaciones/index.html (launch prices; the JSON-LD offers above are derived from `plans`).
const demo = whatsappUrl('Hola Vogel Consultoría, quiero solicitar una demo de la automatización ARCA.')
const reference = [
  { title: 'Planilla operativa', text: 'Clientes activos y período a consultar.' },
  { title: 'Cliente delegado', text: 'Consulta autorizada por el estudio.' },
  { title: 'Evidencia por CUIT', text: 'Carpeta del período y resumen del lote.' },
]
const monthly = [
  { title: 'Planilla.', text: 'Se leen los clientes activos y el período a consultar antes de iniciar el lote.' },
  { title: 'Consulta.', text: 'Se opera únicamente con clientes delegados y dentro del alcance acordado con el estudio.' },
  { title: 'Revisión.', text: 'El estudio conserva sus autorizaciones y revisa el resultado antes de darlo por válido.' },
  { title: 'Evidencia.', text: 'La salida reúne carpetas por período y cliente, evidencia por CUIT y un resumen del lote.' },
]
const security = ['No se recopilan claves de clientes por canales compartidos.', 'La credencial no se copia entre equipos.', 'El estudio autoriza la operación y revisa cada lote.']
const scope = [
  { title: 'Entrada', text: 'Formato de planilla, clientes activos y período incluido.' },
  { title: 'Permisos', text: 'CUIT delegados habilitados para el estudio.' },
  { title: 'Salida', text: 'Carpetas por período, evidencia y resumen para revisar.' },
  { title: 'Ampliaciones', text: 'Tableros, integraciones y conciliaciones complejas se cotizan a medida.' },
]
const plans = [
  { name: 'Inicial', tag: 'piloto ordenado', price: 'AR$ 46.585', unit: 'precio final por mes', ideal: 'Para probar el flujo mensual con bajo riesgo y evidencia clara desde el primer lote.', meta: [['1', 'usuario'], ['20', 'clientes'], ['3 h', 'incluidas']], features: ['1 proceso mensual definido', 'Alta inicial de clientes delegados', 'Carpetas por período y CUIT', 'Resumen final para control'], cta: 'Consultar Inicial' },
  { name: 'Estudio', tag: 'más conveniente', hot: true, price: 'AR$ 77.198', unit: 'precio final por mes', ideal: 'La opción equilibrada para carga recurrente y semanas de vencimiento sensibles.', meta: [['2', 'usuarios'], ['60', 'clientes'], ['5 h', 'incluidas']], features: ['Hasta 2 procesos mensuales', 'Soporte prioritario en vencimientos', 'Ajustes menores del flujo', 'Seguimiento operativo del lote'], cta: 'Consultar Estudio' },
  { name: 'Avanzado', tag: 'mayor volumen', price: 'AR$ 89.177', unit: 'precio final por mes', ideal: 'Para equipos con más CUITs, más procesos y necesidad de acompañamiento en cierres.', meta: [['3', 'usuarios'], ['100', 'clientes'], ['7 h', 'incluidas']], features: ['Hasta 3 procesos mensuales', 'Prioridad operativa en cierre', 'Ajustes menores incluidos', 'Más capacidad sin rediseñar todo'], cta: 'Consultar Avanzado' },
  { name: 'Personalizado', tag: 'a medida', price: 'A presupuestar', unit: 'relevamiento previo', ideal: 'Para procesos internos, integraciones o reportes que exceden el alcance base.', meta: [['+', 'volumen'], ['+', 'servicios'], ['+', 'alcance']], features: ['Integraciones o tableros', 'Reportes particulares', 'Automatizaciones adicionales', 'Propuesta con tiempos y alcance'], cta: 'Relevar caso' },
]
const faqs = [
  { question: '¿Qué automatiza el flujo ARCA?', answer: 'Descarga y ordena retenciones y percepciones mensuales por cliente delegado, con evidencia por CUIT y resumen del lote.' },
  { question: '¿Necesita claves fiscales de clientes?', answer: 'No. Trabaja con la clave fiscal del estudio y servicios delegados. No pedimos claves de clientes por chat, correo ni planillas.' },
  { question: '¿Dónde entra la IA?', answer: 'La IA ayuda a ordenar información, asistir controles, documentar salidas y reducir tareas repetitivas dentro de un proceso supervisado.' },
  { question: '¿Qué queda fuera del inicio?', answer: 'Tableros, integraciones, envíos automáticos y conciliaciones complejas se relevan y presupuestan como alcance a medida.' },
]

export default function Automatizaciones() {
  return (
    <>
      <PageHero
        eyebrow="IA aplicada a procesos reales"
        title="Automatización ARCA para estudios contables."
        lead="Organizamos la descarga mensual de retenciones y percepciones por cliente delegado, con revisión del estudio y evidencia por CUIT."
        crumbs={[{ href: '/soluciones/', label: 'Soluciones' }]}
      >
        <a className="btn cursor-target" href={demo} target="_blank" rel="noopener">Solicitar demo breve <span aria-hidden="true">↗</span></a>
        <a className="ink-link cursor-target" href="#planes">Ver planes</a>
      </PageHero>

      <section aria-labelledby="referencia-titulo" className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mb-10 grid gap-4 lg:grid-cols-12 lg:items-end">
          <h2 id="referencia-titulo" className="text-[clamp(1.6rem,3.4vw,3.25rem)] lg:col-span-8" data-anim="lines">Del lote al control.</h2>
          <p className="text-sm text-muted lg:col-span-4 lg:justify-self-end" data-anim="fade">El estudio mantiene las autorizaciones y revisa la salida.</p>
        </div>
        <Steps steps={reference} />
      </section>

      <section aria-labelledby="circuito-titulo" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <p className="eyebrow text-muted" data-anim="fade">Desde la entrada controlada hasta la evidencia que revisa el estudio</p>
        <h2 id="circuito-titulo" className="mt-5 mb-14 max-w-4xl text-[clamp(1.9rem,5vw,5rem)]" data-anim="lines">El flujo mensual, paso a paso.</h2>
        <Steps steps={monthly} />
      </section>

      <section aria-labelledby="seguridad-titulo" className="grid gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-6">
          <p className="eyebrow text-muted" data-anim="fade">Seguridad y datos</p>
          <h2 id="seguridad-titulo" className="mt-5 text-[clamp(1.75rem,3.6vw,3.5rem)]" data-anim="lines">El acceso queda bajo control del estudio.</h2>
          <p className="mt-6 max-w-xl text-cream/75" data-anim="fade">La ejecución utiliza la clave fiscal del contador o estudio y los servicios delegados que autoriza. La credencial permanece local y cifrada en el equipo habilitado.</p>
        </div>
        <ul className="border-t border-line lg:col-span-5 lg:col-start-8" data-anim="stagger">
          {security.map((s) => (
            <li key={s} className="flex gap-4 border-b border-line py-6 text-lg">
              <span aria-hidden="true" className="text-amber">✓</span>
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="alcance-titulo" className="px-5 pb-24 sm:px-8 lg:px-12">
        <p className="eyebrow text-muted" data-anim="fade">Alcance inicial</p>
        <h2 id="alcance-titulo" className="mt-5 mb-12 text-[clamp(1.75rem,3.6vw,3.5rem)]" data-anim="lines">Qué se define en el primer circuito.</h2>
        <Steps steps={scope} />
      </section>

      <section id="planes" aria-labelledby="planes-titulo" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <p className="eyebrow text-muted" data-anim="fade">Precios de lanzamiento</p>
        <h2 id="planes-titulo" className="mt-5 max-w-4xl text-[clamp(1.9rem,4.4vw,4.5rem)]" data-anim="lines">Planes pensados para crecer sin perder control.</h2>
        <p className="mt-6 max-w-2xl text-cream/75" data-anim="fade">10% de descuento para contadores matriculados en el CPCEM. Sujeto a validación de matrícula al solicitar la demo.</p>
        <ul className="mt-14 grid gap-5 md:grid-cols-2 2xl:grid-cols-4" data-anim="stagger">
          {plans.map((p) => (
            <li key={p.name} className={`flex flex-col rounded-lg border p-7 ${p.hot ? 'glass border-amber' : 'glass'}`}>
              <p className={`eyebrow ${p.hot ? 'text-amber' : 'text-muted'}`}>{p.tag}</p>
              <h3 className="mt-4 text-[clamp(1.5rem,1.8vw,1.875rem)]">{p.name}</h3>
              <p className="mt-6 font-display text-3xl font-extrabold [font-stretch:110%]">{p.price}</p>
              <p className="text-sm text-muted">{p.unit}</p>
              <p className="mt-5 text-cream/75">{p.ideal}</p>
              <dl className="mt-6 grid grid-cols-3 border-y border-line py-4 text-center">
                {p.meta.map(([v, l]) => (
                  <div key={l}>
                    <dt className="sr-only">{l}</dt>
                    <dd className="font-display text-xl font-extrabold">{v}</dd>
                    <dd className="text-xs text-muted">{l}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-6 grid gap-2 text-sm text-cream/80">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><span aria-hidden="true" className="text-amber">·</span>{f}</li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <a className={`${p.hot ? 'btn' : 'ink-link'} cursor-target`} href={demo} target="_blank" rel="noopener">
                  {p.cta} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Faq items={faqs} title="Automatización contable, IA y control fiscal" />

      <Contacto
        title="Revisemos si este circuito aplica a tu estudio."
        text="En una demo breve se revisan la entrada, los permisos delegados y la evidencia que genera el flujo, sin solicitar claves de clientes."
      />
    </>
  )
}
