const GA_SCRIPT_ID = "google-analytics";
const ANALYTICS_READY_FLAG = "__vogelAnalyticsReady";
const ANALYTICS_BOUND_FLAG = "__vogelAnalyticsBound";
const VIEWED_STEPS_FLAG = "__vogelAnalyticsViewedSteps";
const CONSENT_STORAGE_KEY = "vogel_analytics_consent";
const CONSENT_BANNER_ID = "vogel-consent-banner";
const CONSENT_GRANTED = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
};
const CONSENT_DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

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
    analytics_label: sanitizeText(element.dataset.analyticsLabel),
    analytics_location: sanitizeText(element.dataset.analyticsLocation),
    funnel_name: sanitizeText(element.dataset.analyticsFunnel),
    funnel_step: sanitizeText(element.dataset.analyticsStep),
    view_name: sanitizeText(element.dataset.analyticsView),
  };
}

function getStoredConsent() {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return "";
  }
}

function storeConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Consent still applies for this pageview when storage is unavailable.
  }
}

function getConsentState() {
  return getStoredConsent() === "granted" ? CONSENT_GRANTED : CONSENT_DENIED;
}

function updateConsent(value) {
  const consentState = value === "granted" ? CONSENT_GRANTED : CONSENT_DENIED;

  storeConsent(value);
  window.gtag("consent", "update", consentState);

  const banner = document.getElementById(CONSENT_BANNER_ID);
  banner?.remove();
}

function createConsentButton(label, value, primary = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.style.border = primary ? "1px solid #f0b429" : "1px solid rgba(229,231,235,.35)";
  button.style.borderRadius = "999px";
  button.style.background = primary ? "#f0b429" : "transparent";
  button.style.color = primary ? "#0f2a44" : "#e5e7eb";
  button.style.font = "700 13px/1.2 'DM Sans', Arial, sans-serif";
  button.style.padding = "10px 14px";
  button.style.cursor = "pointer";
  button.addEventListener("click", () => updateConsent(value));
  return button;
}

function renderConsentBanner() {
  if (getStoredConsent() || document.getElementById(CONSENT_BANNER_ID) || !document.body) {
    return;
  }

  const banner = document.createElement("div");
  banner.id = CONSENT_BANNER_ID;
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Preferencias de medicion");
  banner.style.position = "fixed";
  banner.style.left = "16px";
  banner.style.right = "16px";
  banner.style.bottom = "16px";
  banner.style.zIndex = "9999";
  banner.style.display = "grid";
  banner.style.gap = "12px";
  banner.style.maxWidth = "620px";
  banner.style.margin = "0 auto";
  banner.style.padding = "16px";
  banner.style.border = "1px solid rgba(229,231,235,.22)";
  banner.style.borderRadius = "18px";
  banner.style.background = "rgba(15,42,68,.97)";
  banner.style.boxShadow = "0 18px 50px rgba(0,0,0,.35)";
  banner.style.color = "#e5e7eb";
  banner.style.font = "400 14px/1.5 'DM Sans', Arial, sans-serif";

  const text = document.createElement("p");
  text.textContent =
    "Usamos Google Analytics para medir visitas y mejorar el sitio. Podemos guardar cookies de medicion y publicidad solo si aceptas.";
  text.style.margin = "0";

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.flexWrap = "wrap";
  actions.style.gap = "10px";
  actions.append(
    createConsentButton("Aceptar medicion", "granted", true),
    createConsentButton("Solo necesario", "denied"),
  );

  banner.append(text, actions);
  document.body.appendChild(banner);
}

function getDestination(target) {
  if (target instanceof HTMLAnchorElement) {
    const href = target.getAttribute("href")?.trim() || "";

    if (isWhatsappLink(href)) {
      return "whatsapp";
    }

    if (isMailLink(href)) {
      return "email";
    }

    if (href.startsWith("#")) {
      return href;
    }

    try {
      const url = new URL(href, window.location.origin);

      if (url.origin === window.location.origin) {
        return sanitizeText(url.pathname);
      }

      return sanitizeText(url.origin);
    } catch {
      return undefined;
    }
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

  window.gtag("consent", "default", {
    ...getConsentState(),
    wait_for_update: 500,
  });

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
    const cta = event.target.closest("[data-analytics-cta], [data-analytics-event]");
    let trackedCustomLinkEvent = "";

    if (cta instanceof HTMLElement) {
      const eventName = sanitizeText(cta.dataset.analyticsEvent) || "cta_click";
      const ctaParams = {
        ...getBaseParams(cta),
        link_text:
          cta instanceof HTMLAnchorElement || cta instanceof HTMLButtonElement ? getLinkLabel(cta) : undefined,
      };

      trackEvent(eventName, ctaParams);
      trackedCustomLinkEvent = eventName;
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
      if (trackedCustomLinkEvent === "whatsapp_click") {
        return;
      }

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
  renderConsentBanner();
}
