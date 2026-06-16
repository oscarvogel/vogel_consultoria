import { createApp } from "vue";
import ResourcesApp from "./components/ResourcesApp.vue";
import { initAnalytics } from "./lib/analytics.js";
import "./style.css";

initAnalytics();

createApp(ResourcesApp).mount("#resources-app");
