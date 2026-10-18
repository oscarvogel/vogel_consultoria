import projectMedia from './projectMedia.json';
import projectSummaries from './projectSummaries.json';
import servinLogo from '../assets/servin-servicios-informaticos.svg';
import municipalityLogo from '../assets/municipalidad-garuhape-misiones.svg';

// Resúmenes en projectSummaries.json: redactados a partir de fuentes públicas de cada proyecto.
// No describen el alcance de Vogel ni resultados: esos datos requieren confirmación del cliente.


const webProjects = [
 {id:'an-asociados',name:'AN Asociados',type:'Institucional',url:'https://anasociados.com.ar/',logo:'/clients/an-asociados.svg'},
 {id:'indufor',name:'Indufor',type:'Industrial',url:'https://indufor.com.ar/',logo:'/clients/indufor.svg'},
 {id:'forestal-paraguay',name:'Forestal Paraguay',type:'Forestal',url:'https://forestalparaguay.com/',logo:'/clients/forestal-paraguay.svg'},
 {id:'forestal-garuhape',name:'Forestal Garuhapé',type:'Forestal',url:'https://forestalgaruhape.com.ar/',logo:'/clients/forestal-garuhape.svg'},
 {id:'servin-lgsm',name:'Servin LGSM',type:'Servicios',url:'https://servinlgsm.com.ar/',logo:servinLogo},
 {id:'h21',name:'H21',type:'Comercial',url:'https://h21.ar/',logo:'/clients/h21.svg'},
 {id:'amitrac',name:'Amitrac',type:'Transporte',url:'https://amitrac.ar/',logo:'/clients/amitrac.svg'},
 {id:'municipalidad-garuhape',name:'Municipalidad de Garuhapé',type:'Institucional',url:'https://garuhape.gob.ar/',logo:municipalityLogo},
];

const softwareProjects = [
 {id:'femag',name:'FEMAG Desktop',type:'Sistema de escritorio',tag:'Aplicación de escritorio',alt:'Dashboard operativo de FEMAG Desktop en modo de demostración.',context:'Captura del modo demo local; no contiene datos operativos reales.',gallery:[]},
 {id:'pyfe',name:'PyFE',type:'Facturación electrónica',tag:'Código abierto · escritorio',url:'https://github.com/oscarvogel/pyfe',linkLabel:'Ver código en GitHub ↗',alt:'Pantalla principal de Asiento (PyFE) en homologación, con datos ficticios.',context:'Captura de Asiento en SQLite de prueba y homologación, sin comprobantes reales. PyFE es el nombre del repositorio.',gallery:[]},
 {id:'mantenimiento',name:'Mantenimiento de flotas',type:'Aplicación web',tag:'En desarrollo',url:'https://github.com/oscarvogel/mantenimiento',linkLabel:'Ver código en GitHub ↗',alt:'Dashboard de demostración para gestionar equipos y próximos mantenimientos de una flota.',context:'Demo con empresa, vehículo y servicio ficticios; el desarrollo sigue en curso.',gallery:[{...projectMedia.mantenimiento.desktop,src:'/projects/mantenimiento/desktop.webp',alt:'Dashboard web de demostración para gestionar camiones y mantenimientos próximos.',label:'Escritorio'},{...projectMedia.mantenimiento.mobile,src:'/projects/mantenimiento/mobile.webp',alt:'Vista móvil de demostración de la gestión de mantenimiento de flota.',label:'Móvil'}]},
 {id:'vogel-whatsapp-api',name:'Vogel WhatsApp API',type:'Mensajería empresarial',tag:'API REST · integración',url:'https://github.com/oscarvogel/vogel_whatsapp_api',linkLabel:'Ver código en GitHub ↗',alt:'Esquema conceptual de sistemas Vogel conectados a una API REST central y WhatsApp.',context:'Esquema conceptual basado en la documentación pública; no es una captura ni evidencia de una API en producción.',gallery:[]}
];

export const portfolioProjects = [...webProjects, ...softwareProjects].map(project => ({
 ...project, available: true,
 cover: `/projects/${project.id}/cover.webp`,
 alt: project.alt || `Portada del sitio web de ${project.name}.`,
 description: projectSummaries[project.id].summary,
 context: project.context || 'Capturas de octubre de 2026; el sitio puede haber cambiado. “Ver sitio” abre la versión actual.',
 gallery: project.gallery || [
   {...projectMedia[project.id].desktop,src:`/projects/${project.id}/desktop.webp`,alt:`Página completa del sitio de ${project.name} en escritorio.`,label:'Escritorio'},
   {...projectMedia[project.id].mobile,src:`/projects/${project.id}/mobile.webp`,alt:`Página completa del sitio de ${project.name} en teléfono.`,label:'Móvil'},
 ],
}));
