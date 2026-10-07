import { onMounted, onUnmounted } from "vue";
import "../styles/narrative.css";
import "lenis/dist/lenis.css";

let motionModules;
let textModule;

export async function loadTextMotion() {
  const motion = await loadSiteMotion();
  textModule ||= import("gsap/SplitText").then(module => {
    const SplitText = module.SplitText || module.default;
    motion.gsap.registerPlugin(SplitText);
    return SplitText;
  });
  return { ...motion, SplitText: await textModule };
}

function revealHeading(element, gsap, SplitText) {
  // Split only plain headings, never links, controls, or long paragraphs.
  element.classList.add("is-text-split");
  return SplitText.create(element, {
    type: "words,chars",
    aria: "auto",
    onSplit(self) {
      return gsap.from(self.chars, {
        yPercent: 18,
        opacity: .8,
        duration: .55,
        stagger: { amount: .26 },
        ease: "power3.out",
        onComplete: () => {
          self.revert();
          element.classList.remove("is-text-split");
        },
      });
    },
  });
}

export function loadSiteMotion() {
  motionModules ||= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
    const gsap = gsapModule.gsap || gsapModule.default;
    const ScrollTrigger = triggerModule.ScrollTrigger || triggerModule.default;
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });
  return motionModules;
}

/** Scroll-linked reveals enhance the visible document; they never gate content. */
export async function initStoryReveal(root = document, selector = ".reveal, .story-reveal, [data-story-reveal]") {
  if (!root) return () => {};
  const { gsap, ScrollTrigger, SplitText } = await loadTextMotion();
  await document.fonts?.ready;

  const media = gsap.matchMedia();
  const { default: Lenis } = await import('lenis');
  media.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const lenis = new Lenis({ lerp: .085, smoothWheel: true, syncTouch: false,
      anchors: false, prevent: node => Boolean(node.closest?.('.mobile-nav,.services-dropdown,textarea,select,[data-lenis-prevent]')) });
    const tick = time => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); lenis.off('scroll', ScrollTrigger.update); lenis.destroy(); };
  });
  media.add('(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)', () => {
    const hero = root.querySelector?.('.landscape-hero');
    if (!hero) return;
    const scene = gsap.context(() => {
      if (!hero.closest('.narrative-arc')) gsap.to(hero.querySelector('.hero-copy'), { y: -64, ease: 'none', scrollTrigger: {
        trigger: hero, start: 'top top', end: 'bottom top', scrub: .6, invalidateOnRefresh: true } });
      const intro = root.querySelector('.solutions-section .section-introduction');
      if (intro) gsap.fromTo(intro, { y: 48 }, { y: 0, ease: 'none', scrollTrigger: {
        trigger: intro, start: 'top bottom', end: 'top 50%', scrub: .6, invalidateOnRefresh: true } });
      const methodLine = root.querySelector('.home-method-line>span');
      root.querySelectorAll('.trace-wave').forEach(wave => gsap.fromTo(wave, { y: 12 }, { y: -8, ease: 'none', scrollTrigger: {
        trigger: wave.closest('.home-section'), start: 'top bottom', end: 'bottom top', scrub: .8, invalidateOnRefresh: true } }));
      if (methodLine) gsap.fromTo(methodLine, { scaleX: .08 }, { scaleX: 1, ease: 'none', scrollTrigger: {
        trigger: methodLine.closest('.home-method'), start: 'top 85%', end: 'bottom 60%', scrub: .6, invalidateOnRefresh: true } });
    }, root);
    return () => scene.revert();
  });
  media.add("(prefers-reduced-motion: no-preference)", () => {
    const context = gsap.context(() => {}, root);
    const observed = new WeakSet();
    const headings = new WeakSet();
    const splits = new Set();
    let mutations;

    const reveal = (element) => {
      if (!(element instanceof Element) || observed.has(element) || element.closest('[data-chapter-motion]')) return;
      observed.add(element);
      context.add(() => gsap.fromTo(element,
        { y: 16 },
        {
          y: 0,
          duration: 0.62,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
            invalidateOnRefresh: true,
          },
        },
      ));
    };

    const revealText = (element) => {
      if (headings.has(element) || element.closest('[data-chapter-motion]')) return;
      headings.add(element);
      context.add(() => ScrollTrigger.create({
        trigger: element,
        start: "top 86%",
        once: true,
        onEnter: () => context.add(() => splits.add(revealHeading(element, gsap, SplitText))),
      }));
    };

    const scan = (node) => {
      if (!(node instanceof Element)) return;
      if (node.matches(selector)) reveal(node);
      node.querySelectorAll(selector).forEach(reveal);
      if (node.matches("[data-text-reveal]")) revealText(node);
      node.querySelectorAll("[data-text-reveal]").forEach(revealText);
    };

    if (root instanceof Element) scan(root);
    else {
      root.querySelectorAll?.(selector).forEach(reveal);
      root.querySelectorAll?.("[data-text-reveal]").forEach(revealText);
    }
    if ("MutationObserver" in window) {
      mutations = new MutationObserver((records) => records.forEach((record) => {
        record.addedNodes.forEach(scan);
      }));
      mutations.observe(root instanceof Document ? root.body : root, { childList: true, subtree: true });
    }
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      mutations?.disconnect();
      context.revert();
      splits.forEach(split => split.revert());
      root.querySelectorAll?.(".is-text-split").forEach(element => element.classList.remove("is-text-split"));
    };
  });

  return () => { media.revert(); };
}

