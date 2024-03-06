import './assets/main.css'

import { createApp } from 'vue'
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

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);

app.component('Button', Button);
app.component('Skeleton', Skeleton);
app.component('Image', Image);
app.component('Dialog', Dialog);
app.component('Toast', Toast);
app.component('Divider', Divider);

app.mount('#app');
