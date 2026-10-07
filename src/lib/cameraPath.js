import { phase03Config } from './narrativeScenes.js';
import { evidenceConfig } from './evidenceScenes.js';

export const PATH_DRIFT = .06;

/** Fritsch–Carlson monotone cubic: C1, never overshoots between knots. */
export function createMonotone(xs, ys) {
  const n = xs.length, d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return x => {
    if (!Number.isFinite(x) || x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}

/** Holds (scroll ranges where a chapter rests) become knots; the camera drifts through them. */
export function cameraKnots({ evidence = false } = {}) {
  const holds = phase03Config.ranges.filter(r => r.from === r.to)
    .map(r => ({ id: r.from, start: r.start * phase03Config.end, end: r.end * phase03Config.end }));
  if (evidence) holds.push({ id: 'evidence', start: evidenceConfig.portalEnd, end: evidenceConfig.height });
  const poses = holds.map(h => h.id === 'evidence' ? evidenceConfig.camera : phase03Config.scenes.find(s => s.id === h.id));
  const xs = [], ys = [], last = holds.length - 1;
  holds.forEach((h, i) => {
    xs.push(h.start, h.end);
    ys.push(i === 0 ? 0 : i - PATH_DRIFT, i === last ? i : i + PATH_DRIFT);
  });
  return { holds, poses, xs, ys };
}

/** Pure scroll → camera pose. Same offset always yields the same pose. */
export function createCameraPath(T, options = {}) {
  const { poses, xs, ys } = cameraKnots(options);
  const curve = key => new T.CatmullRomCurve3(poses.map(p => new T.Vector3().fromArray(p[key])), false, 'centripetal');
  const position = curve('position'), target = curve('target');
  const fov = createMonotone(poses.map((_, i) => i), poses.map(p => p.fov));
  const toU = createMonotone(xs, ys), segments = poses.length - 1;
  return {
    poses,
    u: toU,
    sample(offset, out) {
      const u = Math.max(0, Math.min(segments, toU(offset)));
      position.getPoint(u / segments, out.position);
      target.getPoint(u / segments, out.target);
      out.fov = fov(u); out.u = u;
      return out;
    },
  };
}
