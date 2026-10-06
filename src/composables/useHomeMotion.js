import { onMounted, onUnmounted } from 'vue';
import { loadSiteMotion } from './useSiteMotion.js';
import { resetScene } from '../lib/sceneController.js';

/** Home owns its motion; the shared narrative used on interior pages is untouched. */
export function useHomeMotion() {
  let media;
  let disposed = false;
  let refreshFrame;
  let host;
  let refresh;
  onMounted(async () => {
    try {
      const { gsap, ScrollTrigger } = await loadSiteMotion();
      await document.fonts?.ready;
      if (disposed) return;
      host = document.querySelector('.home-page main');
      if (!host) return;
      resetScene(); // Ambient shader stays neutral; the content carries the narrative.
      media = gsap.matchMedia();
      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const context = gsap.context(() => {
          const hero = host.querySelector('[data-home-moment="hero"]');
          gsap.fromTo(hero.querySelectorAll('.home-scene-connection'),
            { strokeDasharray: 1, strokeDashoffset: .85 },
            { strokeDashoffset: 0, ease: 'none', scrollTrigger: { id: 'home-intro', trigger: hero, start: 'top 85%', end: 'bottom 45%', scrub: .45 } });
          const frictions = host.querySelector('[data-home-moment="problems"]');
          gsap.from(frictions, { y: 20, duration: .65, ease: 'power3.out', scrollTrigger: { trigger: frictions, start: 'top 85%', once: true } });
          const order = host.querySelector('[data-home-moment="order"]');
          gsap.from(order.querySelectorAll('.home-order-module'), { y: 18, duration: .6, stagger: .045, ease: 'power3.out', scrollTrigger: { trigger: order, start: 'top 80%', once: true } });
          const connect = host.querySelector('[data-home-moment="connect"]');
          gsap.fromTo(connect.querySelector('.home-scene-connection'), { strokeDasharray: 1, strokeDashoffset: .8 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: connect, start: 'top 85%', end: 'bottom 55%', scrub: .45 } });
          for (const name of ['automate', 'methodology']) {
            const moment = host.querySelector(`[data-home-moment="${name}"]`);
            gsap.fromTo(moment.querySelector('.home-flow-line span, .home-method-line span'), { scaleX: .05 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: moment, start: 'top 85%', end: 'bottom 55%', scrub: .4 } });
          }
          const decision = host.querySelector('[data-home-moment="decide"]');
          gsap.from(decision, { y: 22, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: decision, start: 'top 85%', once: true } });
        }, host);
        return () => context.revert();
      });
      media.add('(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)', () => {
        const section = host.querySelector('#casos');
        const stage = section.querySelector('.forest-stage');
        const track = section.querySelector('.forest-track');
        const screens = [...section.querySelectorAll('.case-screen')];
        const steps = [...section.querySelectorAll('.case-step')];
        const clearance = () => (document.querySelector('.site-header')?.getBoundingClientRect().bottom || 24) + 92;
        section.classList.add('is-forest-motion');
        if (stage.scrollHeight > innerHeight - clearance() - 16) {
          section.classList.remove('is-forest-motion');
          return;
        }
        let previous = -1;
        const select = (progress) => {
          const active = progress < .34 ? 0 : progress < .67 ? 1 : 2;
          if (active === previous) return;
          previous = active;
          steps.forEach((step, index) => {
            step.classList.toggle('step-current', index === active);
            if (index === active) step.setAttribute('aria-current', 'step');
            else step.removeAttribute('aria-current');
          });
          screens.forEach((screen, index) => {
            screen.setAttribute('aria-hidden', String(index !== active));
            screen.toggleAttribute('inert', index !== active);
          });
          section.dataset.homeState = String(active);
        };
        const context = gsap.context(() => {
          gsap.set(screens, { autoAlpha: 0 });
          gsap.set(screens[0], { autoAlpha: 1 });
          const clock = { value: 0 };
          const timeline = gsap.timeline({ scrollTrigger: {
            id: 'home-forest', trigger: track, start: () => `top ${clearance()}px`,
            end: () => `+=${Math.max(1, track.offsetHeight - stage.offsetHeight)}`,
            pin: stage, pinSpacing: false, scrub: .45, invalidateOnRefresh: true,
          }, onUpdate: () => select(timeline.progress()) });
          timeline.to(clock, { value: 1, duration: 1, ease: 'none' }, 0)
            .to(screens[0], { autoAlpha: 0, duration: .08, ease: 'none' }, .30)
            .to(screens[1], { autoAlpha: 1, duration: .08, ease: 'none' }, .30)
            .to(screens[1], { autoAlpha: 0, duration: .08, ease: 'none' }, .63)
            .to(screens[2], { autoAlpha: 1, duration: .08, ease: 'none' }, .63);
          select(0);
        }, section);
        return () => {
          context.revert();
          section.classList.remove('is-forest-motion');
          delete section.dataset.homeState;
          screens.forEach(screen => { screen.removeAttribute('aria-hidden'); screen.removeAttribute('inert'); });
          steps.forEach((step, index) => { step.classList.toggle('step-current', index === 0); step.removeAttribute('aria-current'); });
        };
      });
      refresh = () => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); });
      };
      host.addEventListener('load', refresh, true);
      host.addEventListener('toggle', refresh, true);
      refresh();
      // Native fragments must be restored once the only pin is measured.
      let fragment;
      try { fragment = decodeURIComponent(location.hash.slice(1)); } catch { /* Invalid fragments are ignored. */ }
      if (fragment) {
        const target = document.getElementById(fragment);
        requestAnimationFrame(() => { if (!disposed) target?.scrollIntoView({ block: 'start', behavior: 'instant' }); });
      }
    } catch {
      media?.revert(); // Failed enhancement leaves the ordinary, readable document.
    }
  });
  onUnmounted(() => {
    disposed = true;
    cancelAnimationFrame(refreshFrame);
    host?.removeEventListener('load', refresh, true);
    host?.removeEventListener('toggle', refresh, true);
    media?.revert();
    resetScene();
  });
}
