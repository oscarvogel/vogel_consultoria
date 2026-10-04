import { createApp } from "vue";
import IAApp from "./IAApp.vue";
import { initAnalytics } from "./lib/analytics.js";
import "./style.css";
import { mountWavesBackground } from "./lib/mountWavesBackground.js";

mountWavesBackground();

initAnalytics();

createApp(IAApp).mount("#ia-app");