export function useCaseMotion(root, onStepChange = () => {}) {
  let media;
  let disposed = false;

  onMounted(async () => {
    try {
      const { gsap, ScrollTrigger } = await loadSiteMotion();
      if (disposed || !root.value) return;
      media = gsap.matchMedia();
      media.add("(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)", () => {
        const host = root.value;
        host.classList.add("case-motion");
        const screens = host.querySelectorAll(".case-screen");
        const steps = host.querySelectorAll(".case-step");
        const visual = host.querySelector(".case-visual");
        const clearance = (document.querySelector('.site-header')?.getBoundingClientRect().bottom || 24) + 92;
        if (visual.scrollHeight > innerHeight - clearance) { host.classList.remove('case-motion'); return; }
        const distance = () => Math.max(1, host.querySelector(".case-steps").offsetHeight - visual.offsetHeight);
        let points = [];
        let active = -1;
        const measure = () => {
          points = [0, ...Array.from(steps).slice(1).map(step =>
            Math.max(0, Math.min(.92, (step.offsetTop - steps[0].offsetTop - window.innerHeight * .18) / distance())),
          )];
        };
        const show = (index, immediate = false) => {
          if (index === active) return;
          active = index;
          onStepChange(index);
          steps.forEach((step, current) => step.classList.toggle("step-current", current === index));
          screens.forEach((screen, current) => {
            screen.setAttribute("aria-hidden", String(current !== index));
            gsap.killTweensOf(screen);
            gsap.to(screen, {
              autoAlpha: current === index ? 1 : 0,
              y: current === index ? 0 : -12,
              scale: current === index ? 1 : .985,
              duration: immediate ? 0 : .55,
              ease: "power2.out",
              overwrite: true,
            });
          });
        };
        measure();
        gsap.set(screens, { autoAlpha: 0, y: 16 });
        show(0, true);
        const trigger = ScrollTrigger.create({
            trigger: host.querySelector(".case-sequence"),
            start: () => `top ${(document.querySelector('.site-header')?.getBoundingClientRect().bottom || 24) + 92}px`,
            end: () => `+=${distance()}`,
            pin: visual,
            pinSpacing: false,
            invalidateOnRefresh: true,
            onRefresh: measure,
            onUpdate: (self) => {
              show(points.reduce((index, point, current) => self.progress >= point ? current : index, 0));
            },
        });
        const refresh = () => {
          if (!disposed) ScrollTrigger.refresh();
        };
        const images = [...host.querySelectorAll("img")].filter((image) => !image.complete);
        images.forEach((image) => image.addEventListener("load", refresh, { once: true }));
        document.fonts?.ready.then(refresh);
        return () => {
          trigger.kill();
          gsap.killTweensOf(screens);
          gsap.set(screens, { clearProps: "opacity,visibility,transform" });
          screens.forEach(screen => screen.removeAttribute("aria-hidden"));
          host.classList.remove("case-motion");
          steps.forEach((step) => step.classList.remove("step-current"));
          images.forEach((image) => image.removeEventListener("load", refresh));
        };
      });
    } catch {
      // Keep the three steps and their images in normal document flow.
    }
  });

  onUnmounted(() => {
    disposed = true;
    media?.revert();
  });
}

export function useProcessMotion(root) {
  let media;
  let disposed = false;

  onMounted(async () => {
    try {
      const { gsap, ScrollTrigger } = await loadSiteMotion();
      if (disposed || !root.value) return;
      media = gsap.matchMedia();
      media.add("(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)", () => {
        const host = root.value;
        const steps = host.querySelectorAll(".process-step");
        const list = host.querySelector("ol");
        const progress = ScrollTrigger.create({
          trigger: list,
          start: "top 65%",
          end: "bottom 40%",
          onUpdate: (self) => host.style.setProperty("--process-progress", String(Math.max(0.25, self.progress))),
        });
        const triggers = [...steps].map((step) => ScrollTrigger.create({
          trigger: step,
          start: "top 65%",
          end: "bottom 40%",
          onToggle: (state) => step.classList.toggle("step-current", state.isActive),
        }));
        return () => {
          progress.kill();
          triggers.forEach((trigger) => trigger.kill());
          host.style.removeProperty("--process-progress");
          steps.forEach((step) => step.classList.remove("step-current"));
        };
      });
    } catch {
      // The sticky intro and steps remain available as ordinary content.
    }
  });

  onUnmounted(() => {
    disposed = true;
    media?.revert();
  });
}
