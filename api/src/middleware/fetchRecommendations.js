import fetch from 'node-fetch';

const fetchRecommendations = async (req, res) => {
  const { limit, tags: encodedTags, recTargets: encodedRecTargets, seedType } = req.query;

  const tags = JSON.parse(decodeURIComponent(encodedTags));
  const recommendationTargets = JSON.parse(decodeURIComponent(encodedRecTargets));

  const seedKey = seedType === 'artist' ? 'seed_artists' : 'seed_tracks';

  let queryParams = new URLSearchParams({
    ...(limit && { limit }),
    [seedKey]: tags.join(','),
  });

  Object.keys(recommendationTargets).forEach(key => {
    if (recommendationTargets[key] > 0) {
      queryParams.append(`target_${key}`, recommendationTargets[key]);
    }
  });

  const url = `https://api.spotify.com/v1/recommendations?${queryParams}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${req.session.access_token}`
    }
  });

  if (!response.ok) {
    const errorMessage = `Recommendation call failed with status: ${response.status}`;
    console.error(errorMessage);
    return res.status(response.status).send(errorMessage);
  }

  if (response.ok) {
    const rawData = await response.json();
    res.json(rawData);
  } else {
    const errorData = await response.json();
    console.error('Failed to fetch recommendations: ', errorData);
    res.status(response.status).send(errorData);
  }
};

export default fetchRecommendations;