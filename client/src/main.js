import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-dark-green/theme.css'

import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';

const app = createApp(App);

app.use(PrimeVue);

app.component('Button', Button);
app.component('Skeleton', Skeleton);

app.mount('#app');
