import projectMedia from './projectMedia.json';
import projectSummaries from './projectSummaries.json';
import servinLogo from '../assets/servin-servicios-informaticos.svg';
import municipalityLogo from '../assets/municipalidad-garuhape-misiones.svg';

// Resúmenes en projectSummaries.json: redactados a partir de lo que cada sitio afirma de sí mismo (relevado el 7 de octubre de 2026).
// No describen el alcance de Vogel ni resultados: esos datos requieren confirmación del cliente.


export const webProjects = [
 {id:'an-asociados',name:'AN Asociados',type:'Institucional',url:'https://anasociados.com.ar/',logo:'/clients/an-asociados.svg'},
 {id:'indufor',name:'Indufor',type:'Industrial',url:'https://indufor.com.ar/',logo:'/clients/indufor.svg'},
 {id:'forestal-paraguay',name:'Forestal Paraguay',type:'Forestal',url:'https://forestalparaguay.com/',logo:'/clients/forestal-paraguay.svg'},
 {id:'forestal-garuhape',name:'Forestal Garuhapé',type:'Forestal',url:'https://forestalgaruhape.com.ar/',logo:'/clients/forestal-garuhape.svg'},
 {id:'servin-lgsm',name:'Servin LGSM',type:'Servicios',url:'https://servinlgsm.com.ar/',logo:servinLogo},
 {id:'h21',name:'H21',type:'Comercial',url:'https://h21.ar/',logo:'/clients/h21.svg'},
 {id:'amitrac',name:'Amitrac',type:'Transporte',url:'https://amitrac.ar/',logo:'/clients/amitrac.svg'},
 {id:'municipalidad-garuhape',name:'Municipalidad de Garuhapé',type:'Institucional',url:'https://garuhape.gob.ar/',logo:municipalityLogo}
].map(project => ({
 ...project, available: true,
 cover: `/projects/${project.id}/cover.webp`,
 alt: `Portada del sitio web de ${project.name}.`,
 description: projectSummaries[project.id].summary,
 context: 'Capturas del sitio público tomadas a comienzos de octubre de 2026; puede haber cambiado desde entonces. “Ver sitio” abre su versión actual.',
 gallery: [
   {...projectMedia[project.id].desktop,src:`/projects/${project.id}/desktop.webp`,alt:`Página completa del sitio de ${project.name} en escritorio.`,label:'Escritorio'},
   {...projectMedia[project.id].mobile,src:`/projects/${project.id}/mobile.webp`,alt:`Página completa del sitio de ${project.name} en teléfono.`,label:'Móvil'},
 ],
}));
