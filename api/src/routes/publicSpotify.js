import express from 'express';
import publicFetchPlaylistTracks from '../services/publicFetchPlaylistTracks.js';
import publicFetchSearch from '../services/publicFetchSearch.js';
import publicFetchRecommendations from '../services/publicFetchRecommendations.js';

const router = express.Router();

let currentUsers = 0;
let limit = 180; // 180 is the approximate spotify API limit every 60s

router.post('/increment-user', (req, res) => {
  currentUsers++;
  limit = currentUsers > 0 ? Math.floor(180 / currentUsers) : 180;
  req.app.locals.limit = limit;
  console.log(`New user joined. Current users: ${currentUsers}`);
  res.sendStatus(200);
});

router.post('/decrement-user', (req, res) => {
  currentUsers--;
  limit = currentUsers > 0 ? Math.floor(180 / currentUsers) : 180;
  req.app.locals.limit = limit;
  console.log(`User left. Current users: ${currentUsers}`);
  res.sendStatus(200);
});

router.get('/public-search', async(req, res) => {
  try {
    const response = await publicFetchSearch(req);
    res.json(response);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});

router.get('/public-recommendations', async(req, res) => {
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

router.get('/user-limit', (req, res) => {
  res.status(200).json(limit);
});

export { currentUsers, router }