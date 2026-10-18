import PageHero from '../components/PageHero'
import Steps from '../components/Steps'
import Faq from '../components/Faq'
import Contacto from '../sections/Contacto'
import { whatsappUrl } from '../content/site'
import { ld, pageMeta } from '../lib/meta'

export const meta = () =>
  pageMeta({
    title: 'Inteligencia Artificial para Empresas en Argentina | Vogel Consultoría',
    description: 'Implementamos inteligencia artificial en tu empresa sin complicaciones: automatización, asistentes internos, GPTs personalizados, análisis de datos y diagnóstico gratuito.',
    path: '/inteligencia-artificial/',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    image: '/og-ia.png',
    crumbs: [{ name: 'Soluciones', path: '/soluciones/' }],
    name: 'Inteligencia artificial',
    graph: [ld.service('/inteligencia-artificial/', 'Inteligencia artificial para empresas', 'Implementamos inteligencia artificial en empresas: automatización, asistentes internos, GPTs personalizados, análisis de datos y capacitación para equipos.', { name: 'Implementación de Inteligencia Artificial para Empresas' }), ld.faq('/inteligencia-artificial/', faqs)],
  })

// Copy verbatim from the Vue IA page components (HeroIA, IAStoryChapter, UseCasesIA, ServicesIA, ProcessIA, CustomGPTIA, FAQIA, CTAIA).
const flow = [
  { title: 'Información', text: 'Fuentes y contexto definidos.' },
  { title: 'Asistencia', text: 'Resumen, clasificación o borrador.' },
  { title: 'Revisión', text: 'Una persona valida el resultado.' },
  { title: 'Proceso', text: 'La salida vuelve al trabajo diario.' },
]
const chapter = [
  { title: 'Elegir la tarea.', text: 'Priorizamos una actividad repetida o difícil de revisar y acordamos quién usará el resultado.' },
  { title: 'Preparar el contexto.', text: 'Definimos las fuentes, permisos e instrucciones que necesita la asistencia.' },
  { title: 'Revisar la salida.', text: 'El equipo verifica respuestas, corrige excepciones y conserva la decisión final.' },
  { title: 'Volver al proceso.', text: 'Integramos la salida validada al trabajo habitual y dejamos documentados sus límites.' },
]
const useCases = [
  'Consultar ventas con preguntas en lenguaje natural.',
  'Resumir o comparar archivos Excel y PDF.',
  'Preparar borradores para preguntas frecuentes de clientes.',
  'Revisar reportes y señalar variaciones para validar.',
  'Consultar procedimientos internos desde un asistente.',
]
const services = [
  { title: 'Consultoría y priorización', description: 'Identificar tareas posibles y ordenar los casos según sus fuentes, permisos y necesidad de revisión.' },
  { title: 'Asistentes internos', description: 'Organizar consultas y procedimientos del equipo en herramientas con alcance definido.' },
  { title: 'Automatización de procesos', description: 'Incorporar asistencia en pasos acotados, con revisión humana donde corresponda.' },
  { title: 'Integración con sistemas', description: 'Evaluar cómo conectar las herramientas con la información y los sistemas disponibles.' },
  { title: 'Capacitación práctica', description: 'Talleres para que cada equipo aplique criterios compartidos a tareas reales.' },
]
const process = [
  { text: 'Elegir una tarea prioritaria y acordar quién la revisa.' },
  { text: 'Definir las fuentes disponibles, los permisos y los límites.' },
  { text: 'Probar la asistencia con ejemplos representativos.' },
  { text: 'Validar con el equipo y acordar los siguientes ajustes.' },
]
const gptUrl = 'https://chatgpt.com/g/g-6a1f60761f0c8191a2291feca1606592-vogel-ia-contable-comercial'
const gptShare = `https://wa.me/?text=${encodeURIComponent(`Hola, te comparto Vogel IA Contable Comercial, un GPT de Vogel Consultoría para consultas contables, comerciales y de IA aplicada: ${gptUrl}`)}`
const gptUses = [
  'Responder consultas frecuentes con el criterio de tu negocio.',
  'Guiar procesos internos, ventas, administración o atención al cliente.',
  'Ordenar conocimiento de tu equipo en un asistente fácil de compartir.',
]
const faqs = [
  { question: '¿Necesito saber de tecnología?', answer: 'No. Nosotros traducimos todo a lenguaje de negocio y te guiamos paso a paso.' },
  { question: '¿Tengo que cambiar mis sistemas?', answer: 'En la mayoría de los casos no. Integramos la IA con lo que ya usás y mejoramos sobre esa base.' },
  { question: '¿Esto es caro?', answer: 'Se puede empezar de forma gradual con proyectos acotados y retorno visible en poco tiempo.' },
  { question: '¿Puedo empezar con algo chico?', answer: 'Sí. Recomendamos un primer caso de alto impacto y baja complejidad para validar resultados rápido.' },
]

