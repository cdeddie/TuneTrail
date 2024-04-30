<script setup>
import Navbar from './components/Navbar.vue';
import { ref, onMounted } from 'vue';

const visible = ref(false);

onMounted(() => {
  visible.value = true;
});
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Warning" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div style="text-align: center">
      Please note that this website is currently in development. 
      To offer you the best experience, I'm in the process of obtaining approval from Spotify for open usage of their API. 
      Unfortunately, this means these services are not available for use at the moment. 
      <br><br>
      If you want to use it however, feel free to reach out to me and I can add your Spotify email to the dev dashboard
      which gives you access! Just navigate to the About page.
    </div>
  </Dialog>
  <div class="app-container">
    <Navbar />

  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

</style>