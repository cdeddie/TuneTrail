// TODO: Convert fetch requests to Axios

import express, { raw } from 'express';
import crypto from 'crypto';
import session from 'express-session';
import cookieparser from 'cookie-parser';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import querystring from 'querystring';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(session({
  secret: 'Secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production'}
}));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // To support session cookies
}));

app.use(cookieparser());

dotenv.config();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

const stateKey = 'spotify_auth_state';
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email user-read-playback-state user-read-currently-playing';

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const generateRandomString = (length) => {
  return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
}

// Redirecting to spotify auth
app.get('/login', (req, res) => {
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

  // console.log(redirectUrl);

  res.redirect(redirectUrl);
});

// Exchange code for access token, requests refresh and access tokens after checking state param
app.get('/callback', async (req, res) => {
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
      console.log(authResponse.data);
      const access_token = authResponse.data.access_token;
      const refresh_token = authResponse.data.refresh_token;

      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;
      req.session.isLoggedIn = true;
      req.session.token_expiry = Date.now() + (authResponse.data.expires_in - 60) * 1000;

      res.redirect('http://localhost:5173/');
    } catch (error) {
      console.error('Error during the authentication or data retrieval from Spotify:', error.message);
      res.redirect('/#' +
      querystring.stringify({
        error: 'invalid_token'
      }));
    }
  }
});

app.get('/refresh_token', function(req, res) {
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

app.get('/auth/status', (req, res) => {
  res.json({ isLoggedIn: !!req.session.isLoggedIn });
});

async function refreshTokenIfNeeded(req, res, next) {
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
}

// MY OWN SPOTIFY API WRAPPER

// Middleware function that interacts with this endpoint: https://api.spotify.com/v1/me/player
async function fetchCurrentlyPlaying(req, res, next) {
  if (!req.session.access_token) {
    return res.status(401).send('Access token is missing');
  }

  const url = 'https://api.spotify.com/v1/me/player';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${req.session.access_token}`
    }
  });

  if (!response.ok) {
    const errorMessage = `https://api.spotify.com/v1/me/player API call failed with status: ${response.status}`;
    console.error(errorMessage);
    return res.status(response.status).send(errorMessage);
  }

  if (response.status === 204) {
    console.log('No track currently playing');
    return res.status(response.status).send('No track currently playing');
  }

  if (response.ok) {
    const rawData = await response.json();

    const isLocal = rawData.item.is_local;

    if (isLocal) {
      const data = {
        track: rawData.item.name,
        artists: rawData.item.artists.map(artist => artist.name),
        album: rawData.item.album.name,
        album_image_url: rawData.item.album.images[0]?.url,
        progress_ms: rawData.progress_ms,
        duration_ms: rawData.item.duration_ms,
        is_local: rawData.item.is_local,
      };
      req.currentlyPlaying = data;
    } else {
      const albumData = await fetchAlbumTracks(rawData.item.album.id, req);

      const data = {
        track: rawData.item.name,
        artists: rawData.item.artists.map(artist => artist.name),
        album: rawData.item.album.name,
        album_id: rawData.item.album.id,
        album_image_url: rawData.item.album.images[0]?.url,
        album_release: rawData.item.album.release_date,
        album_url: rawData.item.album.external_urls.spotify,
        is_playing: rawData.is_playing,
        progress_ms: rawData.progress_ms,
        duration_ms: rawData.item.duration_ms, 
        is_local: rawData.item.is_local,

        tracks: albumData.items.map(track => ({
          artist_spotify_url: track.artists[0].external_urls.spotify,
          artists: track.artists.map(artist => artist.name),
          duration_ms: track.duration_ms,
          explicit: track.explicit,
          spotify_url: track.external_urls.spotify,
          name: track.name,
          preview_url: track.preview_url,
        }))
      };

      req.currentlyPlaying = data;
    }
    
    next(); // Continue to next middleware function - Express allows async operations to complete BEFORE proceeding
  } else {
    const errorData = await response.json();
    console.error('Failed to fetch currently playing data:', errorData);
    res.status(response.status).send(errorData);
  }
};

async function fetchAlbumTracks(album_id, req) {
  const url = `https://api.spotify.com/v1/albums/${album_id}/tracks`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${req.session.access_token}`
    }
  });

  if (!response.ok) {
    const errorMessage = `https://api.spotify.com/v1/albums/id/tracks API call failed with status: ${response.status}`;
    console.error(errorMessage);
    return null;
  }

  const albumData = await response.json();
  return albumData;

}

app.get('/currently-playing', refreshTokenIfNeeded, fetchCurrentlyPlaying,  (req, res) => {
  if (req.currentlyPlaying) {
    res.json(req.currentlyPlaying);
  } else {
    res.status(404).send('No track currently playing');
  }
});

// Middleware function that interacts with this endpoint: https://api.spotify.com/v1/me
async function fetchCurrentUser(req, res, next) {
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
    const errorMessage = `API call failed with status: ${response.status}`;
    console.error(errorMessage);
    return res.status(response.status).send(errorMessage);
  }

  if (response.ok) {
    const rawData = await response.json();

    const data = {
      display_name: rawData.display_name,
      external_url: rawData.external_urls,
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

app.get('/current-user', refreshTokenIfNeeded, fetchCurrentUser, (req, res) => {
  if (req.currentUser) {
    res.json(req.currentUser);
  } else {
    res.status(404).send('No current user');
  }
});