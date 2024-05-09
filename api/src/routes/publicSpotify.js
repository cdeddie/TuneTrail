import express from 'express';
import publicFetchPlaylistTracks from '../services/publicFetchPlaylistTracks.js';
import publicFetchSearch from '../services/publicFetchSearch.js';
import publicFetchRecommendations from '../services/publicFetchRecommendations.js';
import { shortLimiter, longLimiter } from '../middleware/publicRateLimiter.js';

const router = express.Router();

router.get('/public-search', shortLimiter, longLimiter, async(req, res) => {
  try {
    const response = await publicFetchSearch(req);
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

router.get('/public-recommendations', shortLimiter, longLimiter, async(req, res) => {
  try {
    const response = await publicFetchRecommendations(req);
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

// TODO: use publicFetchPlaylistTracks
router.get('/playlist/:playlistId', async (req, res) => {
  if (req.playlistData) {
    res.json(req.playlistData);
  } else {
    res.status(500).json({ error: 'Failed to fetch playlist tracks' });
  }
});

router.get('/user-limit', async(req, res) => {
  res.status(200).json(req.app.locals.limit);
});

export { router }