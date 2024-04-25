import express from 'express';
import axios from 'axios';
import querystring from 'querystring';
import crypto from 'crypto';
import { config } from '../config/index.js';

const { clientId, clientSecret, redirectUri, stateKey, scope } = config;

const router = express.Router();

const generateRandomString = (length) => {
  return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
};

router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const redirectUrl = 'https://accounts.spotify.com/authorize?' +
  querystring.stringify({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state
  });

  res.redirect(redirectUrl);
});

// Exchange code for access token, requests refresh and access tokens after checking state param
router.get('/callback', async (req, res, next) => {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    // redirect to home page ( adjust later )
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    try {
      const authResponse = await axios(authOptions);
      const access_token = authResponse.data.access_token;
      const refresh_token = authResponse.data.refresh_token;

      const userResponse = await axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token }
      });
      const spotify_id = userResponse.data.id;

      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;
      req.session.isLoggedIn = true;
      req.session.token_expiry = Date.now() + (authResponse.data.expires_in - 60) * 1000;
      req.session.spotify_id = spotify_id;

      const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : 'https://tunetrail.site';

      res.redirect(baseUrl);
    } catch (error) {
      console.error('Error during the authentication or data retrieval from Spotify:', error.message);
      res.redirect('/#' +
      querystring.stringify({
        error: 'invalid_token'
      }));
    }
  }
});

router.get('/refresh_token', function(req, res) {
  const refresh_token = req.session.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')) 
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token,
          refresh_token = body.refresh_token;

      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;
    }
  });
});

router.get('/status', (req, res) => {
  res.json({ isLoggedIn: !!req.session.isLoggedIn });
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during logout:', err.message);
      res.status(500).send('Error during logout');
    }
    res.status(200).send('Logged out');
    //res.redirect('localhost:5173/'); // PROD CHECK
  })
});

export default router;
