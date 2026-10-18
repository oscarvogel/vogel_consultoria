import { type RouteConfig, index, route } from '@react-router/dev/routes'

// Same public URLs as the Vue site (public/sitemap.xml). Static segments outrank the :servicio catch.
export default [
  index('routes/home.tsx'),
  route('soluciones', 'routes/soluciones.tsx'),
  route('estudio', 'routes/estudio.tsx'),
  route('contacto', 'routes/contacto.tsx'),
  route('recursos', 'routes/recursos.tsx'),
  route('recursos/:slug', 'routes/recurso.tsx'),
  route('proyectos/:id', 'routes/proyecto.tsx'),
  route('inteligencia-artificial', 'routes/ia.tsx'),
  route('automatizaciones', 'routes/automatizaciones.tsx'),
  route('encuesta-contadores', 'routes/encuesta.tsx'),
  route('sitemap.xml', 'routes/sitemap.ts'),
  route(':servicio', 'routes/servicio.tsx'),
] satisfies RouteConfig
