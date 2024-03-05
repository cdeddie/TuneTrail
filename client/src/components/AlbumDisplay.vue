<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  albumInfo: Object,
})
</script>

<template>
  <div v-for="(track, index) in albumInfo.tracks" :key="index" class="track">
    <p :style="{ fontWeight: 'bold' }">{{ track.name }}</p>
    <p>{{  track.artists.join(', ') }}</p>
  </div>
</template>

<style scoped>
.track {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
</style>