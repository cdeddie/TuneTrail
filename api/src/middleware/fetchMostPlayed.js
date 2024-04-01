// format of json object: {artists: {short_term: [], medium_term: [], long_term: []}, tracks: {short_term: [], medium_term: [], long_term: []}}
import fetch from 'node-fetch';

const fetchMostPlayed = async(req, res, next) => {
    const baseUrl = 'https://api.spotify.com/v1/me/top/';
    const types = ['artists', 'tracks'];
    const timeRanges = ['short_term', 'medium_term', 'long_term'];
    const limit = 50;
    const offset = 0;

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
            }).then(response => response.json())
          );
        });
      });

      const responses = await Promise.all(fetchPromises);

      const aggregatedData = { artists: {}, tracks: {} };

      // Sorts the responses despite the order the promises arrive in
      responses.forEach((response, index) => {
          const typeIndex = Math.floor(index / 3);
          const timeRangeIndex = index % 3;
          const dataType = types[typeIndex];
          const dataTimeRange = timeRanges[timeRangeIndex];
          aggregatedData[dataType][dataTimeRange] = response.items;
      });

      // removing available_markets from tracks
      Object.keys(aggregatedData.tracks).forEach(timeRange => {
        aggregatedData.tracks[timeRange].forEach(track => {
            delete track.available_markets;
            delete track.album.available_markets;
        });
      });

      req.aggregatedData = aggregatedData;
      next();
    } catch (error) {
      console.error('Error fetching user top data:', error);
      throw error;
    }
};

export default fetchMostPlayed;