<script setup>
import { ref } from 'vue';

const value = ref('Tracks');
const options = ref(['Tracks', 'Artists']);
</script>

<template>
  <div><span class="title">Most Played</span></div>
  <div class="most-played-container">
    <SelectButton v-model="value" :options="options" aria-labelledby="basic" style="margin-left: auto; margin-right: auto;"/><SelectButton />
    <div v-if="value === 'Tracks'" class="tracks-container">
      Tracks
    </div>
    <div v-else class="artists-container">
      Artists
    </div>
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

.most-played-container {
  margin-left: 50vh;
  margin-right: 50vh;

  display: flex;
  flex-direction: column;
  border: 1px solid white;
}

</style>