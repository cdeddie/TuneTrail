import express from 'express';
import refreshTokenIfNeeded from '../middleware/refreshTokenIfNeeded.js';
import fetchCurrentlyPlaying from '../services/fetchCurrentlyPlaying.js';
import fetchCurrentUser from '../services/fetchCurrentUser.js';
import fetchSearch from '../services/fetchSearch.js';
import fetchMostPlayed from '../services/fetchMostPlayed.js';
import fetchRecommendations from '../services/fetchRecommendations.js'

const router = express.Router();

router.get('/currently-playing', refreshTokenIfNeeded, async(req, res) => {
  try {
    const response = await fetchCurrentlyPlaying(req);
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

router.get('/current-user', refreshTokenIfNeeded, async(req, res) => {
  try {
    const response = await fetchCurrentUser(req);
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

// params included like /spotify/search?query=kanye&type=artist
router.get('/search', refreshTokenIfNeeded, async(req, res) => {
  try {
    const response = await fetchSearch(req);
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

router.get('/top', refreshTokenIfNeeded, async(req, res) => {
  try {
    const response = await fetchMostPlayed(req, res);
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

router.get('/recommendations', refreshTokenIfNeeded, async (req, res) => {
  try {
    const response = await fetchRecommendations(req, res);
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

export default router;