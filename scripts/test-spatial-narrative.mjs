import assert from 'node:assert/strict';
import * as T from 'three';
import {createSpatialSceneController} from '../src/lib/sceneController.js';
import {createCameraRig} from '../src/lib/cameraRig.js';
import {createDataWorld} from '../src/lib/dataWorld.js';
import {narrativeScenes,narrativeRanges,clusterDefinitions} from '../src/lib/narrativeScenes.js';
const controller=createSpatialSceneController(narrativeScenes,narrativeRanges),camera=new T.PerspectiveCamera(),rig=createCameraRig(T,camera);
const world=createDataWorld(T,new T.Scene(),false,true),out=new T.Vector3();
function pose(p){const s=controller.setProgress(p);rig.setTransition(s.from,s.to,s.blend);rig.update(0);world.update(0,s);return {position:camera.position.toArray(),quaternion:camera.quaternion.toArray(),order:s.order};}
assert.deepEqual(pose(0).position,narrativeScenes[0].position);
assert.deepEqual(pose(.5).position,narrativeScenes[1].position);
assert.deepEqual(pose(.9).position,narrativeScenes[2].position);
for(let i=0;i<=100;i++){const p=i/100,a=pose(p);pose(1);assert.deepEqual(pose(p),a);assert(Math.abs(camera.quaternion.length()-1)<1e-12);}
for(const p of [.2,.38,.65,.82]){const a=new T.Vector3().fromArray(pose(p-1e-7).position),b=new T.Vector3().fromArray(pose(p+1e-7).position);assert(a.distanceTo(b)<1e-8,'camera discontinuity');}
for(const [p,key] of [[.5,'scattered'],[.9,'ordered']]){pose(p);clusterDefinitions.forEach((c,i)=>{world.anchor(i,out);const expected=new T.Vector3().fromArray(c[key]);expected.y+=.08*Math.exp(-Math.hypot(expected.x,expected.z+20)*.25);assert(out.distanceTo(expected)<1e-12);});}
pose(.735);assert(Math.abs(controller.getState().order-.5)<1e-12);assert.equal(controller.getState().dispersion,.5);

assert.equal(pose(-1).order,0);assert.equal(pose(2).order,1);
world.dispose();
console.log('ok - narrative poses, normalized ranges, boundary continuity, reversible slerp and CPU/GPU anchor formula');
