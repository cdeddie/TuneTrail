<script setup>
import { inject } from 'vue';

const checkLoginStatus = inject('checkLoginStatus');

const redirectToSpotifyLogin = () => {
  window.location.href = 'http://localhost:3000/login';
  checkLoginStatus();
};

</script>

<template>
  <Button @click="redirectToSpotifyLogin" rounded><b>Sign in with Spotify</b></Button>
</template>

<style scoped>
Button {
  margin: 10px;
}
</style>