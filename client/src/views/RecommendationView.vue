<script setup>
import Recommendation from '../components/Recommendation.vue';
import SearchSpotify from '../components/SearchSpotify.vue';
</script>

<template>
  <div><span class="title">Get Recommendations</span></div>
  <div class="root">
    <SearchSpotify />
    <Recommendation />
  </div>
</template>

<style scoped>
.root {
  margin-left: 15vh;
  margin-right: 15vh;

  display: flex;
  flex-direction: row;
}

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