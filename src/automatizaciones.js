import { createApp } from "vue";
import Navbar from "./components/Navbar.vue";
import { initStoryReveal } from "./composables/useSiteMotion.js";
import "./style.css";
import { mountWavesBackground } from "./lib/mountWavesBackground.js";

mountWavesBackground();
import { initAnalytics } from "./lib/analytics.js";
createApp(Navbar).mount("#automatizaciones-nav");
initAnalytics();
initStoryReveal(document.querySelector("main"));
