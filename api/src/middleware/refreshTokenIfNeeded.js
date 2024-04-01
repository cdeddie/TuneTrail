import axios from 'axios';
import querystring from 'querystring';
import { config } from '../config/index.js';

const { clientId, clientSecret } = config;

const refreshTokenIfNeeded = async(req, res, next) => {
  console.log(`Token expiry: ${new Date(req.session.token_expiry).toLocaleString()}`);
  console.log(`Current time: ${new Date(Date.now()).toLocaleString()}`);
  if (req.session.token_expiry && Date.now() > req.session.token_expiry) {
    console.log('Refreshing access token...');
    try {
      const refreshResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: req.session.refresh_token
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        }
      });
      req.session.access_token = refreshResponse.data.access_token;
      // update the refresh token if Spotify returns a new one
      if (refreshResponse.data.refresh_token) {
        req.session.refresh_token = refreshResponse.data.refresh_token;
      }
      // update token expiry time
      req.session.token_expiry = Date.now() + (refreshResponse.data.expires_in - 60) * 1000;
      next();
    } catch (error) {
      console.error('Error refreshing access token:', error.message);
      return res.status(500).send('Failed to refresh access token');
    }
  } else {
    // token is still valid, or there's no token
    console.log('Token still valid');
    next();
  }
};

export default refreshTokenIfNeeded;