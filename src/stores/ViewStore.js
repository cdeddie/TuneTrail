import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useViewStore = defineStore('ViewStore', () => {
  const screenWidth = ref(window.innerWidth);
  const isMobile = ref(window.innerWidth <= 700);

  const handleResize = () => {
    screenWidth.value = window.innerWidth;       // Actual px value for screen width
    isMobile.value = window.innerWidth < 700;    // Bool value for mobile/desktop
  };

  const initResize = () => {
    window.addEventListener('resize', handleResize);
  };

  const destroyResize = () => {
    window.removeEventListener('resize', handleResize);
  };

  return {
    screenWidth,
    isMobile,
    handleResize,
    initResize,
    destroyResize
  }
});