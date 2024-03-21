import './assets/main.css'
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-dark-green/theme.css'

import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice';
import Divider from 'primevue/divider';
import Menu from 'primevue/menu';

import HomeView from './views/HomeView.vue'
import AboutView from './views/AboutView.vue'
import CurrentlyPlayingView from './views/CurrentlyPlayingView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
  { path: '/currently-playing', component: CurrentlyPlayingView }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const app = createApp(App);

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

app.mount('#app');