export default function IA() {
  return (
    <>
      <PageHero
        eyebrow="Inteligencia artificial"
        title="IA aplicada a tareas concretas."
        lead="Definimos qué tarea puede asistir la IA, qué información necesita y cómo revisa el equipo cada resultado."
        crumbs={[{ href: '/soluciones/', label: 'Soluciones' }]}
      >
        <a className="btn cursor-target" href="#contacto">Agendar diagnóstico <span aria-hidden="true">→</span></a>
        <a className="ink-link cursor-target" href={whatsappUrl('Hola quiero implementar IA en mi empresa')} target="_blank" rel="noopener">Consultar por WhatsApp <span aria-hidden="true">↗</span></a>
      </PageHero>

      <section aria-labelledby="flujo-titulo" className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mb-10 grid gap-4 lg:grid-cols-12 lg:items-end">
          <h2 id="flujo-titulo" className="text-[clamp(1.6rem,3.4vw,3.25rem)] lg:col-span-8" data-anim="lines">Información con contexto y validación humana.</h2>
          <p className="text-sm text-muted lg:col-span-4 lg:justify-self-end" data-anim="fade">Las fuentes, el uso y la revisión se definen antes de integrar una asistencia.</p>
        </div>
        <Steps steps={flow} />
      </section>

      <section aria-labelledby="capitulo-titulo" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <p className="eyebrow text-muted" data-anim="fade">Del contexto a una asistencia revisable</p>
        <h2 id="capitulo-titulo" className="mt-5 mb-14 max-w-4xl text-[clamp(1.9rem,5vw,5rem)]" data-anim="lines">Una secuencia para sumar IA sin perder el control.</h2>
        <Steps steps={chapter} />
      </section>

      <section aria-labelledby="casos-titulo" className="grid gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-muted" data-anim="fade">Ejemplos para evaluar</p>
          <h2 id="casos-titulo" className="mt-5 text-[clamp(1.75rem,3.6vw,3.5rem)]" data-anim="lines">Tareas donde una asistencia puede ser útil.</h2>
          <p className="mt-6 text-muted" data-anim="fade">Cada caso requiere revisar fuentes, permisos y el nivel de validación adecuado.</p>
        </div>
        <ol className="border-t border-line lg:col-span-7" data-anim="stagger">
          {useCases.map((c, i) => (
            <li key={c} className="flex gap-6 border-b border-line py-6 text-lg">
              <span className="font-display text-sm font-extrabold text-amber">{String(i + 1).padStart(2, '0')}</span>
              {c}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="capacidades-titulo" className="grid gap-12 px-5 pb-24 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-muted" data-anim="fade">Capacidades</p>
          <h2 id="capacidades-titulo" className="mt-5 text-[clamp(1.75rem,3.6vw,3.5rem)]" data-anim="lines">Formas de incorporar IA al trabajo.</h2>
        </div>
        <ul className="border-t border-line lg:col-span-7" data-anim="stagger">
          {services.map((s) => (
            <li key={s.title} className="border-b border-line py-6">
              <h3 className="text-xl">{s.title}</h3>
              <p className="mt-2 text-cream/70">{s.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="implementacion-titulo" className="px-5 pb-24 sm:px-8 lg:px-12">
        <p className="eyebrow text-muted" data-anim="fade">Implementación</p>
        <h2 id="implementacion-titulo" className="mt-5 mb-12 max-w-4xl text-[clamp(1.75rem,3.6vw,3.5rem)]" data-anim="lines">Pruebas acotadas, con criterios de revisión definidos.</h2>
        <Steps steps={process} />
      </section>

      <section aria-labelledby="gpt-titulo" className="grid gap-5 px-5 pb-24 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div className="flex flex-col justify-between gap-10 glass rounded-lg p-8 lg:p-12" data-anim="fade">
          <div>
            <p className="eyebrow text-amber">GPT personalizado</p>
            <h2 id="gpt-titulo" className="mt-5 text-[clamp(1.75rem,3.2vw,3rem)]">Probá Vogel IA Contable Comercial.</h2>
            <p className="mt-6 text-cream/75">Un asistente creado para acercar consultas contables, comerciales y de inteligencia artificial aplicada a estudios, empresas y profesionales.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a className="btn cursor-target" href={gptUrl} target="_blank" rel="noopener">Abrir el GPT <span aria-hidden="true">↗</span></a>
            <a className="ink-link" href={gptShare} target="_blank" rel="noopener">Compartir por WhatsApp</a>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-10 rounded-lg border border-line p-8 lg:p-12" data-anim="fade">
          <div>
            <p className="eyebrow text-muted">También para tu organización</p>
            <h3 className="mt-5 text-[clamp(1.5rem,2.6vw,2.4rem)]">Creamos GPTs a medida para empresas, estudios y equipos.</h3>
            <ul className="mt-8 grid gap-3">
              {gptUses.map((u) => (
                <li key={u} className="flex gap-3 text-cream/80">
                  <span aria-hidden="true" className="text-amber">✓</span>
                  {u}
                </li>
              ))}
            </ul>
          </div>
          <a className="ink-link self-start" href={whatsappUrl('Hola Oscar, quiero crear un GPT personalizado para mi empresa o estudio')} target="_blank" rel="noopener">Quiero mi GPT personalizado <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <Faq items={faqs} title="Objeciones frecuentes" eyebrow="Preguntas" />

      <Contacto
        title="Definamos un uso de IA con contexto."
        text="La conversación sirve para elegir una tarea, revisar su información y acordar cómo comprobar si la asistencia aporta valor."
      />
    </>
  )
}
