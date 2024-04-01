<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  loginMessage: String,
});

const redirectToLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
};
</script>

<template>
  <div class="login-container">
    <div class="gradient-text login">Log In</div>
    <p>To {{ loginMessage }}, you need to login with spotify. TuneTrail never logs or stores any of your data.</p>
    <Button class="login-button" @click="redirectToLogin" rounded><b><i class="fa fa-spotify"></i> Log In</b></Button>
  </div>
</template>

<style scoped>
.login {
  margin: 2.5vh 0 0.6vh 0;
  font-weight: 650;

  font-size: 2em; 
  font-weight: bold;
}

p {
  margin-right: 0.5vw;
  margin-left: 0.5vw;
  text-align: center;
  font-size: 1.5vh;
  font-weight: 550;
  max-width: 85%;
}

.login-container {
  background-color: var(--surface-50);
  border-radius: 1vw;
  margin-right: auto;
  margin-left: auto;
  width: 75%;
  max-width: 35vw;
  min-width: 15vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 10vh;
}

.login-button {
  margin-bottom: 2.5vh;
  transition: transform 0.3s ease-in-out;
}

.login-button:hover {
  transform: translateY(-0.3vh);
}

@media (max-width: 600px) {
  .login-container {
    width: 90%;
    max-width: 100%;
    border-radius: 2vw;
  }
}
</style>