import { onMounted, onUnmounted } from "vue";
import { initStoryReveal } from "./useSiteMotion.js";

/**
 * Adds editorial reveals as progressive enhancement. All content remains visible
 * when motion is reduced, GSAP is unavailable, or the component is unmounted.
 */
export function useScrollReveal(rootRef = null) {
  let dispose;
  let cancelled = false;

  onMounted(async () => {
    const root = rootRef?.value || document.querySelector("main") || document.body;
    try {
      const stop = await initStoryReveal(root);
      if (cancelled) stop?.();
      else dispose = stop;
    } catch {
      // Progressive enhancement only: leave the document in its readable state.
    }
  });

  onUnmounted(() => {
    cancelled = true;
    dispose?.();
  });
}
