import fetch from 'node-fetch';
import { getAccessToken } from '../utils/spotifyServicePublic.js';

const publicFetchSearch = async (req) => {
  try {
    const { query, type } = req.query;
    const token = await getAccessToken();
    
    const url = `https://api.spotify.com/v1/search?q=${query}&type=${type}&market=AU&limit=10`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Fetch search [Spotify API] failed with status: ${response.status}`);
    }

    const rawData = await response.json();

    return rawData;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export default publicFetchSearch;