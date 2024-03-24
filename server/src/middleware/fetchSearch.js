import fetch from 'node-fetch';

// Allowed values: "album", "artist", "playlist", "track", "show", "episode", "audiobook"
const fetchSearch = async (req, res) => {
  const { query, type } = req.query;
  const url = `https://api.spotify.com/v1/search?q=${query}&type=${type}&market=AU&limit=10`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${req.session.access_token}`
    }
  });

  if (!response.ok) {
    const errorMessage = `Search call failed with status: ${response.status}`;
    console.error(errorMessage);
    return res.status(response.status).send(errorMessage);
  }

  if (response.ok) {
    const rawData = await response.json();
    console.log(rawData);
    res.json(rawData);
  } else {
    const errorData = await response.json();
    console.error('Failed to fetch search results: ', errorData);
    res.status(response.status).send(errorData);
  }
};

export default fetchSearch;