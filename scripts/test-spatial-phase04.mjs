import assert from 'node:assert/strict';
import * as T from 'three';
import {narrativeChapters,chapterMarker,phase03Config} from '../src/lib/narrativeScenes.js';
import {createSpatialSceneController} from '../src/lib/sceneController.js';
import {sampleEvidence,evidenceCorner,portalMatrix} from '../src/lib/evidenceScenes.js';
import {createDataWorld} from '../src/lib/dataWorld.js';
import {RENDER_BUDGET} from '../src/lib/renderBudget.js';
assert.deepEqual(narrativeChapters.map(c=>c.number),['01','02','03','04','05','06','07','08']);
for(const c of narrativeChapters)assert.equal(chapterMarker(c.id),`${c.number} / ${c.label}`);
const controller=createSpatialSceneController(phase03Config.scenes,phase03Config.ranges);
const values=s=>[s.chapterIndex,s.evidenceStep,s.stepBlend,s.portal,s.frame,s.dock,s.imageOpacity,s.canvasOpacity,s.evidenceExit];
for(let i=0;i<=1080;i++){const offset=i/100,a=values(sampleEvidence(controller,offset));sampleEvidence(controller,10.8);assert.deepEqual(values(sampleEvidence(controller,offset)),a);}
for(const boundary of [7.2,7.45,7.9,8.8,9.7,10.8]){const a=sampleEvidence(controller,boundary-1e-8).canvasOpacity,b=sampleEvidence(controller,boundary+1e-8).canvasOpacity;assert(Math.abs(a-b)<1e-6);}
const point=new T.Vector3();assert.deepEqual(evidenceCorner(0,1,point).toArray(),[2.5,6,-48]);
const corners=new Float64Array([10,20,130,30,120,200,0,180]),matrix=new Float64Array(16),scratch=new Float64Array(72);
assert(portalMatrix(corners,100,150,matrix,scratch));
for(let i=0;i<4;i++){const x=i===0||i===3?0:100,y=i<2?0:150,w=matrix[3]*x+matrix[7]*y+1;assert(Math.abs((matrix[0]*x+matrix[4]*y+matrix[12])/w-corners[i*2])<1e-7);assert(Math.abs((matrix[1]*x+matrix[5]*y+matrix[13])/w-corners[i*2+1])<1e-7);}
const scene=new T.Scene(),world=createDataWorld(T,scene,false,true,true),attributes=scene.children.map(o=>Object.values(o.geometry.attributes));
for(let i=0;i<=100;i++){world.uniforms.uEvidence.value=i/100;world.update(0,sampleEvidence(controller,7.2+i/100));scene.children.forEach((o,j)=>assert.deepEqual(Object.values(o.geometry.attributes),attributes[j]));}
assert.equal(scene.children.length,RENDER_BUDGET.phase03.objects.length);world.dispose();
console.log('ok - Phase 4 numbering, scroll reversal, portal homography, shared frame and persistent attributes');
