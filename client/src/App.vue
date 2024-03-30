<script setup>
import { ref, onMounted, provide } from 'vue';
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div class="app-container">
    <Navbar />

  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

</style>