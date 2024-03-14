import express from 'express';
import refreshTokenIfNeeded from '../middleware/refreshTokenIfNeeded.js';
import fetchCurrentlyPlaying from '../middleware/fetchCurrentlyPlaying.js';
import fetchCurrentUser from '../middleware/fetchCurrentUser.js';

const router = express.Router();

router.get('/currently-playing', refreshTokenIfNeeded, fetchCurrentlyPlaying,  (req, res) => {
  if (req.currentlyPlaying) {
    res.json(req.currentlyPlaying);
  } else {
    res.status(404).send('No track currently playing');
  }
});

router.get('/current-user', refreshTokenIfNeeded, fetchCurrentUser, (req, res) => {
  if (req.currentUser) {
    res.json(req.currentUser);
  } else {
    res.status(404).send('No current user');
  }
});

export default router;