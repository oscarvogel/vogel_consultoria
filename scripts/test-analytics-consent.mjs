import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this.parentElement = null;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.style = {};
    this.dataset = {};
    this.id = "";
    this.textContent = "";
    this.value = "";
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name === "id") this.id = String(value);
  }

  getAttribute(name) {
    if (name === "id") return this.id;
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  append(...nodes) {
    nodes.forEach((node) => this.appendChild(node));
  }

  appendChild(node) {
    node.parentElement = this;
    this.children.push(node);
    this.ownerDocument.register(node);
    return node;
  }

  querySelector(selector) {
    if (selector !== "button") return null;
    return this.find((element) => element.tagName === "BUTTON") || null;
  }

  find(predicate) {
    for (const child of this.children) {
      if (predicate(child)) return child;
      const nested = child.find(predicate);
      if (nested) return nested;
    }
    return null;
  }

  focus() {
    this.ownerDocument.activeElement = this;
  }

  click() {
    for (const listener of this.listeners.get("click") || []) listener({ target: this });
  }

  remove() {
    if (!this.parentElement) return;
    this.parentElement.children = this.parentElement.children.filter((child) => child !== this);
    this.ownerDocument.unregister(this);
    this.parentElement = null;
  }
}

class FakeDocument {
  constructor() {
    this.elementsById = new Map();
    this.listeners = new Map();
    this.title = "Contacto — Vogel Consultoría";
    this.activeElement = null;
    this.head = new FakeElement("head", this);
    this.body = new FakeElement("body", this);
  }

  createElement(tagName) {
    return new FakeElement(tagName, this);
  }

  getElementById(id) {
    return this.elementsById.get(id) || null;
  }

