import fetch from 'node-fetch';

const fetchSearch = async (req) => {
  try {
    const { query, type } = req.query;
    const url = `https://api.spotify.com/v1/search?q=${query}&type=${type}&market=AU&limit=10`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${req.session.access_token}`
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

export default fetchSearch;