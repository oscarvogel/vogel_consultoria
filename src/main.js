import { createApp } from "vue";
import App from "./App.vue";
import { initAnalytics } from "./lib/analytics.js";
import "./style.css";

initAnalytics();

createApp(App).mount("#app");
