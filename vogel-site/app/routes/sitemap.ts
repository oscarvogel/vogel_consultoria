import { pages } from '../content/paths'
import { site } from '../content/site'

// Prerendered at build time to build/client/sitemap.xml. Priorities mirror the Vue site's hand-written sitemap.
const noindex = ['/encuesta-contadores/']
const rank = (path: string): [string, string] => {
  if (path === '/') return ['1.0', 'monthly']
  if (path === '/soluciones/' || path === '/inteligencia-artificial/') return ['0.9', 'monthly']
  if (path === '/recursos/') return ['0.7', 'weekly']
  if (path.startsWith('/recursos/') || path === '/estudio/' || path === '/contacto/') return ['0.7', 'monthly']
  if (path.startsWith('/proyectos/')) return ['0.6', 'monthly']
  return ['0.8', 'monthly']
}

export function loader() {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = pages
    .filter((p) => !noindex.includes(p))
    .map((p) => {
      const [priority, changefreq] = rank(p)
      return `  <url>\n    <loc>${site.url}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    })
    .join('\n')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
