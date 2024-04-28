<script setup>

</script>

<template>
  <div class="home-container">
    <div><span class="title">TuneTrail</span></div>
    <div class="subtitle">
      <span>Utilities for</span>
      <a href="https://open.spotify.com/" target="_blank">
        <img class ="spotify-img" src="/Spotify_logo_with_text.webp" alt="Spotify">
      </a>
      <span>Users</span>
    </div>
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

.subtitle {
  margin-top: .25vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.75em;
  font-weight: 550;
}

.subtitle a
.subtitle img {
  display: inline-block;
  max-width: 100%;
}

.spotify-img {
  padding-left: 8px;
  padding-right: 5px;
  height: 1.7em;
  min-width: calc(1.6em * 3.6);
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
</style>
