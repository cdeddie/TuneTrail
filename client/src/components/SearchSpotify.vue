<script setup>
import { ref, watch } from 'vue';
import debounce from 'debounce';

// SelectButton
const value = ref('Artist');

const query = ref('');
const searchResults = ref(null);
const isLoading = ref(true);

const fetchSearch = async() => {
  try {
    const url = `http://localhost:3000/spotify/search?query=${query.value.toLowerCase()}&type=${value.value.toLowerCase()}`;
    console.log(url);
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

watch(query, debounce(fetchSearch, 500));
</script>

<template>
  <div class="input-container">
    <div class="search-bar">
      <input class="input-bar" v-model="query" placeholder="Search..." type="text" @keyup.enter="fetchSearch">
    </div>

    <div v-if="searchResults" v-for="(artist) in searchResults.artists.items" :key="artist.externalUrl" class="artist-search-results">
    <span>{{ artist.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.input-bar {
  width: 80%;
}

.search-bar {
  display: flex;
  flex-direction: row;
  border: 1px solid white;
}

.input-container {
  border: 1px solid rgb(196, 32, 32);
  width: 100%;
}

input {
  background: none;
  outline: none;
  box-shadow: none;
}
</style>