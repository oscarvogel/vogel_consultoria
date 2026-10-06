export function createCameraRig(T, camera) {
  const position = new T.Vector3(), quaternion = new T.Quaternion();
  const fromQ = new T.Quaternion(), toQ = new T.Quaternion(), matrix = new T.Matrix4();
  const eye = new T.Vector3(), target = new T.Vector3(), up = new T.Vector3(0,1,0);
  let initial, paused = false, px = 0, py = 0, tx = 0, ty = 0, targetFov = camera.fov;
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
  function update(dt) {
    if (paused) return;
    if (camera.fov !== targetFov) { camera.fov = targetFov; camera.updateProjectionMatrix(); }
    const follow = 1 - Math.exp(-Math.max(0,dt) / .4);
    px += (tx-px)*follow; py += (ty-py)*follow;
    camera.position.copy(position); camera.position.x += px*.24; camera.position.y += py*.12;
    camera.quaternion.copy(quaternion);
  }
  return { setTransition, update,
    setPointer(x,y) { tx = Number.isFinite(x) ? Math.max(-1,Math.min(1,x)) : 0; ty = Number.isFinite(y) ? Math.max(-1,Math.min(1,y)) : 0; },
    pause() { paused = true; }, resume() { paused = false; },
    reset() { px=py=tx=ty=0; if(initial) setTransition(initial,initial,0); if(!paused) update(0); },
  };
}
