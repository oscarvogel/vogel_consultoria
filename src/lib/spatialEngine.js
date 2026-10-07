import { createDataWorld } from './dataWorld.js';
import { createPostPipeline } from './postPipeline.js';
import { QUALITY_TIERS, createQualityGovernor } from './qualityGovernor.js';

/** Shared renderer owner. Clients supply updates, never their own render loop. */
export function createSpatialEngine(T, { mobile = false, narrative = false, phase03 = false, powerPreference = 'high-performance', onContextLost, onContextRestored, onError } = {}) {
  // Opaque canvas: the composite paints the same navy ground as the page.
  const renderer = new T.WebGLRenderer({ alpha: false, antialias: false, powerPreference, stencil: false });
  renderer.setClearColor(0x000000, 0);
  if (renderer.info) renderer.info.autoReset = false;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(47, 1, .1, 110);
  let world, post;
  try { world = createDataWorld(T, scene, mobile, narrative, phase03); post = createPostPipeline(T, renderer); }
  catch (error) { world?.dispose(); renderer.dispose(); renderer.forceContextLoss(); throw error; }
  // Automated browsers render through SwiftShader; a fixed tier keeps pixel checks deterministic.
  const automated = typeof navigator !== 'undefined' && navigator.webdriver;
  const governor = createQualityGovernor({ initial: 0 });
  if (automated) governor.lock(1);
  const gl = renderer.getContext?.();
  const pointRange = gl && 'getParameter' in gl ? gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)?.[1] || 64 : 64;
  let frame = 0, last = 0, elapsed = 0, callback, disposed = false, lost = false, wanted = false;
  let width = 0, height = 0, frames = 0, dpr = 1, postCalls = 0;
  function pause() { wanted = false; cancelAnimationFrame(frame); frame = 0; last = 0; }
  function applyQuality() {
    if (!width || !height) return;
    const tier = QUALITY_TIERS[governor.tier];
    dpr = Math.min(devicePixelRatio || 1, tier.dpr, Math.sqrt(3600000 / (width * height)));
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    post.configure({ msaa: tier.msaa, bloomScale: tier.bloomScale });
    post.setSize(width * dpr, height * dpr);
    world.setQuality?.({ pixelRatio: dpr, maxPoint: Math.min(pointRange, tier.bokeh * dpr), height: height * dpr });
  }
  function renderFrame() {
    renderer.info?.reset?.();
    post.uniforms.uTime.value = world.uniforms.uTime.value;
    post.render(scene, camera);
    postCalls = (renderer.info?.render.calls ?? 0) - post.sceneCalls;
  }
  function tick(now) {
    frame = 0;
    if (disposed || lost || !wanted || document.hidden || !width || !height) return;
    const dt = last ? Math.min(.05, (now - last) / 1000) : 0;
    last = now; elapsed += dt;
    try {
      callback?.(now, dt, elapsed);
      if (disposed || lost || !wanted) return;
      renderFrame(); frames++;
      if (governor.sample(dt)) applyQuality();
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
  function restore() { lost = false; applyQuality(); onContextRestored?.(); if (wanted) start(); }
  renderer.domElement.addEventListener('webglcontextlost', loss);
  renderer.domElement.addEventListener('webglcontextrestored', restore);
  document.addEventListener('visibilitychange', visibility);
  return {
    renderer, scene, camera, world, post, governor, uniforms: world.uniforms, mobile, anchorPoint: new T.Vector3(),
    get running() { return !!frame; }, start, pause, renderFrame,
    setTier(tier, { lock = true } = {}) { if (lock) governor.lock(tier); else governor.unlock(); applyQuality(); },
    resize(w, h) {
      width = Math.max(0, w); height = Math.max(0, h);
      if (!width || !height) { cancelAnimationFrame(frame); frame = 0; last = 0; return; }
      applyQuality();
      camera.aspect = width / height; camera.updateProjectionMatrix();
      if (wanted) start();
    },
    getState() {
      const calls = renderer.info?.render.calls ?? 0;
      return { running: !!frame, lost, frames, elapsed, calls, sceneCalls: post.sceneCalls, postCalls,
        geometries: renderer.info?.memory.geometries, textures: renderer.info?.memory.textures,
        tier: governor.tier, dpr, frameMs: governor.frameMs, hdr: post.float, samples: post.samples };
    },
    dispose() {
      if (disposed) return;
      disposed = true; pause();
      document.removeEventListener('visibilitychange', visibility);
      renderer.domElement.removeEventListener('webglcontextlost', loss);
      renderer.domElement.removeEventListener('webglcontextrestored', restore);
      world.dispose(); post.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}
