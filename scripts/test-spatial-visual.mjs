import assert from 'node:assert/strict';
import * as T from 'three';
import { createCameraPath, cameraKnots, createMonotone, PATH_DRIFT } from '../src/lib/cameraPath.js';
import { createCameraRig } from '../src/lib/cameraRig.js';
import { phase03Config } from '../src/lib/narrativeScenes.js';
import { evidenceConfig } from '../src/lib/evidenceScenes.js';

// Monotone mapping never overshoots and is non-decreasing.
{
  const f=createMonotone([0,1,1.5,4],[0,.1,2,2.05]);let previous=-Infinity;
  for(let x=-1;x<=5;x+=.001){const y=f(x);assert(y>=previous-1e-12&&y>=0&&y<=2.05+1e-12);previous=y;}
  assert.equal(f(NaN),0);
}
for(const evidence of [false,true]){
  const path=createCameraPath(T,{evidence}),{holds,poses}=cameraKnots({evidence});
  const end=evidence?evidenceConfig.height:phase03Config.end;
  const pose=()=>({position:new T.Vector3(),target:new T.Vector3(),fov:0});
  const a=pose(),b=pose();
  // Pure and reversible: the same offset always yields the same pose.
  for(let i=0;i<=1000;i++){const o=end*i/1000;path.sample(o,a);path.sample(end,b);path.sample(o,b);
    assert(a.position.equals(b.position)&&a.target.equals(b.target)&&a.fov===b.fov);}
  // Continuous position and bounded velocity jumps (C1 through every knot, no stops).
  let last,lastVelocity,maxJump=0;const step=1e-3;
  for(let o=0;o<=end;o+=step){path.sample(o,a);
    // The portal flight covers ~40 units in .7 offsets; anything above 120 units/offset is a jump.
    if(last){const v=a.position.distanceTo(last)/step;assert(v<120,`camera jump at ${o}: ${v}`);
      if(lastVelocity!==undefined)maxJump=Math.max(maxJump,Math.abs(v-lastVelocity));lastVelocity=v;}
    last=a.position.clone();}
  assert(maxJump<2,`velocity discontinuity ${maxJump}`);
  // Each hold rests near its chapter pose and drifts rather than freezing.
  holds.forEach((h,i)=>{
    path.sample((h.start+h.end)/2,a);assert(a.position.distanceTo(new T.Vector3().fromArray(poses[i].position))<1.2,`${h.id} composition drifted`);
    if(i>0&&i<holds.length-1){path.sample(h.start,a);path.sample(h.end,b);assert(a.position.distanceTo(b.position)>1e-3,`${h.id} hold is frozen`);}
  });
  path.sample(0,a);assert.deepEqual(a.position.toArray(),poses[0].position);
  path.sample(end,a);assert(a.position.distanceTo(new T.Vector3().fromArray(poses.at(-1).position))<1e-9);
}
assert(PATH_DRIFT>0&&PATH_DRIFT<.2);

// Chapter light table: the world never collapses into a void between Intro and Decision.
for(const scene of phase03Config.scenes){
  for(const key of ['focus','aperture','bloom','exposure','heat','cool','fog','dust','lens'])assert(Number.isFinite(scene[key]),`${scene.id}.${key}`);
  if(scene.id!=='intro'){assert(scene.intensity>=.45&&scene.visibility>=.45,`${scene.id} too dark`);assert(scene.lens>0,`${scene.id} must compose beside the copy`);}
  assert(scene.heat<=1&&scene.bloom<=.8,'amber stays a restrained accent');
}

// Velocity accents spring back to rest; calm removes them; pose stays pure.
{
  const camera=new T.PerspectiveCamera(45,1.6,.1,110),rig=createCameraRig(T,camera);
  rig.setPose(new T.Vector3(0,4,10),new T.Vector3(0,0,-20),45);
  rig.setVelocity(4);for(let i=0;i<30;i++)rig.update(1/60,i/60);
  assert(Math.abs(camera.fov-45)>.1,'scroll speed widens the lens');assert(!rig.settled);
  rig.setVelocity(0);for(let i=0;i<240;i++)rig.update(1/60,1+i/60);
  assert(rig.settled,'accents return to zero');assert(Math.abs(camera.fov-45)<1e-3);
  assert.deepEqual(rig.pose.position.toArray(),[0,4,10],'pose is untouched by accents and breathing');
  rig.setLens(.3);rig.update(1/60,5);assert.equal(camera.projectionMatrix.elements[8],-.3);
  camera.updateProjectionMatrix();rig.update(1/60,5);assert.equal(camera.projectionMatrix.elements[8],-.3,'lens survives resize');
  rig.setCalm(1);rig.setVelocity(9);rig.update(1/60,6);rig.applyPose();
  assert.deepEqual(camera.position.toArray(),[0,4,10]);assert(rig.settled);
}
console.log('ok - continuous camera path, monotone holds, chapter light table, accents, lens and pure pose');
