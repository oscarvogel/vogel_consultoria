import fieldWebp from '../assets/cases/forestal-campo.webp';
import reviewWebp from '../assets/cases/forestal-revision.webp';
import dashboardWebp from '../assets/cases/forestal-dashboard.webp';
import dashboardDesktopWebp from '../assets/cases/forestal-dashboard-desktop.webp';
import field from '../assets/cases/forestal-campo.png';
import review from '../assets/cases/forestal-revision.png';
import dashboard from '../assets/cases/forestal-dashboard.png';
import dashboardDesktop from '../assets/cases/forestal-dashboard-desktop.png';

export const forestCase = Object.freeze({
  title:'Del registro en campo a la decisión operativa.',
  titleLines:Object.freeze(['Del registro en campo','a la decisión operativa.']),
  intro:'Un caso real de digitalización operativa.',
  context:'Sistema de registro de producción anónimo.',
  disclaimer:'Interfaz real · datos de demostración',
  caveat:'Las cifras no representan resultados de un cliente.',
  // Single discreet note for the spatial sequence (legacy MiniCases keeps its own layout).
  footnote:'Sistema de registro de producción anónimo · interfaz real con datos de demostración.',
  service:'/dashboards-ejecutivos/',
  steps:Object.freeze([
    {id:'registrar',label:'Registrar',title:'Registrar donde ocurre el trabajo.',text:'Equipo, proceso, tiempos y producción reunidos en un registro de campo.',image:field,displayImage:fieldWebp,width:390,height:901,alt:'Formulario de producción forestal con datos de demostración.',cropTop:190,cropHeight:537,tallCropTop:0,tallCropHeight:780},
    {id:'revisar',label:'Revisar',title:'Revisar antes de consolidar.',text:'El operador revisa la jornada. La información conserva su contexto y trazabilidad.',image:review,displayImage:reviewWebp,width:390,height:1449,alt:'Pantalla de revisión de un registro forestal ficticio.',cropTop:448,cropHeight:600,tallCropTop:448,tallCropHeight:850},
    {id:'decidir',label:'Decidir',title:'Convertir el registro en una decisión.',text:'Indicadores, evolución y detalle operativo en una vista compartida de producción.',image:dashboard,displayImage:dashboardWebp,desktopImage:dashboardDesktop,desktopDisplayImage:dashboardDesktopWebp,width:390,height:1873,desktopWidth:1440,desktopHeight:1151,alt:'Dashboard operativo forestal. Todos los valores son ficticios.',cropTop:0,cropHeight:1151},
  ].map(Object.freeze)),
});
