<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();

const copyEmail = () => {
  navigator.clipboard.writeText('edwinchendesailly@gmail.com');
  toast.add({ severity: 'success', summary: 'Email Address Copied', detail: 'edwinchendesailly@gmail.com', life: 2500 });
}
</script>

<template>
  <div class="about-container">
    <div class="about-content">
      <i class="fa fa-github" aria-hidden="true"></i>
      <a href="https://github.com/cdeddie/tuneTrail/" target="_blank">GitHub</a>
      <i class="fa fa-envelope-o" aria-hidden="true"></i>
      <Toast position="bottom-right"/>
      <span v-tooltip="'Copy Email'" placeholder="Top" @click="copyEmail">Feedback</span>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  background-color: var(--surface-50);
  width: 25vw;
  display: flex;
  margin-top: 35vh;
  margin-left: auto;
  margin-right: auto;
  border-radius: 1vw;
  flex-direction: row;
  justify-content: center;
}

.about-content {
  padding: 1vw;
  display: flex;
  align-items: center;
}

span {
  padding-left: 10px;
  cursor: pointer;
}

span:hover {
  color: rgb(189, 189, 189);
}

a {
  padding: 0 10px;
  text-decoration: none;
}

a:hover {
  color: rgb(189, 189, 189) !important;
}

a:visited {
  color: white;
  text-decoration: none;
}

i {
  padding-left: 20px;
  font-size: 2rem;
}

@media (max-width: 1040px) {
  .about-container {
    width: 40vw;
  }
}

@media (max-width: 600px) {
  .about-container {
    background-color: #121212;
  }
}
</style>