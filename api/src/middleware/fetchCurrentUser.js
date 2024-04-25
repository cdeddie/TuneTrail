import fetch from 'node-fetch';

const fetchCurrentUser = async(req, res, next) => {
  if (!req.session.access_token) {
    return res.status(401).send('Access token is missing');
  }

  const url = 'https://api.spotify.com/v1/me';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${req.session.access_token}`
    }
  });

  if (!response.ok) {
    const errorMessage = `Current user call failed with status: ${response.status}`;
    console.error(errorMessage);
    console.log(response.body);
    return res.status(response.status).send(errorMessage);
  }

  if (response.ok) {
    const rawData = await response.json();

    const data = {
      display_name: rawData.display_name,
      external_url: rawData.external_urls,
      spotify_id: rawData.id,
      image: rawData.images.length > 0 ? rawData.images[0].url : null,
    }

    req.currentUser = data;
    next();
  } else {
    const errorData = await response.json();
    console.error('Failed to fetch current user:', errorData);
    res.status(response.status).send(errorData);
  }
};

export default fetchCurrentUser;
