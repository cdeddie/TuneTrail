<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  albumInfo: Object,
})
</script>

<template>
  <div class="album-display">
    <Image :src="albumInfo.album_image_url" :alt="albumInfo.album + ' cover'" width="100"/>
    <div v-for="(track, index) in albumInfo.tracks" :key="index" class="track">
      <Divider />
      <div class="track-content">
        <div class="text-content">
          <p :style="{ fontWeight: 'bold' }">{{ track.name }}</p>
          <p :style="{ fontSize: '12px', fontStyle: 'italic' }">{{  track.artists.join(', ') }}</p>
        </div>
        <audio controls :src="track.preview_url"></audio>
      </div>
    </div>
  </div>
</template>

<style scoped>
.track-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.text-content {
  flex-grow: 1;
}
</style>