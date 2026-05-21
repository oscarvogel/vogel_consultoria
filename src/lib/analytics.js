const GA_SCRIPT_ID = "google-analytics";
const ANALYTICS_READY_FLAG = "__vogelAnalyticsReady";
const ANALYTICS_BOUND_FLAG = "__vogelAnalyticsBound";
const VIEWED_STEPS_FLAG = "__vogelAnalyticsViewedSteps";

function getMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "";
}

function sanitizeText(value) {
  return value?.replace(/\s+/g, " ").trim().slice(0, 120) || undefined;
}

function getPlacement(target) {
  const container = target.closest("section[id], header[id], footer[id], main[id], form[aria-label]");

  if (container?.id) {
    return container.id;
  }

  return sanitizeText(container?.getAttribute("aria-label")) || "page";
}

function getLinkLabel(link) {
  return sanitizeText(
    link.getAttribute("aria-label") || link.dataset.analyticsLabel || link.textContent || link.title,
  );
}

function getFormLabel(form) {
  return sanitizeText(form.getAttribute("aria-label") || form.id || form.name || "contact_form");
}

function getAnalyticsContext(element) {
  return {
    cta_name: sanitizeText(element.dataset.analyticsCta),
    funnel_name: sanitizeText(element.dataset.analyticsFunnel),
    funnel_step: sanitizeText(element.dataset.analyticsStep),
    view_name: sanitizeText(element.dataset.analyticsView),
  };
}

function getDestination(target) {
  if (target instanceof HTMLAnchorElement) {
    return sanitizeText(target.getAttribute("href"));
  }

  if (target instanceof HTMLFormElement) {
    return sanitizeText(target.getAttribute("action"));
  }

  return undefined;
}

function getBaseParams(target) {
  return {
    page_location: window.location.pathname,
    placement: getPlacement(target),
    destination: getDestination(target),
    ...getAnalyticsContext(target),
  };
}

function isWhatsappLink(href) {
  return href.includes("wa.me") || href.includes("whatsapp.com");
}

function isMailLink(href) {
  return href.startsWith("mailto:");
}

function isContactIntentLink(href) {
  return href === "#contacto";
}

function ensureGtag(measurementId) {
  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  if (window[ANALYTICS_READY_FLAG]) {
    return;
  }

  const existingScript = document.getElementById(GA_SCRIPT_ID);

  if (!existingScript) {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    page_path: window.location.pathname,
    page_title: document.title,
  });

  window[ANALYTICS_READY_FLAG] = true;
}

export function trackEvent(eventName, params = {}) {
  const measurementId = getMeasurementId();

  if (!measurementId || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );

  window.gtag("event", eventName, cleanParams);
}

function bindContactTracking() {
  if (window[ANALYTICS_BOUND_FLAG]) {
    return;
  }

  document.addEventListener("click", (event) => {
    const cta = event.target.closest("[data-analytics-cta]");

    if (cta instanceof HTMLElement) {
      const ctaParams = {
        ...getBaseParams(cta),
        link_text:
          cta instanceof HTMLAnchorElement || cta instanceof HTMLButtonElement ? getLinkLabel(cta) : undefined,
      };

      trackEvent("cta_click", ctaParams);
    }

    const link = event.target.closest("a[href]");

    if (!link) {
      return;
    }

    const href = link.getAttribute("href")?.trim();

    if (!href) {
      return;
    }

    const sharedParams = {
      ...getBaseParams(link),
      link_text: getLinkLabel(link),
    };

    if (isWhatsappLink(href)) {
      trackEvent("whatsapp_click", sharedParams);
      return;
    }

    if (isMailLink(href)) {
      trackEvent("email_click", sharedParams);
      return;
    }

    if (isContactIntentLink(href)) {
      trackEvent("contact_intent_click", sharedParams);
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const action = form.getAttribute("action")?.trim() || "";
    const isTrackedForm =
      action.includes("formsubmit.co") || action.includes("web3forms.com") || form.dataset.analyticsCta;

    if (!isTrackedForm) {
      return;
    }

    trackEvent("contact_form_submit", {
      ...getBaseParams(form),
      form_name: getFormLabel(form),
    });
  });

  const viewedSteps = (window[VIEWED_STEPS_FLAG] = window[VIEWED_STEPS_FLAG] || new Set());
  const observedViews = document.querySelectorAll("[data-analytics-view]");

  if (observedViews.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target;
          const viewKey = `${window.location.pathname}:${element.dataset.analyticsView}:${element.dataset.analyticsStep || ""}`;

          if (viewedSteps.has(viewKey)) {
            observer.unobserve(element);
            return;
          }

          trackEvent("funnel_step_view", {
            ...getBaseParams(element),
          });

          viewedSteps.add(viewKey);
          observer.unobserve(element);
        });
      },
      { threshold: 0.45 },
    );

    observedViews.forEach((element) => observer.observe(element));
  }

  window[ANALYTICS_BOUND_FLAG] = true;
}

export function initAnalytics() {
  const measurementId = getMeasurementId();

  if (typeof window === "undefined" || !measurementId) {
    return;
  }

  ensureGtag(measurementId);
  bindContactTracking();
}