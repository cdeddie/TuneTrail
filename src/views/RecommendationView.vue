<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import debounce from 'debounce';
import Recommendation from '../components/Recommendation.vue';
import SearchSpotify from '../components/SearchSpotify.vue';
import RequiresLogin from '../components/RequiresLogin.vue';
// TODO: mobile view (recommendation sliders dropdown in mobile)

const recObject = ref(null);
const tagObject = ref([]);

const responseData = ref(null);
const isLoading = ref(false);
const isLoggedIn = ref(false);

const handleRecs = (values) => {
  recObject.value = values;
};

const handleTags = (tags) => {
  tagObject.value = tags;
};

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/status`, { credentials: 'include' });
  const data = await response.json();
  isLoggedIn.value = data.isLoggedIn;
});

const filteredData = computed(() => {
  if (responseData.value) {
    return responseData.value.tracks.map(track => ({
      imageUrl: track.album.images[2].url,
      artistNames: track.artists.map(artist => artist.name).join(', '),
      explicit: track.explicit,
      externalUrl: track.external_urls.spotify,
      name: track.name
    }));
  }
  
  return [];
});

const fetchRecommendations = async () => {
  isLoading.value = true;

  if (tagObject.value.length === 0) {
    return;
  }

  try {
    const tags = encodeURIComponent(JSON.stringify(tagObject.value.map(tag => tag.id)));
    const recTargets = encodeURIComponent(JSON.stringify(recObject.value));
    const limit = 25; // TODO implement client manipulation
    const seedType = tagObject.value[0]?.type;

    const url = `${import.meta.env.VITE_API_BASE_URL}/spotify/recommendations?limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`;

    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    responseData.value = data;
  } catch (error) {
    console.error('Error fetching recommendations', error);
  } finally {
    isLoading.value = false;
  }
};

watch([tagObject], ([newValTag]) => {
  if (newValTag.length === 0) {
    responseData.value = null;
  } 
  fetchRecommendations();
}, { deep: true });

watch(recObject, debounce(fetchRecommendations, 500));
// Don't forget weird thing with thinking tags still exist after deleting the tags
</script>

<template>
  <div><span class="title gradient-text">Discover Songs</span></div>
  <div v-if="!isLoggedIn">
    <RequiresLogin :loginMessage="'find recommendations'" />
    <!-- style="display: flex; flex-direction: column; align-items: center; margin-left: auto; margin-right: auto; -->
  </div>

  <div v-else class="root">
    <div class="left-container">
      <SearchSpotify @updateTags="handleTags"/>
      <div class="result-container">
        <a 
          class="tag-container" 
          v-for="(track) in filteredData" 
          :key="track.externalUrl"
          :href="track.externalUrl"
          target="_blank"
        >
          <div class="image-container">
            <img class="tag-image" :src="track.imageUrl"></img>
            <i class="fa fa-play play-icon" aria-hidden="true"></i>
            </div> 
          <div class="track-info">
            <div class="track-title">{{ track.name }}</div>
            <div class="track-subtitle">{{ track.artistNames }}</div>
          </div>
        </a>
      </div>
    </div>
    <Recommendation @updateValues="handleRecs" />
  </div>
</template>

<style scoped> 
.root {
  margin-left: 15vh;
  margin-right: 15vh;

  display: flex;
  flex-direction: row;
}

.left-container {
  min-width: 80%;
}

.title {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 5vh;
  font-size: 3em; 
  font-weight: bold;
}

.tag-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px ;
  text-decoration: none;
  color: inherit;
}

.tag-container:hover .tag-image {
  transform: scale(1.1);
}

.play-icon {
  padding-left: 15px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  font-size: 2em;
  opacity: 0;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  color: white;
  pointer-events: none;
}

.tag-container:hover .play-icon {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.image-container {
  position: relative;
}

.tag-image {
  border-radius: 5%;
  transition: transform 0.3s ease-in-out;
}

.track-info {
  display: flex;
  flex-direction: column;
  margin-left: 1%;
}

.track-title {
  font-weight: bold;
  font-size: 1.1em;
  padding-bottom: 6px;
}

.track-subtitle {
  font-size: 0.8em;
}

img {
  border-radius: 5%;
  width: 64px;
  height: 64px;
  margin-left: 10%;
}

a:hover {
  background-color: var(--surface-100);
}

@media (max-width: 600px) {
  .title {
    font-size: 2.6em;
  }

  .root {
    margin: 0;
    flex-direction: column;
  }

  .recommendation-container {
    margin-left: auto;
    margin-right: auto;
    width: 80%;
  }

  .left-container {
    margin-left: 1vh;
  }
}

@media (max-width: 1040px) {
  .root {
    margin-left: 5vh;
    margin-right: 5vh;
  }
}
</style>