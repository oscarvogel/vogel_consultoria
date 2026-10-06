import { createDataWorld } from './dataWorld.js';

/** Shared renderer owner. Clients supply updates, never their own render loop. */
export function createSpatialEngine(T, { mobile = false, narrative = false, onContextLost, onContextRestored, onError } = {}) {
  const renderer = new T.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setClearColor(0x05090f, 0);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(47, 1, .1, 110);
  let world;
  try { world = createDataWorld(T, scene, mobile, narrative); }
  catch (error) { renderer.dispose(); renderer.forceContextLoss(); throw error; }
  let frame = 0, last = 0, elapsed = 0, callback, disposed = false, lost = false, wanted = false;
  let width = 0, height = 0, frames = 0;
  function pause() { wanted = false; cancelAnimationFrame(frame); frame = 0; last = 0; }
  function tick(now) {
    frame = 0;
    if (disposed || lost || !wanted || document.hidden || !width || !height) return;
    const dt = last ? Math.min(.05, (now - last) / 1000) : 0;
    last = now; elapsed += dt;
    try {
      callback?.(now, dt, elapsed);
      if (disposed || lost || !wanted) return;
      renderer.render(scene, camera); frames++;
    } catch (error) {
      pause();
      (onError || onContextLost)?.(error);
      return;
    }
    if (!frame) frame = requestAnimationFrame(tick);
  }
  function start(update = callback) {
    if (disposed) return;
    callback = update; wanted = true;
    if (!frame && !lost && !document.hidden && width && height) frame = requestAnimationFrame(tick);
  }
  function visibility() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    if (!document.hidden && wanted) start();
  }
  function loss(event) {
    event.preventDefault(); lost = true;
    cancelAnimationFrame(frame); frame = 0; last = 0;
    onContextLost?.();
  }
  function restore() { lost = false; onContextRestored?.(); if (wanted) start(); }
  renderer.domElement.addEventListener('webglcontextlost', loss);
  renderer.domElement.addEventListener('webglcontextrestored', restore);
  document.addEventListener('visibilitychange', visibility);
  return {
    renderer, scene, camera, world, uniforms: world.uniforms, mobile, anchorPoint: new T.Vector3(),
    get running() { return !!frame; }, start, pause,
    resize(w, h) {
      width = Math.max(0, w); height = Math.max(0, h);
      if (!width || !height) { cancelAnimationFrame(frame); frame = 0; last = 0; return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(1800000 / (width * height))));
      renderer.setSize(width, height, false);
      camera.aspect = width / height; camera.updateProjectionMatrix();
      if (wanted) start();
    },
    getState() { return { running: !!frame, lost, frames, elapsed, calls: renderer.info.render.calls,
      geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures }; },
    dispose() {
      if (disposed) return;
      disposed = true; pause();
      document.removeEventListener('visibilitychange', visibility);
      renderer.domElement.removeEventListener('webglcontextlost', loss);
      renderer.domElement.removeEventListener('webglcontextrestored', restore);
      world.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}
