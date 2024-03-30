<script setup>

</script>

<template>
  <div class="home-container">
    <div><span class="title">TuneTrail</span></div>
    <div class="subtitle">Utilities for Spotify Users</div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 75vh;
}

.title {
  font-size: 7em; 
  font-weight: bold;

	background: linear-gradient(90deg, #30a3cd, #23d579);
	background-size: 300%;
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
	animation: animate 5s ease-in-out infinite;
	text-align: center;
	line-height: 0.9;
}

@keyframes animate{
  0%{
    background-position: 0 50%;
  }
  50%{
    background-position: 100% 50%;
  }
  100%{
    background-position: 0 50%;
  }
}

.subtitle {
  margin-top: 1vh;
  font-size: 1.75em;
  font-weight: 550;
}

@media (max-width: 600px) {
  .title {
    font-size: 60px;
  }

  .subtitle {
    font-size: 20px;
  }
}
</style>