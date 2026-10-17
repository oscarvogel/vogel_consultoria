import PageHero from '../components/PageHero'
import Estudio from '../sections/Estudio'
import Metodo from '../sections/Metodo'
import Contacto from '../sections/Contacto'
import { pageMeta } from '../lib/meta'

export const meta = () =>
  pageMeta({
    title: 'Estudio — Vogel Consultoría',
    description: 'Conocé el método y el equipo de Vogel Consultoría: tecnología con criterio de negocio e implementación concreta.',
    path: '/estudio/',
    crumbs: [],
    name: 'Estudio',
  })

export default function EstudioPage() {
  return (
    <>
      <PageHero
        eyebrow="Estudio"
        title="Tecnología con criterio de negocio."
        lead="Convertimos datos y procesos en decisiones que mejoran tu rentabilidad. No vendemos software: resolvemos problemas con implementación concreta y acompañamiento práctico."
      />
      <Estudio />
      <Metodo />
      <Contacto />
    </>
  )
}
