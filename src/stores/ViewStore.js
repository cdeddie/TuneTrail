import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';

export const useViewStore = defineStore('ViewStore', () => {
  const screenWidth = ref(window.innerWidth);
  const isMobile = ref(window.innerWidth <= 700);

  const handleResize = () => {
    screenWidth.value = window.innerWidth;       // Actual px value for screen width
    isMobile.value = window.innerWidth < 700;    // Bool value for mobile/desktop
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return {
    screenWidth,
    isMobile,
  }
});