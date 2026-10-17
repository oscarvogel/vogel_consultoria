import { site } from '../content/site'

// Per-page head: title, description, canonical, Open Graph / Twitter and one JSON-LD @graph.
// Organization fields are the Vue site's index.html graph, verbatim.

const abs = (path: string) => `${site.url}${path}`
const ORG = `${site.url}/#organization`
const WEBSITE = `${site.url}/#website`

const organization = {
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORG,
  name: site.name,
  url: `${site.url}/`,
  logo: abs('/logo-vogel.png'),
  description: 'Consultoría tecnológica especializada en sistemas a medida, dashboards ejecutivos, automatización de procesos e inteligencia artificial para empresas en Argentina.',
  sameAs: [site.instagram, site.linkedin],
  email: site.email,
  telephone: '+543743667526',
  areaServed: 'AR',
  address: { '@type': 'PostalAddress', addressCountry: 'AR' },
  contactPoint: { '@type': 'ContactPoint', contactType: 'consultas comerciales', email: site.email, telephone: '+543743667526', availableLanguage: ['es-AR'] },
  knowsAbout: ['sistemas a medida', 'dashboards ejecutivos', 'automatización de procesos', 'inteligencia artificial aplicada', 'capacitación en IA', 'desarrollo web'],
}
const website = { '@type': 'WebSite', '@id': WEBSITE, url: `${site.url}/`, name: site.name, inLanguage: 'es-AR', publisher: { '@id': ORG } }

type Crumb = { name: string; path: string }
type Faq = { question: string; answer: string }

/** Schema helpers for page-specific nodes. */
export const ld = {
  service: (path: string, serviceType: string, description: string, extra: object = {}) => ({
    '@type': 'Service', '@id': `${abs(path)}#service`, serviceType, provider: { '@id': ORG }, areaServed: 'AR', url: abs(path), description, ...extra,
  }),
  faq: (path: string, items: Faq[]) => ({
    '@type': 'FAQPage', '@id': `${abs(path)}#faq`, inLanguage: 'es-AR',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  }),
}

export function pageMeta({
  title, description, path, robots = 'index, follow', type = 'website', image = '/og-image.png', crumbs, graph = [], name,
}: {
  title: string; description: string; path: string; robots?: string; type?: 'website' | 'article'; image?: string
  /** Trail between Inicio and this page; the page itself is appended with `name`. Omit for the home. */
  crumbs?: Crumb[]; name?: string; graph?: object[]
}) {
  const url = abs(path)
  const isHome = path === '/'
  const nodes: object[] = [
    organization,
    website,
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'es-AR', isPartOf: { '@id': WEBSITE }, about: { '@id': ORG } },
    ...(isHome || !crumbs ? [] : [{
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Inicio', path: '/' }, ...crumbs, { name: name ?? title, path }].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
    }]),
    ...graph,
  ]
  return [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: robots },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:locale', content: 'es_AR' },
    { property: 'og:site_name', content: site.name },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: abs(image) },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: title },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: abs(image) },
    { 'script:ld+json': { '@context': 'https://schema.org', '@graph': nodes } },
  ]
}
