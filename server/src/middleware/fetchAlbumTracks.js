import fetch from 'node-fetch';

const fetchAlbumTracks = async(album_id, req) => {
  const url = `https://api.spotify.com/v1/albums/${album_id}/tracks`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${req.session.access_token}`
    }
  });

  if (!response.ok) {
    const errorMessage = `Fetch album tracks call failed with status: ${response.status}`;
    console.error(errorMessage);
    return null;
  }

  const albumData = await response.json();
  return albumData;
};

export default fetchAlbumTracks;