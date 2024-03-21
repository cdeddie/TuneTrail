<script setup>

</script>

<template>
  <div class="home-container">
    <div><span class="title">TuneTrail</span></div>
    <div class="subtitle">Utilities for Spotify Users</div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 75vh;
}

.title {
  font-size: 86px; 
  font-weight: bold;
  background: linear-gradient(to right, var(--primary-color) , #2BC4E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 24px;
  font-weight: 550;
}
</style>