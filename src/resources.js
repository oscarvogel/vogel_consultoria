import { createApp } from "vue";
import ResourcesApp from "./components/ResourcesApp.vue";
import { initAnalytics } from "./lib/analytics.js";
import "./style.css";
import { mountWavesBackground } from "./lib/mountWavesBackground.js";

mountWavesBackground();

initAnalytics();

createApp(ResourcesApp).mount("#resources-app");
