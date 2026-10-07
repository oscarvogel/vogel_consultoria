// Scroll-owned editorial reveals for the narrative chapters: masked line rises for the
// heading, eased fades for marker, body and links. Progress is a pure function of scroll
// (reversible, no timers); positions are cached on measure, never read per frame.
const clamp = v => Math.max(0, Math.min(1, v));
const smooth = v => { v = clamp(v); return v * v * (3 - 2 * v); };

export function createNarrativeText({ gsap, SplitText }, arc) {
  const items = [...arc.querySelectorAll('.narrative-moment .narrative-copy')].map(copy => {
    const item = { copy, top: 0, progress: -1, timeline: null, split: null };
    const heading = copy.querySelector('h2');
    const marker = copy.querySelector('.narrative-marker');
    const body = [...copy.querySelectorAll(':scope > p:not(.narrative-marker):not(.narrative-equivalent)')];
    const extras = [...copy.querySelectorAll(':scope > nav a, :scope > .narrative-metadata li')];
    function build(lines) {
      item.timeline?.kill();
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      if (marker) tl.fromTo(marker, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: .55 }, 0);
      tl.fromTo(lines, { yPercent: 118, rotate: 1.5 }, { yPercent: 0, rotate: 0, duration: 1, stagger: .09, ease: 'expo.out' }, .06);
      if (body.length) tl.fromTo(body, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .8 }, .32);
      if (extras.length) tl.fromTo(extras, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, stagger: .07 }, .46);
      item.timeline = tl;
      if (item.progress >= 0) tl.progress(item.progress);
      return tl;
    }
    item.split = heading ? SplitText.create(heading, { type: 'lines', mask: 'lines', aria: 'auto', autoSplit: true,
      linesClass: 'narrative-line', onSplit: self => build(self.lines) }) : null;
    if (!item.split) build([]);
    return item;
  });
  return {
    measure() {
      for (const item of items) item.top = item.copy.getBoundingClientRect().top + scrollY;
    },
    update(scroll, viewport) {
      for (const item of items) {
        // Starts as the copy enters the lower third and completes before it reaches center.
        const p = smooth((viewport * .94 - (item.top - scroll)) / (viewport * .5));
        if (Math.abs(p - item.progress) < 1e-4) continue;
        item.progress = p; item.timeline?.progress(p);
      }
    },
    clean() {
      for (const item of items) { item.timeline?.progress(1).kill(); item.split?.revert(); }
      gsap.set(arc.querySelectorAll('.narrative-copy .narrative-marker, .narrative-copy > p, .narrative-copy nav a, .narrative-metadata li'), { clearProps: 'opacity,transform' });
    },
  };
}
