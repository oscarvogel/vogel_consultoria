import PageHero from '../components/PageHero'
import Contacto from '../sections/Contacto'
import { pageMeta } from '../lib/meta'

export const meta = () =>
  pageMeta({
    title: 'Contacto — Vogel Consultoría',
    description: 'Contanos dónde se traba el trabajo. Definimos un próximo paso con alcance claro.',
    path: '/contacto/',
    crumbs: [],
    name: 'Contacto',
  })

export default function ContactoPage() {
  return (
    <>
      <PageHero eyebrow="Contacto" title="Hablemos de lo que necesitás resolver." lead="Contanos dónde se traba el trabajo. Definimos un próximo paso con alcance claro." />
      <Contacto title="Escribinos." text="Por email, WhatsApp o con el formulario. Te respondemos a la brevedad con un plan inicial." />
    </>
  )
}
