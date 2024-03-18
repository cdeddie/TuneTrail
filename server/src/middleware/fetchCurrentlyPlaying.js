import fetch from 'node-fetch';
import fetchAlbumTracks from './fetchAlbumTracks.js';

const fetchCurrentlyPlaying = async(req, res, next) => {
  if (!req.session.access_token) {
    return res.status(401).send('Access token is missing');
  }

  const url = 'https://api.spotify.com/v1/me/player';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${req.session.access_token}`
    }
  });

  if (!response.ok) {
    const errorMessage = `https://api.spotify.com/v1/me/player API call failed with status: ${response.status}`;
    console.error(errorMessage);
    return res.status(response.status).send(errorMessage);
  }

  if (response.status === 204) {
    console.log('No track currently playing');
    return res.status(response.status).send('No track currently playing');
  }

  if (response.ok) {
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
      req.currentlyPlaying = data;
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

      req.currentlyPlaying = data;
    }
    
    next();
  } else {
    const errorData = await response.json();
    console.error('Failed to fetch currently playing data:', errorData);
    res.status(response.status).send(errorData);
  }
};

export default fetchCurrentlyPlaying;