  querySelectorAll() {
    return [];
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  register(element) {
    if (element.id) this.elementsById.set(element.id, element);
    for (const child of element.children) this.register(child);
  }

  unregister(element) {
    if (element.id) this.elementsById.delete(element.id);
    for (const child of element.children) this.unregister(child);
  }
}

function createAnalyticsContext(initialConsent = "") {
  const document = new FakeDocument();
  const storage = new Map(initialConsent ? [["vogel_analytics_consent", initialConsent]] : []);
  const window = {
    document,
    location: { pathname: "/contacto/", origin: "https://vogelconsultoria.com.ar" },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
  };

  class FakeButton extends FakeElement {}
  class FakeAnchor extends FakeElement {}
  class FakeForm extends FakeElement {}

  const source = fs.readFileSync(path.join(root, "src/lib/analytics.js"), "utf8")
    .replace('import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || ""', '"G-TEST123"')
    .replace(/export function /g, "function ");
  const context = vm.createContext({
    window,
    document,
    URL,
    Date,
    console,
    HTMLElement: FakeElement,
    HTMLButtonElement: FakeButton,
    HTMLAnchorElement: FakeAnchor,
    HTMLFormElement: FakeForm,
  });

  vm.runInContext(`${source}\nglobalThis.__analytics = { initAnalytics, trackEvent };`, context);
  return { document, window, analytics: context.__analytics };
}

function findButton(container, label) {
  return container.find((element) => element.tagName === "BUTTON" && element.textContent === label);
}

function layerCalls(window) {
  return (window.dataLayer || []).map((call) => Array.from(call));
}

function testConsentLifecycle() {
  const { document, window, analytics } = createAnalyticsContext();

  analytics.initAnalytics();
  assert.equal(document.head.children.length, 0, "Google's script must stay unloaded before a choice");
  assert.equal(window.gtag, undefined, "gtag must not be initialized before consent");
  assert.ok(document.getElementById("vogel-consent-banner"), "the first-visit choice must be present");
  assert.ok(document.getElementById("vogel-privacy-settings"), "privacy settings must remain available");

  analytics.trackEvent("preconsent_event", { page_location: "/contacto/" });
  assert.equal(window.dataLayer, undefined, "pre-consent events must not be queued");
  assert.equal(document.listeners.get("submit"), undefined, "analytics must not count form attempts globally");

  const banner = document.getElementById("vogel-consent-banner");
  findButton(banner, "Aceptar analítica").click();
  assert.equal(document.head.children.filter((element) => element.id === "google-analytics").length, 1, "accepting must load one Google script");
  assert.equal(window["ga-disable-G-TEST123"], false, "accepting must enable the tag");
  assert.equal(document.getElementById("vogel-consent-banner"), null, "the choice panel must close after acceptance");
  assert.equal(document.activeElement.id, "vogel-privacy-settings", "focus must return to the persistent settings control");

  const calls = layerCalls(window);
  const consentDefault = calls.find((call) => call[0] === "consent" && call[1] === "default");
  const config = calls.find((call) => call[0] === "config");
  assert.equal(consentDefault[2].ad_storage, "denied", "ad storage must remain denied after accepting analytics");
  assert.equal(consentDefault[2].analytics_storage, "granted", "analytics storage must reflect the explicit choice");
  assert.equal(config[2].allow_google_signals, false, "Google Signals must remain disabled");
  assert.equal(config[2].allow_ad_personalization_signals, false, "ad personalization must remain disabled");

  analytics.trackEvent("postconsent_event", { page_location: "/contacto/" });
  assert.ok(layerCalls(window).some((call) => call[0] === "event" && call[1] === "postconsent_event"), "events may flow after consent");

  document.getElementById("vogel-privacy-settings").click();
  findButton(document.getElementById("vogel-consent-banner"), "Rechazar opcional").click();
  assert.equal(window["ga-disable-G-TEST123"], true, "revoking consent must disable Google Analytics immediately");
  assert.equal(document.getElementById("vogel-consent-banner"), null, "the panel must close after revocation");
  const callsAfterRevoke = layerCalls(window).length;
  analytics.trackEvent("postrevoke_event", { page_location: "/contacto/" });
  assert.equal(layerCalls(window).length, callsAfterRevoke, "events must stop after consent is revoked");

  document.getElementById("vogel-privacy-settings").click();
  findButton(document.getElementById("vogel-consent-banner"), "Aceptar analítica").click();
  assert.equal(document.head.children.filter((element) => element.id === "google-analytics").length, 1, "changing preferences must reuse the existing script");
}

async function testSuccessfulContactEventOnly() {
  const events = [];
  const source = fs.readFileSync(path.join(root, "src/composables/useContactForm.js"), "utf8")
    .replace(/^import .*?;\r?\n/gm, "")
    .replace("export const WEB3FORMS_ENDPOINT", "const WEB3FORMS_ENDPOINT")
    .replace(/export function /g, "function ")
    .replace("import.meta.env.VITE_WEB3FORMS_KEY || ''", "'public-key-for-test'");
  const context = vm.createContext({
    shallowRef: (value) => ({ value }),
    ref: (value) => ({ value }),
    nextTick: () => Promise.resolve(),
    trackEvent: (...args) => events.push(args),
    FormData: class {
      constructor(form) { this.form = form; }
    },
    fetch: async () => ({ ok: false, json: async () => ({ success: false }) }),
    window: { location: { pathname: "/contacto/" } },
  });

  vm.runInContext(`${source}\nglobalThis.__useContactForm = useContactForm;`, context);
  const form = context.__useContactForm();
  const formElement = { reset() {} };
  await form.handleSubmit({ currentTarget: formElement });
  assert.equal(form.state.value, "error", "failed provider responses must not count as submitted contacts");
  assert.equal(events.length, 0, "failed provider responses must not emit a success event");

  context.fetch = async () => ({ ok: true, json: async () => ({ success: true }) });
  await form.handleSubmit({ currentTarget: formElement });
  assert.equal(form.state.value, "success", "successful provider responses must retain the success state");
  assert.equal(events.length, 1, "a successful contact must be counted exactly once");
  assert.equal(events[0][0], "contact_form_submit");
  assert.deepEqual(Object.keys(events[0][1]).sort(), ["form_name", "page_location", "placement"], "contact events must exclude submitted field values");
}

testConsentLifecycle();
await testSuccessfulContactEventOnly();
console.log("ok - analytics consent and contact privacy runtime");
