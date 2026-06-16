import { onMounted, onUnmounted } from "vue";

/**
 * Attaches an IntersectionObserver that adds the `.revealed` class to
 * every element matching `selector` once it enters the viewport.
 * Elements must already have the `.reveal` CSS class applied.
 */
export function useScrollReveal(selector = ".reveal") {
  let observer = null;
  let mutationObserver = null;

  function observeElement(el) {
    if (!observer || el.classList.contains("revealed") || el.dataset.revealObserved === "true") {
      return;
    }

    el.dataset.revealObserved = "true";
    observer.observe(el);
  }

  function observeAll(root = document) {
    if (root instanceof Element && root.matches(selector)) {
      observeElement(root);
    }

    root.querySelectorAll?.(selector).forEach(observeElement);
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            delete entry.target.dataset.revealObserved;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observeAll();

    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            observeAll(node);
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
  });

  onUnmounted(() => {
    mutationObserver?.disconnect();
    observer?.disconnect();
  });
}
