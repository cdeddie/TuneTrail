import fetch from 'node-fetch';

const fetchCurrentUser = async (req) => {
  try {
    if (!req.session.access_token) {
      throw new Error('Access token is missing');
    }

    const url = 'https://api.spotify.com/v1/me';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${req.session.access_token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Fetch current user [Spotify API] failed with status: ${response.status}`);
    }

    const rawData = await response.json();

    const data = {
      display_name: rawData.display_name,
      external_url: rawData.external_urls,
      spotify_id: rawData.id,
      image: rawData.images.length > 0 ? rawData.images[0].url : null,
    };

    return data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export default fetchCurrentUser;