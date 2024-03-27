<script setup>
import { ref, watch } from 'vue';
import Recommendation from '../components/Recommendation.vue';
import SearchSpotify from '../components/SearchSpotify.vue';
// TODO: mobile view (recommendation sliders dropdown in mobile)

const recObject = ref(null);
const tagObject = ref(null);

const responseData = ref(null);
const isLoading = ref(false);

const handleRecs = (values) => {
  recObject.value = values;
};

const handleTags = (tags) => {
  tagObject.value = tags;
};

const fetchRecommendations = async () => {
  isLoading.value = true;

  try {
    const tags = encodeURIComponent(JSON.stringify(tagObject.value.map(tag => tag.id)));
    const recTargets = encodeURIComponent(JSON.stringify(recObject.value));
    const limit = 10;
    const seedType = tagObject.value[0]?.type;

    const url = `http://localhost:3000/spotify/recommendations?limit=${limit}&tags=${tags}&recTargets=${recTargets}&seedType=${seedType}`;

    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    responseData.value = data;
  } catch (error) {
    console.error('Error fetching recommendations', error);
  } finally {
    isLoading.value = false;
  }
};

watch([recObject, tagObject], ([newValRec, newValTag]) => {
  if (newValTag && newValTag.length > 0) {
    fetchRecommendations();
  }
});
// Don't forget weird thing with thinking tags still exist after deleting the tags
</script>

<template>
  <div><span class="title">Get Recommendations</span></div>
  <div class="root">
    <SearchSpotify @updateTags="handleTags"/>
    <Recommendation @updateValues="handleRecs"/>
  </div>
  <div>{{ recObject }}</div>
  <div>{{ tagObject }}</div>
  <pre v-if="responseData">{{ responseData }}</pre>
</template>

<style scoped> 
.root {
  margin-left: 15vh;
  margin-right: 15vh;


  display: flex;
  flex-direction: row;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  font-size: 52px; 
  font-weight: bold;
  background: linear-gradient(to right, var(--primary-color) , #2BC4E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>