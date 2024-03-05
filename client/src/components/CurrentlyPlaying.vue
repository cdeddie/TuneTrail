<script setup>
import { ref, computed } from 'vue';
import AlbumDisplay from './AlbumDisplay.vue';

const currentInfo = ref(null);
const hasFetched = ref(false);
const isLoading = ref(false);
const visible = ref(false);

const fetchCurrentlyPlaying = async() => {
  isLoading.value = true;
  hasFetched.value = true;
  try {
    const response = await fetch('http://localhost:3000/currently-playing', { credentials: 'include', });
    if (!response.ok) throw new Error('Failed to fetch');
    if (response.status === 204) {
      currentInfo.value = null;
      return;
    }
    currentInfo.value = await response.json();
  } catch (error) {
    console.error(error);
    currentInfo.value = null;
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
  return formatMilliseconds(currentInfo.value.progress_ms);
});

const formattedDuration = computed(() => {
  return formatMilliseconds(currentInfo.value.duration_ms);
});

const completionPercentage = computed(() => {
  if (!currentInfo.value.duration_ms || !currentInfo.value.progress_ms) return 0;
  return ((currentInfo.value.progress_ms / currentInfo.value.duration_ms) * 100).toFixed(2);
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

    <div v-else-if="currentInfo" class="track-info">
      <p><strong>Track:</strong> {{ currentInfo.track }}</p>
      <p><strong>Artists:</strong> {{ currentInfo.artists.join(', ') }}</p>
      <p>
        <strong>Album: </strong> 
        <Button label="Show" @click="visible=true" unstyled class="track-info-button">{{ currentInfo.album }}</Button>
        <Dialog v-model:visible="visible" @hide="visible=false" modal :header="currentInfo.album">
          <Image :src="currentInfo.album_image_url" :alt="currentInfo.album + ' cover'" width="100"/>
          <AlbumDisplay :albumInfo="currentInfo"/>
        </Dialog>
      </p>
      <p><strong>Completion:</strong> {{ completionPercentage }}%</p>
      <Image :src="currentInfo.album_image_url" :alt="currentInfo.album + ' cover'" width="200" preview />
    </div>

    <div v-else-if="!currentInfo && hasFetched && !isLoading">
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

.skeleton {
  margin: 1rem;
  margin-bottom: 1rem;
}

.track-info-button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.track-info-button:hover {
  text-decoration: underline;
  color: var(--text-color-secondary);
}
</style>