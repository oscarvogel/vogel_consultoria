import assert from 'node:assert/strict';
import * as T from 'three';
import { createCameraRig } from '../src/lib/cameraRig.js';
import { spatialScenes } from '../src/lib/spatialScenes.js';
import { createSpatialSceneController } from '../src/lib/sceneController.js';
import { createSpatialEngine } from '../src/lib/spatialEngine.js';

const controller = createSpatialSceneController(spatialScenes);
const camera = new T.PerspectiveCamera(47,1,.1,110), rig = createCameraRig(T,camera);
const pose = p => { const s=controller.setProgress(p); rig.setTransition(s.from,s.to,s.blend); rig.update(.016); return camera.position.toArray(); };
assert.deepEqual(pose(-1),spatialScenes[0].position);
assert.deepEqual(pose(NaN),spatialScenes[0].position);
assert.deepEqual(pose(2),spatialScenes.at(-1).position);
for(let i=0;i<=60;i++) {
  const p=i/60, a=pose(p); pose(1); assert.deepEqual(pose(p),a);
  assert(Math.abs(camera.quaternion.length()-1)<1e-12);
}
for(let i=1;i<6;i++) {
  const a=new T.Vector3().fromArray(pose(i/6-1e-6)), b=new T.Vector3().fromArray(pose(i/6+1e-6));
  assert(a.distanceTo(b)<1e-6,'scene boundary discontinuity');
}
assert.throws(()=>controller.setTransition('missing','intro',.5),RangeError);
pose(.5); rig.pause(); const paused=camera.position.toArray(); pose(.9); assert.deepEqual(camera.position.toArray(),paused);
rig.resume(); rig.update(0); assert.notDeepEqual(camera.position.toArray(),paused);
rig.setPointer(1,-1); rig.update(.4); assert(Math.abs(camera.position.x-pose(.9)[0])<.24);
rig.reset(); assert.deepEqual(camera.position.toArray(),spatialScenes[0].position);
const other=createSpatialSceneController(spatialScenes); controller.setProgress(.8); assert.equal(other.getState().progress,0);

// Scheduler ownership and cleanup without depending on a GPU.
let next=0; const pending=new Map();
globalThis.requestAnimationFrame=callback=>{pending.set(++next,callback);return next;};
globalThis.cancelAnimationFrame=id=>pending.delete(id);
globalThis.document=new EventTarget(); document.hidden=false;
globalThis.devicePixelRatio=2;
let renderers=0, renders=0, disposals=0;
class Renderer {
  constructor(){renderers++;this.domElement=new EventTarget();this.domElement.remove=()=>{};this.info={render:{calls:2},memory:{geometries:2,textures:0}};}
  setClearColor(){} setPixelRatio(){} setSize(){} render(){renders++;} dispose(){disposals++;} forceContextLoss(){}
}
let failures=0;
const engine=createSpatialEngine({...T,WebGLRenderer:Renderer},{onError(){failures++;}});
engine.resize(1440,700); engine.start(); engine.start(); assert.equal(pending.size,1);
function frame(now){const [id,callback]=pending.entries().next().value;pending.delete(id);callback(now);}
frame(100);assert.equal(renders,1);assert.equal(pending.size,1);
document.hidden=true;document.dispatchEvent(new Event('visibilitychange'));assert.equal(pending.size,0);
document.hidden=false;document.dispatchEvent(new Event('visibilitychange'));assert.equal(pending.size,1);
engine.renderer.domElement.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));assert.equal(pending.size,0);
engine.renderer.domElement.dispatchEvent(new Event('webglcontextrestored'));assert.equal(pending.size,1);assert.equal(renderers,1);
engine.resize(0,0);assert.equal(pending.size,0);engine.resize(1440,700);assert.equal(pending.size,1);
engine.renderer.render=()=>{throw new Error('GPU failure');};frame(200);assert.equal(failures,1);assert.equal(pending.size,0);
engine.dispose();engine.dispose();assert.equal(pending.size,0);assert.equal(disposals,1);
document.dispatchEvent(new Event('visibilitychange'));assert.equal(pending.size,0);
console.log('ok - camera, boundaries, reversal, independent state, one scheduler, visibility/context recovery and disposal');
