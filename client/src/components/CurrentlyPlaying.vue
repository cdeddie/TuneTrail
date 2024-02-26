<script setup>
import { ref, computed } from 'vue';

const trackInfo = ref(null);
const hasFetched = ref(false);
const isLoading = ref(false);

const fetchCurrentlyPlaying = async() => {
  isLoading.value = true;
  hasFetched.value = true;
  try {
    const response = await fetch('http://localhost:3000/currently-playing', { credentials: 'include', });
    if (!response.ok) throw new Error('Failed to fetch');
    if (response.status === 204) {
      trackInfo.value = null;
      return;
    }
    trackInfo.value = await response.json();
  } catch (error) {
    console.error(error);
    trackInfo.value = null;
  } finally {
    isLoading.value = false;
  }
};

const formatMilliseconds = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

const formattedProgress = computed(() => {
  return formatMilliseconds(trackInfo.value.progress_ms);
});

const formattedDuration = computed(() => {
  return formatMilliseconds(trackInfo.value.duration_ms);
});

const completionPercentage = computed(() => {
  if (!trackInfo.value.duration_ms || !trackInfo.value.progress_ms) return 0;
  return ((trackInfo.value.progress_ms / trackInfo.value.duration_ms) * 100).toFixed(2);
});

</script>

<template>
  <div class="currently-playing-container">
    <Button @click="fetchCurrentlyPlaying" rounded>What's Playing?</Button>

    <Skeleton class="skeleton" v-if="isLoading" width="20rem" height="1rem"></Skeleton>
    <Skeleton class="skeleton" v-if="isLoading" width="20rem" height="1rem"></Skeleton>
    <Skeleton class="skeleton" v-if="isLoading" width="20rem" height="1rem"></Skeleton>
    <Skeleton class="skeleton" v-if="isLoading" width="20rem" height="1rem"></Skeleton>
    <Skeleton class="skeleton" v-if="isLoading" width="100px" height="100px"></Skeleton>

    <div v-else-if="trackInfo" class="track-info">
      <p><strong>Track:</strong> {{ trackInfo.track }}</p>
      <p><strong>Artists:</strong> {{ trackInfo.artists }}</p>
      <p><strong>Album:</strong> {{ trackInfo.album }}</p>
      <p><strong>Completion:</strong> {{ completionPercentage }}%</p>
      <img :src="trackInfo.album_image_url" alt="Album cover" />
    </div>

    <div v-else-if="!trackInfo && hasFetched && !isLoading">
      No song currently playing.
    </div>
  </div>
</template>

<style scoped>
.currently-playing-container, .track-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

img {
  width: 100px;
  height: auto;
}

.skeleton {
  margin: 1rem;
  margin-bottom: 1rem;
}
</style>