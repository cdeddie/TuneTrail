<script setup>
import { ref, watch, computed } from 'vue';
import debounce from 'debounce';
import Recommendation from '../components/Recommendation.vue';
import SearchSpotify from '../components/SearchSpotify.vue';
// TODO: mobile view (recommendation sliders dropdown in mobile)

const recObject = ref(null);
const tagObject = ref(null);

const responseData = ref(null);
const isLoading = ref(false);

const handleRecs = (values) => {
  recObject.value = values;
};

const handleTags = (tags) => {
  tagObject.value = tags;
};

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

  try {
    const tags = encodeURIComponent(JSON.stringify(tagObject.value.map(tag => tag.id)));
    const recTargets = encodeURIComponent(JSON.stringify(recObject.value));
    const limit = 10;
    const seedType = tagObject.value[0]?.type;

    const url = `http://localhost:3000/spotify/recommendations?limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`;

    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    responseData.value = data;
  } catch (error) {
    console.error('Error fetching recommendations', error);
  } finally {
    isLoading.value = false;
  }
};

// strange bug -> does not fetch upon tagObject modification after all tags are removed
// also, does not call fetch on track tags
watch([tagObject], ([newValTag]) => {
  if (newValTag && newValTag.length > 0) {
    fetchRecommendations();
  }
});

watch(recObject, debounce(fetchRecommendations, 500));
// Don't forget weird thing with thinking tags still exist after deleting the tags
</script>

<template>
  <div><span class="title">Get Recommendations</span></div>
  <div class="root">
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
    <Recommendation @updateValues="handleRecs" style="margin-left: 1%;"/>
  </div>
  <div>{{ recObject }}</div>
  <div>{{ tagObject }}</div>
  <pre v-if="responseData">{{ filteredData }}</pre>
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
  align-items: center;
  margin-bottom: 25px;
  font-size: 52px; 
  font-weight: bold;
  background: linear-gradient(to right, var(--primary-color) , #2BC4E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tag-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 5px;
  text-decoration: none;
  color: inherit;
}

.tag-container:hover .tag-image {
  transform: scale(1.1);
}

.play-icon {
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
</style>