import { createApp, nextTick } from "vue";
import App from "./App.vue";
import { initAnalytics } from "./lib/analytics.js";
import "./style.css";
import { mountWavesBackground } from "./lib/mountWavesBackground.js";

mountWavesBackground();

initAnalytics();

createApp(App).mount("#app");

// Native fragment navigation runs after Vue has created the section targets.
nextTick(() => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
});
