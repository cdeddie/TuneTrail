<script setup>
import { ref, onMounted } from 'vue';
import CurrentlyPlaying from '../components/CurrentlyPlaying.vue';
import RequiresLogin from '../components/RequiresLogin.vue';

const isLoggedIn = ref(false);

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/status`, { credentials: 'include' });
  const data = await response.json();
  isLoggedIn.value = data.isLoggedIn;
});
</script>

<template>
  <div><span class="title gradient-text">Currently Playing</span></div>
  <div v-if="!isLoggedIn">
    <RequiresLogin :loginMessage="'view what you are currently playing'" />
  </div>
  <div v-else>
    <CurrentlyPlaying />
  </div>

</template>

<style scoped>
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 5vh;
  font-size: 3em; 
  font-weight: bold;
}
</style>