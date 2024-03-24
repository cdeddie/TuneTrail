<script setup>
import { ref, onMounted } from 'vue';
import CurrentlyPlaying from '../components/CurrentlyPlaying.vue';
import RequiresLogin from '../components/RequiresLogin.vue';

const isLoggedIn = ref(false);

onMounted(async () => {
  const response = await fetch('http://localhost:3000/auth/status', { credentials: 'include' });
  const data = await response.json();
  isLoggedIn.value = data.isLoggedIn;
});
</script>

<template>
  <div><span class="title">Currently Playing</span></div>
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
  margin-bottom: 25px;
  font-size: 52px; 
  font-weight: bold;
  background: linear-gradient(to right, var(--primary-color) , #2BC4E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>