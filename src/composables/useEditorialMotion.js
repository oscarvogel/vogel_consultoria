import { onMounted, onUnmounted } from 'vue';
import { loadSiteMotion } from './useSiteMotion.js';

/**
 * Motion rules for the editorial half of the Home: after Evidence the page returns to native scroll.
 * Entrances: Y ≤ 20px + opacity, once. Lines/diagram: stroke draw. Photo: brief clip reveal. No pin, no scrub,
 * no per-word text animation. Content is always in the DOM; with reduced motion nothing is hidden or moved.
 */
export function useEditorialMotion() {
  let media, disposed = false;
  onMounted(async () => {
    try {
      const { gsap, ScrollTrigger } = await loadSiteMotion();
      await document.fonts?.ready;
      if (disposed) return;
      media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const ctx = gsap.context(() => {
          const visibleNow = element => element.getBoundingClientRect().top < innerHeight * .9;
          const items = [...document.querySelectorAll('[data-ed-section] [data-ed-item]')].filter(element => !visibleNow(element) && !element.closest('[data-ed-method]'));
          if (items.length) {
            gsap.set(items, { opacity: 0, y: 20 });
            ScrollTrigger.batch(items, {
              start: 'top 90%', once: true,
              onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', stagger: .07, overwrite: true, clearProps: 'opacity,transform' }),
            });
          }

          for (const photo of document.querySelectorAll('[data-ed-photo]')) {
            if (visibleNow(photo)) continue;
            gsap.fromTo(photo, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out', clearProps: 'clipPath',
              scrollTrigger: { trigger: photo, start: 'top 82%', once: true } });
          }

          // Método Vogel: the route draws itself, then nodes and labels arrive. Short, once, no scrub.
          const diagram = document.querySelector('[data-ed-method]');
          if (diagram && !visibleNow(diagram)) {
            const all = [...diagram.querySelectorAll('.m-path')];
            const inputs = all.filter(path => path.classList.contains('m-path--in')), rails = all.filter(path => path.classList.contains('m-path--rail'));
            const main = diagram.querySelector('.m-path--main'), loop = diagram.querySelector('.m-path--loop');
            const arrow = diagram.querySelector('.m-arrow');
            const nodes = diagram.querySelectorAll('.m-node, .m-dot'), labels = diagram.querySelectorAll('.m-label');
            gsap.set(all, { strokeDasharray: 1, strokeDashoffset: 1 });
            gsap.set([arrow, ...nodes, ...labels], { opacity: 0 });
            gsap.timeline({ scrollTrigger: { trigger: diagram, start: 'top 78%', once: true }, defaults: { ease: 'power2.inOut' } })
              .to(inputs, { strokeDashoffset: 0, duration: .8, stagger: .08 })
              .to(rails, { strokeDashoffset: 0, duration: .5 }, .2)
              .to(main, { strokeDashoffset: 0, duration: .6 }, .9)
              .to(loop, { strokeDashoffset: 0, duration: .8 }, 1.1)
              .to(arrow, { opacity: 1, duration: .2 }, 1.8)
              .to(nodes, { opacity: 1, duration: .4, ease: 'power1.out', stagger: .05 }, .4)
              .to(labels, { opacity: 1, duration: .5, ease: 'power1.out', stagger: .06 }, .9);
          }
        });
        return () => ctx.revert();
      });
    } catch {
      // The editorial sections are complete, readable content without motion.
    }
  });
  onUnmounted(() => { disposed = true; media?.revert(); });
}
