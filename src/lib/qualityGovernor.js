// Pure adaptive-quality policy: frame times in, tier out. No DOM, testable in Node.
export const QUALITY_TIERS = Object.freeze([
  { dpr: 1.5, msaa: 4, bloomScale: .5, bokeh: 96 },
  { dpr: 1.25, msaa: 2, bloomScale: .5, bokeh: 72 },
  { dpr: 1, msaa: 0, bloomScale: .5, bokeh: 56 },
  { dpr: .85, msaa: 0, bloomScale: .375, bokeh: 40 },
].map(Object.freeze));

export function createQualityGovernor({ initial = 0, slowMs = 20, fastMs = 11, downAfter = 1.5, upAfter = 4, cooldown = 2 } = {}) {
  const ceiling = Math.max(0, Math.min(QUALITY_TIERS.length - 1, initial));
  let tier = ceiling, slow = 0, fast = 0, since = cooldown, locked = false, ema = 0;
  return {
    get tier() { return tier; }, get frameMs() { return ema; }, get locked() { return locked; },
    lock(value = tier) { locked = true; tier = Math.max(0, Math.min(QUALITY_TIERS.length - 1, value)); return tier; },
    unlock() { locked = false; },
    /** dt in seconds; returns true when the tier changed. */
    sample(dt) {
      if (!(dt > 0) || locked) return false;
      const ms = dt * 1000; ema = ema ? ema + (ms - ema) * .08 : ms; since += dt;
      slow = ema > slowMs ? slow + dt : 0; fast = ema < fastMs ? fast + dt : 0;
      if (since < cooldown) return false;
      if (slow >= downAfter && tier < QUALITY_TIERS.length - 1) { tier++; slow = fast = since = 0; return true; }
      if (fast >= upAfter && tier > ceiling) { tier--; slow = fast = since = 0; return true; }
      return false;
    },
  };
}
