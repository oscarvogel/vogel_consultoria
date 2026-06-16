import { createApp } from "vue";
import SurveyApp from "./SurveyApp.vue";
import { initAnalytics } from "./lib/analytics.js";
import "./style.css";

initAnalytics();

createApp(SurveyApp).mount("#survey-app");
