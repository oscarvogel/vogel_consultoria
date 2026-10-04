import { createApp } from "vue";
import Navbar from "./components/Navbar.vue";
import AutomationStoryChapter from "./components/AutomationStoryChapter.vue";
import { initStoryReveal } from "./composables/useSiteMotion.js";
import "./style.css";
import { mountWavesBackground } from "./lib/mountWavesBackground.js";

mountWavesBackground();
import { initAnalytics } from "./lib/analytics.js";
const navApp = createApp(Navbar);
navApp.mount("#automatizaciones-nav");
const storyApp = createApp(AutomationStoryChapter);
storyApp.mount("#automation-story");
initAnalytics();
let disposeMotion;
let disposed = false;
initStoryReveal(document.querySelector("main")).then(stop => {
  if (disposed) stop(); else disposeMotion = stop;
}).catch(() => {});
if (import.meta.hot) import.meta.hot.dispose(() => {
  disposed = true;
  disposeMotion?.();
  storyApp.unmount();
  navApp.unmount();
});
