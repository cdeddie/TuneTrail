import fetch from 'node-fetch';
import { getAccessToken } from '../utils/spotifyServicePublic.js';

const publicFetchPlaylistTracks = async (playlistId) => {
  try {
    const token = await getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!response.ok) {
      throw new Error(`Fetch playlist tracks failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default publicFetchPlaylistTracks;