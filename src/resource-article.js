import { createApp } from "vue";
import ResourceArticleApp from "./components/ResourceArticleApp.vue";
import { getResource } from "./data/resources.js";
import { getServicePage } from "./data/servicePages.js";
import { initAnalytics } from "./lib/analytics.js";
import "./style.css";

const root = document.getElementById("resource-article-app");
const resourceId = root?.dataset.resourceId;
const resource = getResource(resourceId);
const service = resource ? getServicePage(resource.primaryService) : null;

initAnalytics();

if (root && resource && service) {
  createApp(ResourceArticleApp, { resource, service }).mount(root);
}
