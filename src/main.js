import {createApp} from 'vue';
import PrimeVue from 'primevue/config';
import AnimateOnScroll from 'primevue/animateonscroll';
import App from './App.vue';
import {initAnalytics} from './lib/analytics.js';
import './style.css';
initAnalytics();
// PrimeVue unstyled: no theme or global CSS, only the AnimateOnScroll directive (classes live in App.vue).
createApp(App).use(PrimeVue,{unstyled:true}).directive('animateonscroll',AnimateOnScroll).mount('#app');
