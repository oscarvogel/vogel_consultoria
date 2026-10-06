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
