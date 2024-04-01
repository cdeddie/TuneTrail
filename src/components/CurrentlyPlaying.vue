<script setup>
import { ref, computed } from 'vue';
import AlbumDisplay from './AlbumDisplay.vue';
import { useToast } from 'primevue/usetoast';

const currentInfo = ref(null);
const hasFetched = ref(false);
const isLoading = ref(false);
const visible = ref(false);
const toast = useToast();


const fetchCurrentlyPlaying = async() => {
  isLoading.value = true;
  hasFetched.value = true;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/spotify/currently-playing`, { credentials: 'include', });
    if (!response.ok) throw new Error('Failed to fetch');
    if (response.status === 204) {
      currentInfo.value = null;
      return;
    }
    currentInfo.value = await response.json();
    if (currentInfo.value.is_local) {
      toast.add({ severity: 'warn', summary: 'Local file', detail: 'Local files are not recommended for use with this service' });
    }
  } catch (error) {
    console.error(error);
    currentInfo.value = null;
  } finally {
    isLoading.value = false;
  }
};

const completionPercentage = computed(() => {
  if (!currentInfo.value.duration_ms || !currentInfo.value.progress_ms) return 0;
  return ((currentInfo.value.progress_ms / currentInfo.value.duration_ms) * 100).toFixed(2);
});

</script>

<template>
  <!-- Styling for background image: -->
  <!-- :style="currentInfo && currentInfo.album_image_url ? `background-image: url(${currentInfo.album_image_url})` : ''" -->
  <div class="currently-playing-container">
    <Toast />
    <Button @click="fetchCurrentlyPlaying" rounded class="currently-playing-button" style="font-weight: bold;">What's Playing?</Button>

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
        <Dialog v-model:visible="visible" @hide="visible=false" modal :header="currentInfo.album" :breakpoints="{'960px':'75vw','640px':'95vw'}">
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
.track-info {
  color: var(--surface-500);
}

.currently-playing-container, .track-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.currently-playing-container {
  background-size: contain;
  background-position: center;
  position: relative;
  background-repeat: no-repeat;
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
  position: relative;
  overflow: hidden;
  background: linear-gradient(to right, var(--primary-color) , #2BC4E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.track-info-button::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1.5px;
  background: var(--primary-color);
  bottom: 0;
  left: 50%;
  transition: all 0.5s;
}

.track-info-button:hover::after {
  width: 100%;
  left: 0;
}

.track-info-button:hover {
  color: var(--primary-color);
}



.currently-playing-button {
  transition: transform 0.3s ease-in-out;
}

.currently-playing-button:hover {
  transform: translateY(-3px);
}
</style>