<script setup>
import { ref, onMounted, provide } from 'vue';
import SpotifyLogin from './components/SpotifyLogin.vue';
import CurrentlyPlaying from './components/CurrentlyPlaying.vue';
import CurrentUser from './components/CurrentUser.vue';

const isLoggedIn = ref(false);

const checkLoginStatus = async () => {
  try {
    const response = await fetch('http://localhost:3000/auth/status', { credentials: 'include' });
    const data = await response.json();
    isLoggedIn.value = data.isLoggedIn;
  } catch (error) {
    console.error('Failed to check login status:', error);
  }
};

onMounted(checkLoginStatus);

provide('checkLoginStatus', checkLoginStatus);
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>TuneTrail</h1>
      <SpotifyLogin v-if="!isLoggedIn" class="login"></SpotifyLogin>
      <CurrentUser v-else-if="isLoggedIn" :isLoggedIn="isLoggedIn" class="login"></CurrentUser>
    </div>

    <div class="content">
      <h2>Login status: {{ isLoggedIn }}</h2>
      <CurrentlyPlaying></CurrentlyPlaying>
    </div>
  </div>

</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}

.header {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}

.header h1 {
  text-align: center;
}

.login {
  position: absolute;
  right: 0;
}

.content {
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>