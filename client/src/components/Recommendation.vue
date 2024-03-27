<script setup>
import { ref, defineEmits, watchEffect } from 'vue';

const acousticness = ref(0);
const danceability = ref(0);
const energy = ref(0);
const instrumentalness = ref(0);
const liveness = ref(0);
const loudness = ref(0);
const popularity = ref(0);
const speechiness = ref(0);
const tempo = ref(0); //50-200
const valence = ref(0);

const emit = defineEmits(['updateValues']);

watchEffect(() => {
  const values = {
    acousticness: acousticness.value,
    danceability: danceability.value,
    energy: energy.value,
    instrumentalness: instrumentalness.value,
    liveness: liveness.value,
    loudness: loudness.value,
    popularity: popularity.value,
    speechiness: speechiness.value,
    tempo: tempo.value,
    valence: valence.value,
  };

  emit('updateValues', values);
});
</script>

<template>
  <div class="recommendation-container">

    <div class="slider-container">
      <span class="slider-label">Acousticness: <span class="slider-value">{{ acousticness }}</span></span>
      <Slider v-model="acousticness" />
    </div>

    <div class="slider-container">
      <span class="slider-label">Danceability: <span class="slider-value">{{ danceability }}</span></span>
      <Slider v-model="danceability" />
    </div>

    <div class="slider-container">
      <span class="slider-label">Energy: <span class="slider-value">{{ energy }}</span></span>
      <Slider v-model="energy" />
    </div>

    <div class="slider-container">
      <span class="slider-label">Instrumentalness: <span class="slider-value">{{ instrumentalness }}</span></span>
      <Slider v-model="instrumentalness" />
    </div>

    <div class="slider-container">
      <span class="slider-label">Liveness: <span class="slider-value">{{ liveness }}</span></span>
      <Slider v-model="liveness" />
    </div>

    <div class="slider-container">
      <span class="slider-label">Loudness: <span class="slider-value">{{ loudness }}</span></span>
      <Slider v-model="loudness" />
    </div>

    <div class="slider-container">
      <span class="slider-label">Popularity: <span class="slider-value">{{ popularity }}</span></span>
      <Slider v-model="popularity" />
    </div>

    <div class="slider-container">
      <span class="slider-label">Speechiness: <span class="slider-value">{{ speechiness }}</span></span>
      <Slider v-model="speechiness" />
    </div>

    <div class="slider-container">
      <span class="slider-label">Tempo: <span class="slider-value">{{ tempo }}</span></span>
      <Slider v-model="tempo" />
    </div>

    <div class="slider-container">
      <span class="slider-label">Valence: <span class="slider-value">{{ valence }}</span></span>
      <Slider v-model="valence"/>
    </div>

  </div>
</template>

<style scoped>
.recommendation-container {
  min-width: 300px;
  max-width: 300px;
  background-color: #282c34;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 16px #7374734f;
}

.slider-value {
  font-weight: bold;
  background: linear-gradient(to right, var(--primary-color) , #2BC4E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.slider-label {
  font-weight: 300;
  font-size: 17px;
  display: inline-block;
  margin-bottom: 1rem;
}

</style>
