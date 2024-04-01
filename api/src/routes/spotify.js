import express from 'express';
import refreshTokenIfNeeded from '../middleware/refreshTokenIfNeeded.js';
import fetchCurrentlyPlaying from '../middleware/fetchCurrentlyPlaying.js';
import fetchCurrentUser from '../middleware/fetchCurrentUser.js';
import fetchSearch from '../middleware/fetchSearch.js';
import fetchMostPlayed from '../middleware/fetchMostPlayed.js';
import fetchRecommendations from '../middleware/fetchRecommendations.js'

const router = express.Router();

router.get('/currently-playing', refreshTokenIfNeeded, fetchCurrentlyPlaying,  (req, res) => {
  if (req.currentlyPlaying) {
    res.json(req.currentlyPlaying);
  } else {
    res.status(404).send('No track currently playing');
  }
});

router.get('/current-user', refreshTokenIfNeeded, fetchCurrentUser, (req, res) => {
  console.log('Getting current user');
  if (req.currentUser) {
    res.json(req.currentUser);
  } else {
    res.status(404).send('No current user');
  }
});

// params included like /spotify/search?query=kanye&type=artist
router.get('/search', refreshTokenIfNeeded, fetchSearch, (req, res) => {
  if (req.searchResults) {
    res.json(req.searchResults);
  } else {
    res.status(404).send('No search results');
  }
});

router.get('/top', refreshTokenIfNeeded, fetchMostPlayed, (req, res) => {
  if (req.aggregatedData) {
    res.status(200).json(req.aggregatedData);
  } else {
    console.log(res.body);
    res.status(404).send('No top tracks or artists');
  }
});

router.get('/recommendations', refreshTokenIfNeeded, fetchRecommendations, (req, res) => {
  if (req.rawData) {
    res.status(200).json(req.rawData);
  } else {
    console.log(res.body);
    res.status(404).send('No recommendations');
  }
});

export default router;