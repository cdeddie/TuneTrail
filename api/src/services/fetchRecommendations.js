import fetch from 'node-fetch';

const fetchRecommendations = async (req) => {
  try {
    const { limit, tags: encodedTags, recTargets: encodedRecTargets, seedType } = req.query;
    const tags = JSON.parse(decodeURIComponent(encodedTags));
    const recommendationTargets = JSON.parse(decodeURIComponent(encodedRecTargets));
    const seedKey = seedType === 'artist' ? 'seed_artists' : 'seed_tracks';

    let queryParams = new URLSearchParams({
      limit: limit,
      [seedKey]: tags.join(','),
    });

    // recommendation targets eg instrumentalness, danceability
    Object.keys(recommendationTargets).forEach(key => {
      if (recommendationTargets[key] > 0) {
        queryParams.append(`target_${key}`, recommendationTargets[key]);
      }
    });

    // example url: https://api.spotify.com/v1/recommendations?limit=25&seed_artists=5K4W6rqBFWDnAN6FQUkS6x&target_energy=40 - %2C represents ,
    const url = `https://api.spotify.com/v1/recommendations?${queryParams}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${req.session.access_token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Fetch recommendations [Spotify API] failed with status: ${response.status}`);
    }

    const rawData = await response.json();
    return rawData;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export default fetchRecommendations;