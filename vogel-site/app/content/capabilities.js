import { servicePages } from './servicePages.js';

// Capability Index rows. Titles/lines differ on purpose from the spatial arc ("Sistemas que ordenan.", etc.):
// the arc explains the idea, the index says what can be commissioned.
const page = id => servicePages[id];

export const capabilities = [
  { id: 'sistemas', title: 'Sistemas a medida', line: 'Ordenar operaciones, registros y permisos.', href: page('sistemas-a-medida').path, cta: 'home_service_sistemas-a-medida' },
  { id: 'automatizacion', title: 'Automatización', line: 'Conectar tareas y eliminar pasos repetitivos.', href: page('automatizacion-de-procesos').path, cta: 'home_service_automatizacion-de-procesos' },
  { id: 'datos', title: 'Datos & dashboards', line: 'Convertir actividad en información visible.', href: page('dashboards-ejecutivos').path, cta: 'home_service_dashboards-ejecutivos' },
  { id: 'ia', title: 'Inteligencia artificial', line: 'Asistir procesos concretos con criterio.', href: '/inteligencia-artificial/', cta: 'home_service_ia', anchor: 'ia' },
  { id: 'integraciones', title: 'Integraciones', line: 'Conectar herramientas y canales existentes.', href: page('integraciones-whatsapp').path, cta: 'home_service_integraciones-whatsapp' },
  { id: 'web', title: 'Desarrollo web', line: 'Construir experiencias y plataformas digitales.', href: page('desarrollo-web').path, cta: 'home_service_desarrollo-web' },
];

// Every other service route stays reachable from the home.
export const alsoServices = [
  { label: page('mantenimiento-de-equipos').shortTitle, href: page('mantenimiento-de-equipos').path, cta: 'home_service_mantenimiento-de-equipos' },
  { label: page('contaflow-api-facturacion-electronica').shortTitle, href: page('contaflow-api-facturacion-electronica').path, cta: 'home_service_contaflow-api-facturacion-electronica' },
  { label: 'Automatizaciones ARCA', href: '/automatizaciones/', cta: 'home_automatizaciones_arca' },
  { label: page('talleres-ia').shortTitle, href: page('talleres-ia').path, cta: 'home_service_talleres-ia' },
];
