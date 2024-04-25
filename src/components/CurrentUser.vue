<script setup>
import { ref, watch, onMounted } from 'vue';

const userInfo = ref(null);
const isLoading = ref(null);

const fetchCurrentUser = async() => {
  isLoading.value = true;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/spotify/current-user`, { credentials: 'include'}); // MAKE SURE TO CHECK IF THIS IS PROD
    if (!response.ok) throw new Error('Failed to fetch');
    userInfo.value = await response.json();
  } catch (error) {
    console.error(error);
    userInfo.value = null;
  } finally {
    isLoading.value = false;
  }
};

const props = defineProps({
  isLoggedIn: Boolean,
});

watch(() => props.isLoggedIn, (newVal) => {
  if (newVal) {
    fetchCurrentUser();
  } else {
    userInfo.value = null;
  }
})

onMounted(fetchCurrentUser);
</script>

<template>
  <div class="user-info" v-if="userInfo">
    <!-- <img class="user-img" :src="userInfo.image"> -->
    <div class="text">Currently logged in as: <a :href="userInfo.external_url.spotify">{{ userInfo.display_name }}</a></div>
  </div>
  <div v-else>Not logged in</div>
</template>

<style scoped>
.user-info {
  margin-top: 0.5%;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text {
  margin-bottom: 10px;
}

.user-image {
  border-radius: 50%; 
}

a:visited {
  color: var(--text-color);
}

a:hover {
  color: var(--text-color-secondary);
}
</style>
