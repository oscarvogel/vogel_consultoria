import { onMounted, onUnmounted } from "vue";

/**
 * Attaches an IntersectionObserver that adds the `.revealed` class to
 * every element matching `selector` once it enters the viewport.
 * Elements must already have the `.reveal` CSS class applied.
 */
export function useScrollReveal(selector = ".reveal") {
  let observer = null;

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(selector).forEach((el) => observer.observe(el));
  });

  onUnmounted(() => {
    observer?.disconnect();
  });
}
