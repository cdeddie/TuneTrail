<script setup>
import { ref, watchEffect, onMounted, defineComponent } from 'vue';
defineOptions({
  inheritAttrs: false,
  customOptions: {},
})

const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true');

/*******************
userInfo contains:
display_name
external_url
spotify_id
image (300x300)
*******************/
const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')));
const menu = ref();
const items = ref([
    {
      label: 'Logout',
      color: 'Red',
      command: async () => {
        localStorage.clear();
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, { credentials: 'include' }); // PROD CHECK
          if (!response.ok) {
            throw new Error('Failed to logout');
          }
          location.reload();
        } catch (error) {
          console.error(error);
        }
      }
    }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

onMounted(async () => {
  await checkLoginStatus();
  if (isLoggedIn.value) {
    await fetchCurrentUser();
  }
});

const checkLoginStatus = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/status`, { credentials: 'include' }); // PROD CHECK
    const data = await response.json();
    isLoggedIn.value = data.isLoggedIn;
  } catch (error) {
    console.error('Failed to check login status:', error);
  }
};

const redirectToSpotifyLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
  checkLoginStatus();
};

const fetchCurrentUser = async() => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/spotify/current-user`, { credentials: 'include'}); // MAKE SURE TO CHECK IF THIS IS PROD
    if (!response.ok) throw new Error('Failed to fetch');
    userInfo.value = await response.json();
  } catch (error) {
    console.error(error);
    userInfo.value = null;
  }
};

watchEffect(() => {
  localStorage.setItem('isLoggedIn', isLoggedIn.value);
  localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
  if (isLoggedIn.value === 'true' && !userInfo.value) {
    fetchCurrentUser();
  }
});

</script>

<template>
  <div class="user-flow-container">
    <Button v-if="!isLoggedIn" @click="redirectToSpotifyLogin" rounded><b>Sign in with Spotify</b></Button>

    <div v-else class="user-info-manage">
      <img v-if="userInfo?.image" class="user-image" :src="userInfo?.image" :alt="userInfo?.display_name" />
      <i v-else class="pi pi-user"></i>
      <span @click="toggle">{{ userInfo?.display_name }}</span>
      <Menu ref="menu" :model="items" :popup="true"></Menu>
    </div>
  </div>

</template>

<style scoped>
.user-flow-container {
  min-width: 204.75px;
  min-height: 56.75px;
  display: flex;
  justify-content: center;
  align-items: center;
}

Button {
  margin: 10px;
  transition: transform 0.3s ease-in-out;
}

Button:hover {
  transform: translateY(-3px);
}

/* 150x30 vs 185x37 */
.user-info-manage {
  color: var(--surface-500);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info-manage:hover {
  cursor: pointer;
  color: white;
}

.user-info-manage:hover .user-image {
  border: 3px solid rgba(122, 120, 120, 0.7);
}

.user-image {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-right: 6px;
  border: 3px solid rgba(122, 120, 120, 0.374);
}

.pi-user {
  font-size: 16px;
  margin-right: 6px;
}
</style>