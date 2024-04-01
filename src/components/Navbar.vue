<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';
import UserFlow from '../components/UserFlow.vue';

const isDesktop = ref(window.innerWidth > 700);
const menuVisible = ref(false);

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value;
}

const closeMenu = (event) => {
  if (!event.target.closest('.mobile-nav') && menuVisible.value) {
    menuVisible.value = false;
  }
};

const closeMenuNav = () => {
  menuVisible.value = false;
};

window.addEventListener('resize', () => {
  isDesktop.value = window.innerWidth > 700;
});

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<template>
  <nav v-if="isDesktop" class="desktop-nav">
    <ul>
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/currently-playing">Currently Playing</RouterLink></li>
      <li><RouterLink to="/most-played">Most Played</RouterLink></li>
      <li><RouterLink to="/recommendation">Recommendations</RouterLink></li>
      <li><RouterLink to="/about">About</RouterLink></li>
      <li style="margin-left: auto;"><UserFlow /></li>
    </ul>
  </nav>

  <nav v-else class="mobile-nav">
    <div class="menu-toggle">
      <i class="fa fa-bars" @click="toggleMenu" aria-hidden="true" style="font-size: 2rem; padding: 2vh;"></i>
      <UserFlow v-show="menuVisible" class="mobile-user"/>
    </div>

    <Transition name="menu-slide" mode="out-in">
      <ul v-show="menuVisible" key="menu">
        <li><RouterLink to="/" @click="closeMenuNav">Home</RouterLink></li>
        <li><RouterLink to="/currently-playing" @click="closeMenuNav">Currently Playing</RouterLink></li>
        <li><RouterLink to="/most-played" @click="closeMenuNav">Most Played</RouterLink></li>
        <li><RouterLink to="/recommendation" @click="closeMenuNav">Recommendations</RouterLink></li>
        <li><RouterLink to="/about" @click="closeMenuNav">About</RouterLink></li>
      </ul>
    </Transition>
  </nav>

  <main>
    <RouterView />
  </main>

</template>

<style scoped>
.menu-slide-enter-active, .menu-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.menu-slide-enter-from, .menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.menu-slide-enter-to, .menu-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.desktop-nav ul {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.desktop-nav li {
  font-weight: 750;
  margin-right: 20px;
  list-style-type: none;
}

.mobile-nav {
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  width: 100%;
  font-weight: 700;
}

.mobile-nav .menu-toggle {
  cursor: pointer;
  display: flex;
  flex-direction: row;
}

.mobile-nav .menu-toggle .user-flow-container {
  margin-left: auto;
}

.mobile-nav ul {
  padding: 0;
}

.mobile-nav li {
  margin: 10px;
  padding-left: 10px;
}

@media (max-width: 700px) {
  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: block;
  }
}

a {
  color: var(--surface-500);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1.5px;
  background: white;
  bottom: 0;
  left: 50%;
  transition: all 0.5s;
}

a:hover::after,
a:focus::after {
  width: 100%;
  left: 0;
}

a:hover,
a:focus {
  color: white;
}
</style>