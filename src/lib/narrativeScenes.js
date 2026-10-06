// The first arc deliberately ends at systems. The Phase 1 definitions stay independent.
export const narrativeScenes = Object.freeze([
  { id:'intro', position:[0,4.4,15], target:[0,.2,-14], fov:47, depth:80,
    intensity:.85, visibility:1, connections:.35, dispersion:0, order:0, clusters:0 },
  { id:'complexity', position:[0,2.6,1], target:[0,1,-18], fov:51, depth:80,
    intensity:.45, visibility:.48, connections:.4, dispersion:1, order:0, clusters:1 },
  { id:'systems', position:[6,4,-4], target:[0,.8,-23], fov:47, depth:80,
    intensity:.42, visibility:.45, connections:.9, dispersion:0, order:1, clusters:1 },
].map(Object.freeze));
export const narrativeRanges = Object.freeze([
  {start:0,end:.20,from:'intro',to:'intro'},
  {start:.20,end:.38,from:'intro',to:'complexity'},
  {start:.38,end:.65,from:'complexity',to:'complexity'},
  {start:.65,end:.82,from:'complexity',to:'systems'},
  {start:.82,end:1,from:'systems',to:'systems'},
]);
export const clusterDefinitions = Object.freeze([
  {name:'OPERACIÓN', scattered:[-8,1,-10], ordered:[-5,1,-18]},
  {name:'ADMINISTRACIÓN', scattered:[8,2,-16], ordered:[0,1,-23]},
  {name:'INFORMACIÓN', scattered:[-6,2,-26], ordered:[5,1,-28]},
  {name:'REPORTES', scattered:[10,1,-33], ordered:[8,1,-36]},
]);

// Phase 2 exports above remain the comparison contract. One configuration owns
// the extended HTML heights, scroll beats and state definitions below.
export const phase03Moments = Object.freeze([
  {id:'automation',anchor:'automatizacion-espacial',height:1.1,label:'AUTOMATIZACIÓN',marker:'03',title:'Procesos que avanzan.',copy:'Conectamos tareas y reglas para que la información avance sin depender de pasos repetitivos.',meaning:'Una actividad recorre las áreas del sistema y activa el siguiente paso.'},
  {id:'data',anchor:'datos-espaciales',height:1.1,label:'DATOS',marker:'04',title:'Datos que explican.',copy:'Lo que ocurre en la operación se convierte en información comparable y visible.',meaning:'La actividad se organiza en bandas y columnas para reconocer patrones.'},
  {id:'intelligence',anchor:'inteligencia-espacial',height:1,label:'INTELIGENCIA',marker:'05',title:'IA con criterio.',copy:'La inteligencia artificial entra donde puede asistir, analizar o acelerar una tarea concreta, siempre dentro de un proceso controlado.',meaning:'Varias rutas representan alternativas; una queda destacada tras la evaluación.'},
  {id:'decision',anchor:'decision-espacial',height:.8,label:'DECISIÓN',marker:'06',title:'Decidir con claridad.',copy:'Información organizada para comprender la operación y elegir el siguiente paso.',meaning:'Las relaciones importantes convergen en una trayectoria compartida; las secundarias pierden protagonismo.'},
].map(Object.freeze));
export const phase03Scenes = Object.freeze([...narrativeScenes,
  {id:'automation',position:[8,2.8,-8],target:[1,1,-26],fov:49,depth:80,intensity:.32,visibility:.38,connections:.8,dispersion:0,order:1,clusters:1,flow:1,data:0,intelligence:0,clarity:0,convergence:0},
  {id:'data',position:[11,13,1],target:[1,1,-26],fov:47,depth:80,intensity:.23,visibility:.32,connections:.5,dispersion:0,order:1,clusters:1,flow:.25,data:1,intelligence:0,clarity:.2,convergence:0},
  {id:'intelligence',position:[10,10,-3],target:[3,2,-28],fov:47,depth:80,intensity:.2,visibility:.28,connections:.4,dispersion:0,order:1,clusters:1,flow:.15,data:.75,intelligence:1,clarity:.4,convergence:0},
  {id:'decision',position:[12,11,0],target:[3,1,-28],fov:45,depth:80,intensity:.12,visibility:.2,connections:.15,dispersion:0,order:1,clusters:1,flow:0,data:.4,intelligence:.3,clarity:1,convergence:1},
].map(Object.freeze));
const continuationBeats = [
  [3,3.6,'systems','automation'],[3.6,4.1,'automation','automation'],
  [4.1,4.7,'automation','data'],[4.7,5.2,'data','data'],
  [5.2,5.8,'data','intelligence'],[5.8,6.2,'intelligence','intelligence'],
  [6.2,6.7,'intelligence','decision'],[6.7,7.2,'decision','decision'],
];
export const phase03Config = Object.freeze({
  scenes:phase03Scenes,moments:phase03Moments,end:7.2,
  height:4+phase03Moments.reduce((sum,m)=>sum+m.height,0),
  ranges:Object.freeze([
    ...narrativeRanges.map(r=>({start:r.start*3/7.2,end:r.end*3/7.2,from:r.from,to:r.to})),
    ...continuationBeats.map(([start,end,from,to])=>({start:start/7.2,end:end/7.2,from,to})),
  ].map(Object.freeze)),
  chapters:Object.freeze([
    {id:'intro',label:'INTRO',start:0,end:1.14},
    {id:'complexity',label:'COMPLEJIDAD',start:1.14,end:2.46},
    {id:'systems',label:'SISTEMAS',start:2.46,end:3},
    {id:'automation',label:'AUTOMATIZACIÓN',start:3,end:4.1},
    {id:'data',label:'DATOS',start:4.1,end:5.2},
    {id:'intelligence',label:'INTELIGENCIA',start:5.2,end:6.2},
    {id:'decision',label:'DECISIÓN',start:6.2,end:7.2},
  ].map(Object.freeze)),
});
const clamp=v=>Math.max(0,Math.min(1,v));
/** Mutates a caller-owned state; narrative phase does not depend on RAF time. */
export function samplePhase03(controller, offset, out=controller.getState()) {
  offset=Number.isFinite(offset)?offset:0;
  controller.setProgress(offset/phase03Config.end);
  const index=Math.max(0,phase03Config.chapters.findIndex(c=>offset<c.end));
  const last=phase03Config.chapters.length-1;
  const chapter=phase03Config.chapters[offset>=phase03Config.end?last:index];
  out.chapter=chapter.id;out.chapterIndex=offset>=phase03Config.end?last:index;
  out.localProgress=clamp((offset-chapter.start)/(chapter.end-chapter.start));
  out.pulsePhase=clamp((offset-3)/1.7);
  out.selectionPhase=clamp((offset-5.2)/1);
  return out;
}

// Shared CPU/GLSL formula keeps HTML anchors attached to the morphed points.
const patternHeights=[2.6,1.8,3.2,2.2];
export function dataPosition(x,y,z,group,index,out) {
  const lane=Math.floor(index/32),step=index%32;
  if(index===0)return out.set(x,y,z);
  const base=clusterDefinitions[group].ordered;
  out.set(base[0]+(lane-1.5)*.75,base[1]+step/31*patternHeights[group]*(.7+lane*.15),base[2]+(lane-1.5)*.22+step*.03);
  return out;
}
