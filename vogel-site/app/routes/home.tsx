import Hero from '../sections/Hero'
import Clientes from '../sections/Clientes'
import Soluciones from '../sections/Soluciones'
import Metodo from '../sections/Metodo'
import Proyectos from '../sections/Proyectos'
import Estudio from '../sections/Estudio'
import Contacto from '../sections/Contacto'
import { pageMeta } from '../lib/meta'

export const meta = () =>
  pageMeta({
    title: 'Vogel Consultoría | Sistemas, Dashboards e IA para Empresas en Argentina',
    description:
      'Vogel Consultoría: desarrollamos sistemas a medida, dashboards ejecutivos, automatización de procesos e inteligencia artificial para empresas en Argentina. Convertimos datos en decisiones.',
    path: '/',
  })

// One dark surface with glass panels; the site-wide light pillar travels behind it (lib/pillar.ts, data-pillar on each section).
export default function Home() {
  return (
    <>
      <Hero />
      <Clientes />
      <Soluciones />
      <Metodo />
      <Proyectos />
      <Estudio />
      <Contacto />
    </>
  )
}
