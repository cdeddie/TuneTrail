<script setup>
import { ref, watch } from 'vue';
import debounce from 'debounce';

// SelectButton
const value = ref('Artists');
const options = ref(['Artists', 'Tracks']);
const tags = ref([]);

const showDropdown = ref(false);
const query = ref('');
const searchResults = ref(null);
const isLoading = ref(true);

const emit =  defineEmits(['updateTags']);

watch(tags, () => {
  emit('updateTags', tags.value);
}, { deep: true });

const fetchSearch = async() => {
  if (query.value.trim().length === 0) {
    return;
  }

  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/spotify/search?query=${query.value.toLowerCase()}&type=${value.value.toLowerCase().slice(0, -1)}`;
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    searchResults.value = data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 100);
};

const addTag = (tag) => {
  if (tags.value.some((t) => t.id === tag.id)) {
    return;
  }

  if (tag.type === 'artist') {
    tags.value.push({ type: 'artist', id: tag.id, name: tag.name, image: tag.images[2]?.url });
  } else {
    tags.value.push({ type: 'track', id: tag.id, name: tag.name, image: tag.album.images[1]?.url });
  }
};

const removeTag = (tag) => {
  tags.value = tags.value.filter((t) => t.id !== tag.id);
};

watch(() => tags.value.length, (newLength) => {
  if (newLength >= 5) {
    query.value = '';
  }
}, { immediate: true });

watch(query, debounce(fetchSearch, 500));

watch(value, () => {
  searchResults.value = null;
  query.value = '';
  tags.value = [];
});
</script>

<template>
  <div class="input-container">
    <div class="search-bar">
      <input 
        class="input-bar" 
        v-model="query" 
        :placeholder="tags.length >= 5 
          ? `Maximum number of ${value.toLowerCase()} reached` 
          : `Search by ${value.toLowerCase().slice(0, -1)}...`" 
        type="text" 
        @keyup.enter="fetchSearch" 
        @focus="showDropdown = true" 
        @blur="handleBlur"
        :disabled="tags.length >= 5"
      >
      <SelectButton v-model="value" :options="options" aria-labelledby="basic" />
    </div>
    <div class="divider"></div>

    <div class="search-results-dropdown" v-show="showDropdown">
      <div v-if="searchResults && value === 'Artists'" v-for="(artist) in searchResults.artists.items" :key="artist.externalUrl" class="search-results" @click="addTag(artist)">
        <div v-if="!artist.images[2]?.url" class="alternate-image"></div>
        <img v-else :src="artist.images[2]?.url" class="search-image">
        <span>{{ artist.name }}</span>
      </div>

      <div v-if="searchResults && value === 'Tracks'" v-for="(track) in searchResults.tracks.items" :key="track.externalUrl" class="search-results" @click="addTag(track)">
        <div v-if="!track.album.images[2]?.url" class="alternate-image"></div>
        <img v-else :src="track.album.images[2]?.url" class="search-image">
        <span>{{ track.name }} - 
          <span v-for="(artist, index) in track.artists" :key="artist.id">{{ artist.name }}<span v-if="index < track.artists.length - 1">, </span></span>
        </span>
      </div>  
    </div> 
    
    <div class="tags-group">
      <div v-for="(tag) in tags" :key="tag.id" class="tag-container">
        <img v-if="tag.image" :src="tag.image">
        <span class="gradient-text">{{ tag.name }}</span>
        <i class="fa fa-times-circle remove-tag" aria-hidden="true" @click="removeTag(tag)"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-container {
  width: 100%;
  position: relative;
  display: inline-block;
  padding-right: 10px;
  max-height: 30vh;
}

.input-bar {
  width: 87%;
  background: none;
  outline: none;
  box-shadow: none;
  border: none;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 20px;
  max-height: 5%;
  margin-top: auto;
}

.p-selectbutton {
  max-width: 85px;
  margin-left: auto;
}

.search-bar {
  display: flex;
  flex-direction: row;
}

.divider {
  margin-top: 3px;
  border-top: 3px solid var(--primary-color);
}

.tags-group {
  display: flex;
  gap: 10px;
  padding: 15px;
  flex-wrap: wrap;
}

.tag-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-50);
  border-radius: 10px;

  animation: popout 1s ease;
  -webkit-animation: popout 1s ease;
}
@keyframes popout {
  from{transform:scale(0)}
  80%{transform:scale(1.2)}
  to{transform:scale(1)}
}
@-webkit-keyframes popout {
  from{-webkit-transform:scale(0)}
  80%{-webkit-transform:scale(1.2)}
  to{-webkit-transform:scale(1)}
}

.tag-container img {
  width: 70px;
  height: 70px;
  border-radius: 10px 0 0 10px;
}

.tag-container span {
  padding: 20px;
  font-size: 15px;
  font-weight: 700;
}

.tag-container i {
  padding-right: 10px;
}

.tag-container i:hover {
  cursor: pointer;
}

.search-results-dropdown {
  position: absolute;
  width: 100%;
  left: 0;
  background-color: var(--surface-50);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  z-index: 1000;
}

.search-results {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 8px 2px 4px;
  font-size: 14px;
}

.search-results:hover {
  background-color: rgba(196, 32, 32, 0.2);
  cursor: pointer;
}

.search-image {
  width: 40px;
  height: 40px;
  margin-right: 4px;
  margin-top: 2px;
  margin-bottom: 2px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(147, 144, 144, 0.169);
}

</style>