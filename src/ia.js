import { createApp } from "vue";
import IAApp from "./IAApp.vue";
import { initAnalytics } from "./lib/analytics.js";
import "./style.css";

initAnalytics();

createApp(IAApp).mount("#ia-app");
