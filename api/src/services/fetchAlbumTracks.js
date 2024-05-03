import fetch from 'node-fetch';

const fetchAlbumTracks = async(album_id, req) => {
  try {
    const url = `https://api.spotify.com/v1/albums/${album_id}/tracks`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${req.session.access_token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Fetch album tracks [Spotify API] call failed with status: ${response.status}`);
    }

    const albumData = await response.json();
    return albumData;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default fetchAlbumTracks;