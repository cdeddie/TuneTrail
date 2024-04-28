<script setup>
import { ref, computed } from 'vue';

const props = defineProps({ spotifyData: Object });

const value = ref('Tracks');
const options = ref(['Tracks', 'Artists']);

const shortTermArtistTags = computed(() => {
  return props.spotifyData.artists.short_term.map(artist => ({
    externalUrl: artist.external_urls.spotify,
    genres: artist.genres.slice(0, 3).join(', '),
    imageUrl: artist.images[2].url,
    name: artist.name
  }));
});

const mediumTermArtistTags = computed(() => {
  return props.spotifyData.artists.medium_term.map(artist => ({
    externalUrl: artist.external_urls.spotify,
    genres: artist.genres.slice(0, 3).join(', '),
    imageUrl: artist.images[2].url,
    name: artist.name
  }));
});

const longTermArtistTags = computed(() => {
  return props.spotifyData.artists.long_term.map(artist => ({
    externalUrl: artist.external_urls.spotify,
    genres: artist.genres.slice(0, 3).join(', '),
    imageUrl: artist.images[2].url,
    name: artist.name
  }));
});

const shortTermTrackTags = computed(() => {
  return props.spotifyData.tracks.short_term.map(track => ({
    imageUrl: track.album.images[1]?.url,
    artistNames: track.artists.map(artist => artist.name).join(', '),
    explicit: track.explicit,
    externalUrl: track.external_urls.spotify,
    name: track.name
  }));
});

const mediumTermTrackTags = computed(() => {
  return props.spotifyData.tracks.medium_term.map(track => ({
    imageUrl: track.album.images[2].url,
    artistNames: track.artists.map(artist => artist.name).join(', '),
    explicit: track.explicit,
    externalUrl: track.external_urls.spotify,
    name: track.name
  }));
});

const longTermTrackTags = computed(() => {
  return props.spotifyData.tracks.long_term.map(track => ({
    imageUrl: track.album.images[2].url,
    artistNames: track.artists.map(artist => artist.name).join(', '),
    explicit: track.explicit,
    externalUrl: track.external_urls.spotify,
    name: track.name
  }));
});

</script>

<template>
  <SelectButton v-model="value" :options="options" aria-labelledby="basic" style="margin-left: auto; margin-right: auto;"/><SelectButton />
    <div v-if="value === 'Tracks'" class="tracks-container">
      <TabView>
          <TabPanel header="Last Month">
            <a 
              class="tag-container" 
              v-for="(track, index) in shortTermTrackTags" 
              :key="track.externalUrl"
              :href="track.externalUrl"
              target="_blank"
            >
              <span style="font-weight: 800;" class="gradient-text">{{ index + 1}}</span>
              <div class="image-container">
                <img class="tag-image" :src="track.imageUrl"></img>
                <i class="fa fa-play play-icon" aria-hidden="true"></i>
               </div> 
              <div class="track-info">
                <div class="title">{{ track.name }}</div>
                <div class="subtitle">{{ track.artistNames }}</div>
              </div>
            </a>
          </TabPanel>

          <TabPanel header="Last 6 Months">
            <a 
              class="tag-container" 
              v-for="(track, index) in mediumTermTrackTags" 
              :key="track.externalUrl"
              :href="track.externalUrl"
              target="_blank"
            >
              <span style="font-weight: 800;" class="gradient-text">{{ index + 1}}</span>
              <div class="image-container">
                <img class="tag-image" :src="track.imageUrl"></img>
                <i class="fa fa-play play-icon" aria-hidden="true"></i>
               </div> 
              <div class="track-info">
                <div class="title">{{ track.name }}</div>
                <div class="subtitle">{{ track.artistNames }}</div>
              </div>
            </a>
          </TabPanel>

          <TabPanel header="Last 12 Months">
            <a 
              class="tag-container" 
              v-for="(track, index) in longTermTrackTags" 
              :key="track.externalUrl"
              :href="track.externalUrl"
              target="_blank"
            >
              <span style="font-weight: 800;" class="gradient-text">{{ index + 1}}</span>
              <div class="image-container">
                <img class="tag-image" :src="track.imageUrl"></img>
                <i class="fa fa-play play-icon" aria-hidden="true"></i>
               </div> 
              <div class="track-info">
                <div class="title">{{ track.name }}</div>
                <div class="subtitle">{{ track.artistNames }}</div>
              </div>
            </a>
          </TabPanel>
        </TabView>
    </div>
    
    <div v-else-if="value === 'Artists'" class="artists-container">
      <TabView>
        <TabPanel header="Last Month">
          <a 
            class="tag-container"
            v-for="(artist, index) in shortTermArtistTags"
            :key="artist.externalUrl"
            :href="artist.externalUrl"
            target="_blank"
          >
            <span style="font-weight: 800;" class="gradient-text">{{ index + 1}}</span>
              <div class="image-container">
                <img class="tag-image" :src="artist.imageUrl"></img>
              </div> 
              <div class="artist-info">
                <div class="title">{{ artist.name }}</div>
                <div class="subtitle" style="font-style: italic;">{{ artist.genres }}</div>
              </div>
          </a>
        </TabPanel>

        <TabPanel header="Last 6 Months">
          <a 
            class="tag-container"
            v-for="(artist, index) in mediumTermArtistTags"
            :key="artist.externalUrl"
            :href="artist.externalUrl"
            target="_blank"
          >
            <span style="font-weight: 800;" class="gradient-text">{{ index + 1}}</span>
              <div class="image-container">
                <img class="tag-image" :src="artist.imageUrl"></img>
              </div> 
              <div class="artist-info">
                <div class="title">{{ artist.name }}</div>
                <div class="subtitle" style="font-style: italic;">{{ artist.genres }}</div>
              </div>
          </a>
        </TabPanel>

        <TabPanel header="Last 12 Months">
          <a 
            class="tag-container"
            v-for="(artist, index) in longTermArtistTags"
            :key="artist.externalUrl"
            :href="artist.externalUrl"
            target="_blank"
          >
            <span style="font-weight: 800;" class="gradient-text">{{ index + 1}}</span>
              <div class="image-container">
                <img class="tag-image" :src="artist.imageUrl"></img>
              </div> 
              <div class="artist-info">
                <div class="title">{{ artist.name }}</div>
                <div class="subtitle" style="font-style: italic;">{{ artist.genres }}</div>
              </div>
          </a>
        </TabPanel>
      </TabView>
    </div>

</template>

<style scoped>
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
}

.title {
  font-weight: bold;
  font-size: 1.1em;
  padding-bottom: 6px;
}

.subtitle {
  font-size: 0.8em;
}

.tag-container:hover {
  background-color: var(--surface-50);
}

img {
  border-radius: 5%;
  width: 64px;
  height: 64px;
}
</style>