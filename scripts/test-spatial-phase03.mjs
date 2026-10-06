import assert from 'node:assert/strict';
import * as T from 'three';
import {createSpatialSceneController} from '../src/lib/sceneController.js';
import {createCameraRig} from '../src/lib/cameraRig.js';
import {createDataWorld} from '../src/lib/dataWorld.js';
import {phase03Config,samplePhase03,clusterDefinitions,dataPosition,narrativeScenes,narrativeRanges} from '../src/lib/narrativeScenes.js';
const controller=createSpatialSceneController(phase03Config.scenes,phase03Config.ranges),camera=new T.PerspectiveCamera(),rig=createCameraRig(T,camera);
const scene=new T.Scene(),world=createDataWorld(T,scene,false,true,true);
const objects=[...scene.children],geometries=objects.map(o=>o.geometry);
const attributes=geometries.map(g=>Object.fromEntries(Object.entries(g.attributes).map(([key,a])=>[key,{attribute:a,array:a.array,bytes:a.array.byteLength}])));
function sample(offset){
 const state=samplePhase03(controller,offset);rig.setTransition(state.from,state.to,state.blend);rig.update(0);world.update(0,state);
 return {position:camera.position.toArray(),quaternion:camera.quaternion.toArray(),scalars:Object.fromEntries(Object.entries(world.uniforms).filter(([key,u])=>typeof u.value==='number').map(([key,u])=>[key,u.value])),chapter:state.chapter,local:state.localProgress};
}
assert.equal(phase03Config.height,8);assert.equal(scene.children.length,5);
assert.equal(scene.children[2].geometry.attributes.position.count,512);
const phase02=createSpatialSceneController(narrativeScenes,narrativeRanges);
for(let i=0;i<=300;i++){
 const offset=i/100,s=samplePhase03(controller,offset),old=phase02.setProgress(offset/3);
 assert.deepEqual(s.from.position,old.from.position);assert.deepEqual(s.to.position,old.to.position);assert(Math.abs(s.blend-old.blend)<1e-12);
}
for(let i=0;i<=720;i++){
 const offset=i/100,a=sample(offset);sample(7.2);assert.deepEqual(sample(offset),a);
 assert(Math.abs(camera.quaternion.length()-1)<1e-12);
 objects.forEach((o,j)=>{assert.equal(scene.children[j],o);assert.equal(o.geometry,geometries[j]);
  for(const [key,a] of Object.entries(o.geometry.attributes)){const before=attributes[j][key];assert.equal(a,before.attribute);assert.equal(a.array,before.array);assert.equal(a.array.byteLength,before.bytes);}
 });
}
for(const r of phase03Config.ranges.slice(0,-1)){
 const a=sample(r.end*7.2-1e-6),b=sample(r.end*7.2+1e-6);
 assert(new T.Vector3().fromArray(a.position).distanceTo(new T.Vector3().fromArray(b.position))<1e-5);
 for(const key of Object.keys(a.scalars))assert(Math.abs(a.scalars[key]-b.scalars[key])<1e-4,`${key} discontinuity`);
}
const pulseA=sample(3.9).scalars.uPulsePhase,pulseB=sample(4.05).scalars.uPulsePhase;assert(pulseB>pulseA);
assert.equal(sample(5.1).scalars.uData,1);assert.equal(sample(6.1).scalars.uIntelligence,1);
assert.equal(sample(7.05).scalars.uFlow,0);assert.equal(sample(7.05).scalars.uConvergence,1);
const target=new T.Vector3(),expected=new T.Vector3();
sample(5.1);clusterDefinitions.forEach((c,i)=>{world.anchor(i,target);dataPosition(...c.ordered,i,0,expected);expected.y+=.08*Math.exp(-Math.hypot(expected.x,expected.z+20)*.25);assert(target.distanceTo(expected)<1e-12);});
// Pattern bands have constant x per lane and ascending heights, unlike the organic source.
const g=scene.children[2].geometry,a=g.attributes.aData;
assert.equal(a.getX(10),a.getX(20));assert(a.getY(20)>a.getY(10));
world.dispose();assert.equal(scene.children.length,0);
console.log('ok - Phase 3 continuity, full shader-state reversal, legacy poses, patterns, anchors and every attribute/buffer stable');
