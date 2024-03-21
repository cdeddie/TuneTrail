<script setup>
import UserFlow from '../components/UserFlow.vue';
</script>

<template>
  <nav>
    <ul>
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/about">About</RouterLink></li>
      <li><RouterLink to="/currently-playing">Currently Playing</RouterLink></li>
      <li><UserFlow /></li>
    </ul>

  </nav>

  <main>
    <RouterView />
  </main>

</template>

<style scoped>
nav {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
}

ul {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

li {
  font-weight: 750;
  margin-right: 20px;
  list-style-type: none;
}

li:last-child {
  margin-left: auto;
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

a:hover::after {
  width: 100%;
  left: 0;
}

a:hover {
  color: white;
}
</style>