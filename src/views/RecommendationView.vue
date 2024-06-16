<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useViewStore } from '../stores/ViewStore.js';
import debounce from 'debounce';
import { useToast } from 'primevue/usetoast';
import Recommendation from '../components/Recommendation.vue';
import SearchSpotify from '../components/SearchSpotify.vue';
import RequiresLogin from '../components/RequiresLogin.vue';
// TODO: mobile view (recommendation sliders dropdown in mobile)

const viewStore = useViewStore();
const recObject = ref(null);
const tagObject = ref([]);

const responseData = ref(null);
const isLoading = ref(false);
const isLoggedIn = ref(false);
const rateLimited = ref(false);
const toast = useToast();

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

// Here I'm filtering the data on the client side instead of the server side. Probably should have done this throughout the project
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

const handleTimeout = () => {
  rateLimited.value = true;
  toast.add({ 
    severity: 'error', 
    summary: 'Slow down!', 
    detail: 'You\'re searching for too many recommendations in a short amount of time! Wait 60 seconds and try again.' 
  });

  setTimeout(() => {
    rateLimited.value = false;
  }, 60000);
};

const fetchRecommendations = async () => {
  isLoading.value = true;

  if (tagObject.value.length === 0) return;

  try {
    const tags = encodeURIComponent(JSON.stringify(tagObject.value.map(tag => tag.id)));
    const recTargets = encodeURIComponent(JSON.stringify(recObject.value));
    const limit = 25; // TODO implement client manipulation
    const seedType = tagObject.value[0]?.type;

    let url;
    if (isLoggedIn.value) {
      url = `${import.meta.env.VITE_API_BASE_URL}/spotify/recommendations?limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`;
    } else {
      url = `${import.meta.env.VITE_API_BASE_URL}/public-recommendations?limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`;
    }

    const response = await fetch(url, { credentials: 'include' });

    if (response.status === 429) {
      handleTimeout();
    }

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

const redirectToLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
};
</script>

<template>
<Toast />
<div class="recommendation-view">
  <div><span class="title gradient-text">Discover Songs</span></div>

  <div v-if="!viewStore.isMobile" class="desktop-view">
    <div class="left-container">
      <SearchSpotify @updateTags="handleTags" @update:rateLimited="handleTimeout" v-model:rate-limited="rateLimited" />
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
    <div class="right-container">
      <div class="login-container" v-if="!isLoggedIn">
        <div class="button-container">
          <span class="login-exp">To ensure the best experience:</span>
          <Button class="login-button" @click="redirectToLogin" rounded>
          <b><i class="fa fa-spotify"></i> Log In</b>
        </Button>
        </div>
        <hr>
        <span>You have a limited amount of API calls on a 60s basis. Each search/recommendation uses one. Login to use your own Spotify API key.</span>
      </div>
      <Recommendation @updateValues="handleRecs" :rateLimited="rateLimited" />
    </div>
  </div>
  <!-- If mobile screen -->
  <div v-else class="mobile-view">
    <SearchSpotify @updateTags="handleTags" @update:rateLimited="handleTimeout" v-model:rate-limited="rateLimited" />
    <div class="login-container" v-if="!isLoggedIn">
        <div class="button-container">
          <span class="login-exp">To ensure the best experience:</span>
          <Button class="login-button" @click="redirectToLogin" rounded>
          <b><i class="fa fa-spotify"></i> Log In</b>
        </Button>
        </div>
        <hr>
        <span>You have a limited amount of API calls on a 60s basis. Each search/recommendation uses one. Login to use your own Spotify API key.</span>
      </div>
    <Recommendation @updateValues="handleRecs" :rateLimited="rateLimited" />
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
</div>
</template>

<style scoped>
.recommendation-view {
  max-width: 99vw;
  overflow: hidden;
} 

.desktop-view {
  margin-left: 15vh;
  margin-right: 15vh;

  display: flex;
  flex-direction: row;
}

.left-container {
  width: 75%;
}

.right-container {
  font-family: 'Circular', var(--font-family);
  display: flex;
  flex-direction: column;
  width: 25%;
}

.login-container {
  background-color: #282c34;
  box-shadow: 0 0 10px rgba(83, 83, 83, 0.5);
  margin-left: 1rem;
  margin-bottom: 1.5rem;
  padding: 15px 20px;
  border-radius: 16px;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.button-container {
  display: flex;
  flex-direction: row;
}

.login-exp {
  display: flex;
  align-items: center;
}

.login-container span {
  flex: 1;
}

.login-container hr {
  border: 1px solid var(--primary-color); 
  width: 100%;
  margin: 15px 0;
}

.login-container .login-button {
  margin: auto;
  max-height: 90%;
}

.mobile-view .login-container {
  width: 95vw;
  margin-left: auto;
  margin-right: auto;
  padding: 15px;
}

.mobile-view hr {
  margin: 5px 0;
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

@media (max-width: 1450px) {
  .desktop-view {
    margin-left: 4vw;
    margin-right: 4vw;
  }

  .right-container {
    max-width: 35%;
  }
}

@media (max-width: 1300px) {
  .login-exp {
    display: none;
  }
}

@media (max-width: 1040px) {
  .desktop-view {
    margin-left: 2vw;
    margin-right: 3vw;
  }

  .login-container {
    width: 25vw;
    font-size: .8rem;
  }

  .login-button {
    background-color: black;
    color: white;
  }
}

@media (max-width: 800px) {
  .desktop-view {
    margin-left: 2vw;
    margin-right: 4.5vw;
  }
}

@media (max-width: 600px) {
  .title {
    font-size: 2.6em;
  }

  .desktop-view {
    margin: 0;
    flex-direction: column;
  }

  .input-container {
    margin-left: 2.5vw;
    margin-right: 2.5vw;
    padding: 0;
    width: 95%;
  }

  .result-container {
    margin-top: 2vh;
  }
}

@media (max-width: 350px) {
  .title {
    font-size: 2.4em;
  }
}
</style>