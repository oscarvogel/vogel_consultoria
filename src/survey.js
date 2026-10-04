import { createApp } from "vue";
import SurveyApp from "./SurveyApp.vue";
import { initAnalytics } from "./lib/analytics.js";
import "./style.css";
import { mountWavesBackground } from "./lib/mountWavesBackground.js";

mountWavesBackground();

initAnalytics();

createApp(SurveyApp).mount("#survey-app");
