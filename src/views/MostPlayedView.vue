<script setup>
import { ref, onMounted } from 'vue';
import MostPlayedList from '../components/MostPlayedList.vue';
import RequiresLogin from '../components/RequiresLogin.vue';

const isLoggedIn = ref(false);
const spotifyData = ref(null);
const isLoading = ref(true);
const props = defineProps({ 
  spotifyData: Object,
});

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/status`, { credentials: 'include' });
  const data = await response.json();
  isLoggedIn.value = data.isLoggedIn;
  if (isLoggedIn.value === true) {
    await fetchData();
  }
});

// todo: error checking i.e. display error message to client if fetch fails
const fetchData = async() => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/spotify/top`, { credentials: 'include' });
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

// populate an array with api/spotify/top format of response is:
// {artists: {short_term: [], medium_term: [], long_term: []}, tracks: {short_term: [], medium_term: [], long_term: []}}

</script>

<template>
  <div><span class="title gradient-text">Most Played</span></div>
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
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 5vh;
  font-size: 3em; 
  font-weight: bold;
}

.most-played-container {
  margin-right: auto;
  margin-left: auto;
  width: 45%;
  min-width: 40%;

  display: flex;
  flex-direction: column;
  border: 1px solid white;
  border-radius: 5px;
}

@media (max-width: 1350px) {
  .most-played-container {
    width: 60%;
    min-width: 45%;
  }
}

@media (max-width: 750px) {
  .most-played-container {
    width: 80%; 
    min-width: 60%;
  }
}

@media (max-width: 600px) {
  .most-played-container {
    border: none;
    width: 100%; 
    min-width: 95%;
  }
}

@media (max-width: 400px) {
  span .p-tabview-title {
    font-size: 10px;
  }
}
</style>