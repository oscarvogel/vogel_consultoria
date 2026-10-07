// Critically damped spring step (Ryan Juckett): stable for any dt, no overshoot.
function spring(state, goal, dt, omega) {
  const f = 1 + 2 * dt * omega, oo = omega * omega, hoo = dt * oo, hhoo = dt * hoo, det = 1 / (f + hhoo);
  const x = (f * state.x + dt * state.v + hhoo * goal) * det;
  state.v = (state.v + hoo * (goal - state.x)) * det; state.x = x;
}

export function createCameraRig(T, camera) {
  const position = new T.Vector3(), quaternion = new T.Quaternion();
  const fromQ = new T.Quaternion(), toQ = new T.Quaternion(), matrix = new T.Matrix4();
  const eye = new T.Vector3(), target = new T.Vector3(), up = new T.Vector3(0,1,0);
  const accentQ = new T.Quaternion(), euler = new T.Euler(0, 0, 0, 'YXZ');
  let initial, paused = false, px = 0, py = 0, tx = 0, ty = 0, targetFov = camera.fov;
  // Path mode (Phase 03+): pose is pure scroll; accents and breathing are layered on render only.
  let path = false, calm = 0, velocity = 0, lens = 0;
  // Horizontal lens shift (NDC): composes the world beside the editorial column without moving it in 3D.
  function project(fov) {
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
    if (camera.projectionMatrix.elements[8] !== -lens) {
      camera.projectionMatrix.elements[8] = -lens;
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    }
  }
  const roll = { x: 0, v: 0 }, kick = { x: 0, v: 0 };
  function orientation(state, out) {
    eye.fromArray(state.position); target.fromArray(state.target);
    matrix.lookAt(eye, target, up); out.setFromRotationMatrix(matrix).normalize();
  }
  function setTransition(from, to, progress) {
    initial ||= from;
    const p = Number.isFinite(progress) ? Math.max(0,Math.min(1,progress)) : 0;
    position.fromArray(from.position); eye.fromArray(to.position); position.lerp(eye,p);
    orientation(from,fromQ); orientation(to,toQ); quaternion.slerpQuaternions(fromQ,toQ,p);
    targetFov = from.fov + (to.fov - from.fov) * p;
  }
  function setPose(from, to, fov) {
    path = true;
    position.copy(from); matrix.lookAt(from, to, up); quaternion.setFromRotationMatrix(matrix).normalize();
    targetFov = fov;
  }
  function update(dt, time = 0) {
    if (paused) return;
    const step = Math.max(0, dt);
    if (path && step > 0) {
      const still = 1 - calm;
      spring(roll, Math.max(-.0105, Math.min(.0105, -velocity * .006)) * still, step, 7);
      spring(kick, Math.min(1.5, Math.abs(velocity) * 1.1) * still, step, 6);
    }
    project(targetFov + (path ? kick.x : 0));
    const follow = 1 - Math.exp(-step / .4);
    px += (tx-px)*follow; py += (ty-py)*follow;
    camera.position.copy(position); camera.position.x += px*.24; camera.position.y += py*.12;
    camera.quaternion.copy(quaternion);
    if (path) {
      const breathe = 1 - calm;
      camera.position.x += Math.sin(time * .21) * .06 * breathe;
      camera.position.y += Math.sin(time * .17 + 1.3) * .04 * breathe;
      euler.set(0, Math.sin(time * .13 + .7) * .0026 * breathe, roll.x);
      camera.quaternion.multiply(accentQ.setFromEuler(euler));
    }
  }
  return { setTransition, setPose, update,
    get pose() { return { position, quaternion, fov: targetFov }; },
    get settled() { return Math.abs(roll.x) < 1e-5 && Math.abs(roll.v) < 1e-4 && Math.abs(kick.x) < 1e-3 && Math.abs(kick.v) < 1e-3; },
    /** Scroll velocity in offset units per second; drives roll/FOV accents. */
    setVelocity(v) { velocity = Number.isFinite(v) ? v : 0; },
    /** 1 disables accents and breathing (portal/evidence needs a still camera). */
    setCalm(value) { calm = Math.max(0, Math.min(1, value)); if (calm === 1) { roll.x = roll.v = kick.x = kick.v = 0; } },
    /** Apply the pure pose (no pointer, accents or breathing); used for deterministic snapshots. */
    applyPose() { camera.position.copy(position); camera.quaternion.copy(quaternion); camera.fov = targetFov; camera.updateProjectionMatrix(); project(targetFov); },
    setLens(value) { lens = Number.isFinite(value) ? Math.max(-.6, Math.min(.6, value)) : 0; },
    setPointer(x,y) { tx = Number.isFinite(x) ? Math.max(-1,Math.min(1,x)) : 0; ty = Number.isFinite(y) ? Math.max(-1,Math.min(1,y)) : 0; },
    pause() { paused = true; }, resume() { paused = false; },
    reset() { px=py=tx=ty=0; roll.x=roll.v=kick.x=kick.v=0; velocity=0; if(initial) setTransition(initial,initial,0); if(!paused) update(0); },
  };
}
