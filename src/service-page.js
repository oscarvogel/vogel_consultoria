import { createApp } from "vue";
import ServicePage from "./components/ServicePage.vue";
import { getServicePage } from "./data/servicePages.js";
import { initAnalytics } from "./lib/analytics.js";
import "./style.css";

const root = document.getElementById("service-app");
const serviceId = root?.dataset.serviceId;
const page = getServicePage(serviceId);

initAnalytics();

if (root && page) {
  createApp(ServicePage, { page }).mount(root);
}
