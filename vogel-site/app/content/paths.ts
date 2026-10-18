import { servicePages } from './servicePages.js'
import { resources } from './resources.js'
import projectSummaries from './projectSummaries.json'

// Every prerendered page, with trailing slash like the Vue site and its sitemap.
export const pages = [
  '/',
  '/soluciones/',
  '/estudio/',
  '/contacto/',
  '/recursos/',
  '/inteligencia-artificial/',
  '/automatizaciones/',
  '/encuesta-contadores/',
  ...Object.values(servicePages).map((s) => s.path),
  ...resources.map((r) => r.path),
  ...Object.keys(projectSummaries).map((id) => `/proyectos/${id}/`),
]
