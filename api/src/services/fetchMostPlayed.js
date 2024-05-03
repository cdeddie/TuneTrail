import fetch from 'node-fetch';

const fetchMostPlayed = async (req) => {
  const baseUrl = 'https://api.spotify.com/v1/me/top/';
  const types = ['artists', 'tracks'];
  const timeRanges = ['short_term', 'medium_term', 'long_term'];
  const limit = 50;
  const offset = 0;

  // for each type -> for each timeRange (total of 6 iterations)
  try {
    const fetchPromises = [];
    types.forEach(type => {
      timeRanges.forEach(timeRange => {
        const url = `${baseUrl}${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`;
        fetchPromises.push(
          fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${req.session.access_token}`,
              'Content-Type': 'application/json'
            }
          }).then(response => response.json()).then(data => ({ type, timeRange, data}))
        );
      });
    });

    // Promise.all takes an array of promises. This basically just await for completion of all 
    // before performing logic on the data
    const responses = await Promise.all(fetchPromises);
    const aggregatedData = { artists: {}, tracks: {} };

    responses.forEach(({ type, timeRange, data }) => {
      aggregatedData[type][timeRange] = data.items;
    });

    return aggregatedData;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default fetchMostPlayed;