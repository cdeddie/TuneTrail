<script setup>

</script>

<template>
  <div class="home-container">
    <div><span class="title">TuneTrail</span></div>
    <div class="subtitle">Utilities for Spotify Users</div>
  </div>

  <div class="bullshit-guidelines-container">
    <span style="margin-bottom: 7px; margin-left: 3px; font-size: 1rem; font-weight: 700;" class="gradient-text">Powered by</span>
    <img class ="spotify-img" src="/Spotify_logo_with_text.webp">
  </div>
</template>

<style scoped>
.bullshit-guidelines-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-left: auto;
  max-width: 12.5vw;
  margin-top: auto;
  min-height: 15vh;
}

.spotify-img {
  max-width: 15vw;
}

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

  .bullshit-guidelines-container {
    max-width: 50vw;
  }

  .spotify-img {
    max-width: 50vw;
  }
}

.bullshit-guidelines-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-left: auto;
  max-width: 12.5vw;
  margin-top: auto;
  min-height: 15vh;
}

.spotify-img {
  max-width: 15vw;
}
</style>