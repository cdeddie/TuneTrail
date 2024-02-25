<template>
  <div>
    <button @click="fetchCurrentlyPlaying">What's Playing?</button>
    <div v-if="trackInfo">
      <p><strong>Track:</strong> {{ trackInfo.track }}</p>
      <p><strong>Artists:</strong> {{ trackInfo.artists }}</p>
      <p><strong>Album:</strong> {{ trackInfo.album }}</p>
      <img :src="trackInfo.album_image_url" alt="Album cover" />
      <p><strong>Progress:</strong> {{ formattedProgress }}</p>
      <p><strong>Duration:</strong> {{ formattedDuration }}</p>
      <p><strong>Completion:</strong> {{ completionPercentage }}%</p>
      <p v-if="trackInfo.is_playing"><em>Currently Playing...</em></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trackInfo: null,
    };
  },
  computed: {
    formattedProgress() {
      return this.formatMilliseconds(this.trackInfo?.progress_ms);
    },
    formattedDuration() {
      return this.formatMilliseconds(this.trackInfo?.duration_ms);
    },
    completionPercentage() {
      if (!this.trackInfo?.duration_ms || !this.trackInfo?.progress_ms) return 0;
      return ((this.trackInfo.progress_ms / this.trackInfo.duration_ms) * 100).toFixed(2);
    },
  },
  methods: {
    async fetchCurrentlyPlaying() {
      try {
        const response = await fetch('http://localhost:3000/currently-playing', { credentials: 'include', });
        if (!response.ok) throw new Error('Failed to fetch');
        this.trackInfo = await response.json();
      } catch (error) {
        console.error(error);
        this.trackInfo = null; // Reset or handle error state appropriately
      }
    },
    formatMilliseconds(milliseconds) {
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    },
  },
};
</script>

<style scoped>
img {
  width: 100px;
  height: auto;
}
</style>
