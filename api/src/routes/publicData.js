import express from 'express';
import fetchPlaylistTracks from '../middleware/publicFetchPlaylistTracks';

const router = express.Router();

router.get('/playlist/:playlistId', async (req, res) => {
  if (req.playlistData) {
    res.json(req.playlistData);
  } else {
    res.status(500).json({ error: 'Failed to fetch playlist tracks' });
  }
});

export default router;