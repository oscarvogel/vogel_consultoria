const positions = [[0,4.4,15],[-.8,4.7,14.5],[.6,4.3,14],[.9,4.6,14.3],[-.5,4.8,14.7],[.4,4.5,13.8],[0,4.4,15]];
const names = ['intro','complexity','systems','automation','data','intelligence','decision'];
export const spatialScenes = Object.freeze(names.map((id, index) => Object.freeze({
  id, position: Object.freeze(positions[index]), target: Object.freeze([0,.2,-14]), fov: 47,
  depth: 80 - index, intensity: 1 - index * .012, visibility: 1 - index * .015,
  connections: 1 + index * .02, transition: 'smoothstep',
})));
export const spatialOwnershipKey = Symbol('vogel-spatial-owner');
