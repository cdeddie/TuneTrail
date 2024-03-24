<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  loginMessage: String,
});

const redirectToLogin = () => {
  window.location.href = 'http://localhost:3000/auth/login';
};
</script>

<template>
  <div class="root">
    <div class="gradient-text login">Log In</div>
    <p>To {{ loginMessage }}, you need to login with spotify. <br>TuneTrail never logs or stores any of your data.</p>
    <Button class="login-button" @click="redirectToLogin" rounded><b><i class="fa fa-spotify"></i> Log In</b></Button>
  </div>
</template>

<style scoped>
.login {
  margin: 24px 0 6px 0;
  font-weight: 650;

  font-size: 42px; 
  font-weight: bold;
}

p {
  margin-right: 10px;
  margin-left: 10px;
  text-align: center;
  font-size: 15px;
  font-weight: 550;
}

.root {
  background-color: var(--surface-50);
  border-radius: 10px;
  margin-right: auto;
  margin-left: auto;
  width: 75%;
  max-width: 700px;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 10vh;
}

.login-button {
  margin-bottom: 24px;
  transition: transform 0.3s ease-in-out;
}

.login-button:hover {
  transform: translateY(-3px);
}
</style>