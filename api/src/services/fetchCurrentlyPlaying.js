import fetch from 'node-fetch';
import fetchAlbumTracks from './fetchAlbumTracks.js';

const fetchCurrentlyPlaying = async (req) => {
  try {
    if (!req.session.access_token) {
      throw new Error('Access token is missing');
    }

    const url = 'https://api.spotify.com/v1/me/player';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${req.session.access_token}`
      }
    });

    // Spotify API returns 204 if no track playing.
    if (response.status === 204) {
      throw new Error('No track currently playing');
    }

    if (!response.ok) {
      throw new Error(`Fetch currently playing [Spotify API] failed with status: ${response.status}`);
    }

    const rawData = await response.json();

    const isLocal = rawData.item.is_local;

    if (isLocal) {
      const data = {
        track: rawData.item.name,
        artists: rawData.item.artists.map(artist => artist.name),
        album: rawData.item.album.name,
        album_image_url: rawData.item.album.images[0]?.url,
        progress_ms: rawData.progress_ms,
        duration_ms: rawData.item.duration_ms,
        is_local: rawData.item.is_local,
      };
      return data;
    } else {
      const albumData = await fetchAlbumTracks(rawData.item.album.id, req);
      const data = {
        track: rawData.item.name,
        artists: rawData.item.artists.map(artist => artist.name),
        album: rawData.item.album.name,
        album_type: rawData.item.album.album_type,
        album_id: rawData.item.album.id,
        album_image_url: rawData.item.album.images[0]?.url,
        album_release: rawData.item.album.release_date,
        album_url: rawData.item.album.external_urls.spotify,
        is_playing: rawData.is_playing,
        progress_ms: rawData.progress_ms,
        duration_ms: rawData.item.duration_ms,
        is_local: rawData.item.is_local,
        tracks: albumData.items.map(track => ({
          artist_spotify_url: track.artists[0].external_urls.spotify,
          artists: track.artists.map(artist => artist.name),
          duration_ms: track.duration_ms,
          explicit: track.explicit,
          spotify_url: track.external_urls.spotify,
          name: track.name,
          preview_url: track.preview_url,
        }))
      };
      return data;
    }
  } catch (error) {
    console.error('Error fetching currently playing data:', error);
    throw error;
  }
};

export default fetchCurrentlyPlaying;