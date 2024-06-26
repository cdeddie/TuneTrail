import './assets/main.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createWebHistory, createRouter } from 'vue-router';
import App from './App.vue';

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-dark-green/theme.css';

import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice';
import Divider from 'primevue/divider';
import Menu from 'primevue/menu';
import Slider from 'primevue/slider';
import SelectButton from 'primevue/selectbutton';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ProgressSpinner from 'primevue/progressspinner';
import Tooltip from 'primevue/tooltip';

import HomeView from './views/HomeView.vue';
import AboutView from './views/AboutView.vue';
import CurrentlyPlayingView from './views/CurrentlyPlayingView.vue';
import RecommendationView from './views/RecommendationView.vue';
import MostPlayedView from './views/MostPlayedView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
  { path: '/currently-playing', component: CurrentlyPlayingView },
  { path: '/recommendation', component: RecommendationView },
  { path: '/most-played', component: MostPlayedView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(PrimeVue);
app.use(ToastService);
app.use(router);

app.component('Button', Button);
app.component('Skeleton', Skeleton);
app.component('Image', Image);
app.component('Dialog', Dialog);
app.component('Toast', Toast);
app.component('Divider', Divider);
app.component('Menu', Menu);
app.component('Slider', Slider);
app.component('SelectButton', SelectButton);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('ProgressSpinner', ProgressSpinner);

app.directive('tooltip', Tooltip);

app.mount('#app');
