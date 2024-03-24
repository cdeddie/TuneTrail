<script setup>
import { ref, onMounted, defineProps } from 'vue';
import MostPlayedList from '../components/MostPlayedList.vue';
import RequiresLogin from '../components/RequiresLogin.vue';

const isLoggedIn = ref(false);
const spotifyData = ref(null);
const isLoading = ref(true);
const props = defineProps({ 
  spotifyData: Object,
});

onMounted(async () => {
  const response = await fetch('http://localhost:3000/auth/status', { credentials: 'include' });
  const data = await response.json();
  isLoggedIn.value = data.isLoggedIn;
  console.log(isLoggedIn.value);
  if (isLoggedIn.value === true) {
    await fetchData();
  }
});

// todo: error checking i.e. display error message to client if fetch fails
const fetchData = async() => {
  try {
    const response = await fetch('http://localhost:3000/spotify/top', { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    spotifyData.value = data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    isLoading.value = false;
  }
};

// populate an array with http://localhost:3000/spotify/top format of response is:
// {artists: {short_term: [], medium_term: [], long_term: []}, tracks: {short_term: [], medium_term: [], long_term: []}}

</script>

<template>
  <div><span class="title">Most Played</span></div>
  <div v-if="!isLoggedIn">
    <RequiresLogin :loginMessage="'view your most played tracks and artists'" />
  </div>

  <div v-else>
    <div v-if="isLoading" class="most-played-container" style="border: none;">
      <ProgressSpinner />
    </div>
    <div v-else class="most-played-container">
      <MostPlayedList :spotifyData="spotifyData" />
    </div>
  </div>
</template>

<style scoped>
.time-button {
  margin: 10px;
  background: none;
  outline: none;
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

.most-played-container {
  margin-right: auto;
  margin-left: auto;
  width: 75%;
  max-width: 850px;
  min-width: 400px;

  display: flex;
  flex-direction: column;
  border: 1px solid white;
  border-radius: 5px;
}

</style>