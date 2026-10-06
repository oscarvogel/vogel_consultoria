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
