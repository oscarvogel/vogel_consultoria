// Presentation-only bridge. Vue writes targets; WebGL reads them without React renders.
export const SCENE_LIMITS = Object.freeze({ intensityDelta: .02, offsetXDelta: .015, offsetYDelta: .015 });
const neutral = Object.freeze({ intensityDelta: 0, offsetXDelta: 0, offsetYDelta: 0 });
let scene = neutral;
export function setScene(input = {}) {
  scene = Object.fromEntries(Object.entries(SCENE_LIMITS).map(([key, limit]) => {
    const value = Number(input[key] ?? 0);
    return [key, Number.isFinite(value) ? Math.max(-limit, Math.min(limit, value)) : 0];
  }));
  return scene;
}
export function getScene() { return scene; }
export function resetScene() { scene = neutral; }

/** Per-world progress state; legacy ambient-shader exports above remain independent. */
export function createSpatialSceneController(scenes, ranges) {
  const state = { progress: 0, from: scenes[0], to: scenes[0], blend: 0,
    intensity: 1, visibility: 1, connections: 1, depth: 80 };
  const scalarKeys = ['intensity', 'visibility', 'connections', 'depth', 'dispersion', 'order', 'clusters'];
  function setTransition(fromId, toId, progress) {
    const from = scenes.find(s => s.id === fromId), to = scenes.find(s => s.id === toId);
    if (!from || !to) throw new RangeError('Unknown spatial scene');
    const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
    state.from = from; state.to = to; state.blend = p*p*(3-2*p);
    for (const key of scalarKeys) state[key] = (from[key] ?? 0) + ((to[key] ?? 0)-(from[key] ?? 0))*state.blend;
    return state;
  }
  function setProgress(progress) {
    state.progress = Number.isFinite(progress) ? Math.max(0,Math.min(1,progress)) : 0;
    if (ranges) {
      const range = ranges.find(r => state.progress <= r.end) || ranges[ranges.length-1];
      return setTransition(range.from, range.to, (state.progress-range.start)/(range.end-range.start));
    }
    const step = state.progress * (scenes.length-1), index = Math.min(scenes.length-2, Math.floor(step));
    return setTransition(scenes[index].id, scenes[index+1].id, step-index);
  }
  setProgress(0);
  return { setProgress, setTransition, reset: () => setProgress(0), getState: () => state };
}
