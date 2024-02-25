<template>
  <button @click="redirectToSpotifyLogin">Sign in with Spotify</button>
</template>

<script>
export default {
  methods: {
    redirectToSpotifyLogin() {
      window.location.href = 'http://localhost:3000/login'; // Adjust as needed
    }
  }
};
</script>
