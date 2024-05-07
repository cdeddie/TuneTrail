<script setup>
import { ref, watchEffect } from 'vue';
import { useViewStore } from '../stores/ViewStore.js';

const viewStore = useViewStore();

const sliders = ref([
  { name: 'acousticness', value: 0 },
  { name: 'danceability', value: 0 },
  { name: 'energy', value: 0 },
  { name: 'instrumentalness', value: 0 },
  { name: 'liveness', value: 0 },
  { name: 'loudness', value: 0 },
  { name: 'popularity', value: 0 },
  { name: 'speechiness', value: 0 },
  { name: 'tempo', value: 0 },
  { name: 'valence', value: 0 },
]);

const emit = defineEmits(['updateValues']);

// We're looking into this very strongly
watchEffect(() => {
  const values = sliders.value.reduce((obj, slider) => {
    obj[slider.name] = slider.value;
    return obj;
  }, {});

  emit('updateValues', values);
});

const showFilters = ref(false);

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};
</script>

<template>
  <div class="recommendation-container">
    <span v-if="viewStore.isMobile" class="filter-toggle" @click="toggleFilters">
      {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      <i class="pi pi-chevron-down chev" :class="{ 'rotate': showFilters }"></i>
    </span>
    <div v-if="viewStore.isMobile" class="slider-dropdown" :class="{ 'open': showFilters }">
      <div v-for="slider in sliders" :key="slider.name" class="slider-container">
        <span class="slider-label">
          {{ slider.name.charAt(0).toUpperCase() + slider.name.slice(1) }}:
          <span class="slider-value">{{ slider.value }}</span>
        </span>
        <Slider v-model="slider.value" />
      </div>
    </div>

    <div v-else style="height: fit-content; padding-bottom: 25px;">
      <div v-for="slider in sliders" :key="slider.name" class="slider-container">
        <span class="slider-label">
          {{ slider.name.charAt(0).toUpperCase() + slider.name.slice(1) }}:
          <span class="slider-value">{{ slider.value }}</span>
        </span>
        <Slider v-model="slider.value" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommendation-container {
  font-family: 'Circular', var(--font-family);
  width: 100%;
  height: fit-content;
  margin-left: 1rem;
  background-color: #282c34;
  border-radius: 16px;
  box-shadow: -2px 6px 6px #7374734f;
  position: relative;
}

.filter-toggle {
  font-weight: 700;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding: 20px 20px 0 20px;
}

.chev {
  margin-left: auto; 
  font-size: .8rem;
  transition: transform 0.4s ease;
}

.chev.rotate {
  transform: rotate(180deg);
}

.slider-dropdown {
  padding-bottom: 20px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.slider-dropdown.open {
  max-height: 1000px;
}

.slider-container {
  margin-top: 1px;
  padding: 0 20px;
}

.slider-value {
  font-weight: bold;
  background: linear-gradient(to right, var(--primary-color) , #2BC4E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.slider-label {
  font-weight: 300;
  font-size: 16px;
  display: inline-block;
  margin-top: 1rem;
  margin-bottom: .5rem;
}

@media (max-width: 1040px) {
  .recommendation-container {
    width: 25vw;
  }

  .slider-label {
    font-size: 14px;
  }
}

@media (max-width: 600px) {
  .recommendation-container {
    width: 95vw;
    margin-left: auto;
    margin-right: auto;
  }

  .filter-toggle {
    height: 2vh;
  }
}
</style>
