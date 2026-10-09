const GA_SCRIPT_ID = "google-analytics";
const ANALYTICS_READY_FLAG = "__vogelAnalyticsReady";
const ANALYTICS_BOUND_FLAG = "__vogelAnalyticsBound";
const VIEWED_STEPS_FLAG = "__vogelAnalyticsViewedSteps";
const CONSENT_STORAGE_KEY = "vogel_analytics_consent";
const CONSENT_BANNER_ID = "vogel-consent-banner";
const PRIVACY_BUTTON_ID = "vogel-privacy-settings";
const CONSENT_GRANTED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "granted",
};
const CONSENT_DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};
let consentInMemory = "";

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
    const storedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (storedConsent === "granted" || storedConsent === "denied") {
      return storedConsent;
    }
  } catch {
    // Keep the current page's choice if browser storage is unavailable.
  }

  return consentInMemory;
}

function storeConsent(value) {
  consentInMemory = value;

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
  const measurementId = getMeasurementId();
  const hasGrantedConsent = value === "granted";
  const consentState = value === "granted" ? CONSENT_GRANTED : CONSENT_DENIED;

  storeConsent(hasGrantedConsent ? "granted" : "denied");

  if (measurementId) {
    window[`ga-disable-${measurementId}`] = !hasGrantedConsent;
  }

  if (hasGrantedConsent && measurementId) {
    ensureGtag(measurementId);
  } else if (typeof window.gtag === "function") {
    window.gtag("consent", "update", consentState);
  }

  closeConsentBanner({ restoreFocus: true });
}

function createConsentButton(label, value, primary = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.style.border = primary ? "1px solid var(--color-action)" : "1px solid var(--color-border)";
  button.style.borderRadius = "6px";
  button.style.background = primary ? "var(--color-action)" : "transparent";
  button.style.color = primary ? "var(--color-action-text)" : "var(--color-text)";
  button.style.font = "600 13px/1.2 'Chillax', Arial, sans-serif";
  button.style.minHeight = "44px";
  button.style.padding = "10px 14px";
  button.style.cursor = "pointer";
  button.addEventListener("click", () => updateConsent(value));
  return button;
}

function closeConsentBanner({ restoreFocus = false } = {}) {
  document.getElementById(CONSENT_BANNER_ID)?.remove();
  const settingsButton = document.getElementById(PRIVACY_BUTTON_ID);
  settingsButton?.setAttribute("aria-expanded", "false");

  if (restoreFocus) {
    settingsButton?.focus({ preventScroll: true });
  }
}

function renderConsentBanner({ focus = false } = {}) {
  const existingBanner = document.getElementById(CONSENT_BANNER_ID);

  if (existingBanner) {
    if (focus) existingBanner.querySelector("button")?.focus({ preventScroll: true });
    return;
  }

  if (!document.body) return;

  const banner = document.createElement("section");
  banner.id = CONSENT_BANNER_ID;
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-labelledby", "vogel-consent-title");
  banner.setAttribute("aria-describedby", "vogel-consent-description");
  banner.style.position = "fixed";
  banner.style.left = "16px";
  banner.style.right = "16px";
  banner.style.bottom = window.innerWidth < 720 ? "max(68px, calc(56px + env(safe-area-inset-bottom)))" : "16px";
  banner.style.zIndex = "80";
  banner.style.display = "grid";
  banner.style.gap = "12px";
  banner.style.maxWidth = "560px";
  banner.style.margin = "0 auto";
  banner.style.padding = "16px";
  banner.style.border = "1px solid var(--color-border)";
  banner.style.borderRadius = "10px";
  banner.style.background = "var(--color-panel)";
  banner.style.boxShadow = "0 18px 50px rgba(0,0,0,.35)";
  banner.style.color = "var(--color-text)";
  banner.style.font = "400 14px/1.5 'Chillax', Arial, sans-serif";

  const title = document.createElement("h2");
  title.id = "vogel-consent-title";
  title.textContent = "Privacidad y medición";
  title.tabIndex = -1;
  title.style.margin = "0";
  title.style.font = "600 16px/1.3 'Chillax', Arial, sans-serif";

  const text = document.createElement("p");
  text.id = "vogel-consent-description";
  text.textContent =
    "Google Analytics es opcional y mide visitas para ayudarnos a evaluar el sitio. No se carga hasta que aceptes; solo habilitamos analítica, sin personalización publicitaria. Podés cambiar tu elección desde Privacidad.";
  text.style.margin = "0";

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.flexWrap = "wrap";
  actions.style.gap = "10px";
  actions.append(
    createConsentButton("Aceptar analítica", "granted", true),
    createConsentButton("Rechazar opcional", "denied"),
  );

  banner.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeConsentBanner({ restoreFocus: true });
    }
  });

  banner.append(title, text, actions);
  document.body.appendChild(banner);
  document.getElementById(PRIVACY_BUTTON_ID)?.setAttribute("aria-expanded", "true");

  if (focus) {
    banner.querySelector("button")?.focus({ preventScroll: true });
  }
}

function renderPrivacySettingsButton() {
  if (!document.body || document.getElementById(PRIVACY_BUTTON_ID)) return;

  const button = document.createElement("button");
  button.id = PRIVACY_BUTTON_ID;
  button.type = "button";
  button.textContent = "Privacidad";
  button.setAttribute("aria-label", "Abrir preferencias de privacidad y analítica");
  button.setAttribute("aria-expanded", "false");
  button.style.position = "fixed";
  button.style.left = "max(12px, env(safe-area-inset-left))";
  button.style.bottom = "max(12px, env(safe-area-inset-bottom))";
  button.style.zIndex = "40";
  button.style.minHeight = "44px";
  button.style.padding = "0 12px";
  button.style.border = "1px solid var(--color-border)";
  button.style.borderRadius = "6px";
  button.style.background = "var(--color-panel, #0c1e36)";
  button.style.color = "var(--color-text, #F3F1E2)";
  button.style.font = "500 12px/1.2 'Chillax', Arial, sans-serif";
  button.style.cursor = "pointer";
  button.addEventListener("click", () => {
    if (document.getElementById(CONSENT_BANNER_ID)) {
      closeConsentBanner();
      return;
    }

    renderConsentBanner({ focus: true });
  });
  document.body.appendChild(button);
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
  window[`ga-disable-${measurementId}`] = false;
  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  const consentState = getConsentState();
  window.gtag("consent", "default", consentState);
  window.gtag("consent", "update", consentState);

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
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  window[ANALYTICS_READY_FLAG] = true;
}

export function trackEvent(eventName, params = {}) {
  const measurementId = getMeasurementId();

  if (
    !measurementId ||
    typeof window === "undefined" ||
    getStoredConsent() !== "granted" ||
    typeof window.gtag !== "function"
  ) {
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

  bindContactTracking();

  renderPrivacySettingsButton();

  if (getStoredConsent() === "granted") {
    ensureGtag(measurementId);
  } else {
    window[`ga-disable-${measurementId}`] = true;
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", CONSENT_DENIED);
    }
    renderConsentBanner();
  }
}
