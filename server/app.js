import express from 'express';
import crypto from 'crypto';
import session from 'express-session';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(session({
  secret: 'Secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // secure: false if no https
}));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // To support session cookies
}));

const clientId = '15cad36aafcc4cfeabac345a29046cd9';            // your clientId
const redirectUrl = 'http://localhost:3000/callback';  // your redirect URL - must be localhost URL and/or HTTPS
const clientSecret = '95acd96e2bad46dd96d32d33b825faa8';

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email user-read-playback-state user-read-currently-playing';

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Checking user activity to prevent infinite token refreshing
app.use((req, res, next) => {
  if (req.session) {
    req.session.lastActivity = new Date().toISOString();
  }
  next();
});

function scheduleTokenRefresh(req) {
  const now = new Date();

  const lastActivity = new Date(req.session.lastActivity);
  const activityThreshold = 30 * 60 * 1000;

  if (now - lastActivity > activityThreshold) {
    console.log('No recent activity. Skipping token refresh');
    return;
  }

  const expiryTime = new Date(req.session.token_expiry);
  const refreshAdvanceTime = 60000; // 1 minute in ms - refreshes 1 minute before expiry (59 minutes)
  const timeUntilRefresh = expiryTime.getTime() - now.getTime() - refreshAdvanceTime;

  if (timeUntilRefresh > 0) {
    setTimeout(async () => {
      try {
        await refreshToken(req);
        scheduleTokenRefresh(req);
      } catch (error) {
        console.error(error);
      }
    }, timeUntilRefresh);
  }
}

async function refreshToken(req) {
  const refreshToken = req.session.refresh_token;

  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const data = await response.json();

    if (response.ok) {
      req.session.access_token = data.access_token;

      if (data.refresh_token) {
        req.session.refresh_token = data.refresh_token;
      }

      const now = new Date();
      req.session.token_expiry = new Date(now.getTime() + data.expires_in * 1000).toISOString();

      console.log('Refreshing token');
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error(error);
    throw error; // handles the error in calling function
  }
};

// Generate random string for code verifier
const generateCodeVerifier = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate code challenge from code verifier
const generateCodeChallenge = (codeVerifier) => {
  return crypto.createHash('sha256').update(codeVerifier).digest().toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

};

// Redirecting to spotify auth
app.get('/login', (req, res) => {
  const codeVerifier = generateCodeVerifier();
  req.session.codeVerifier = codeVerifier; // stores code verifier in session
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  res.redirect(authUrl.toString());
});

async function getToken(req, code) {
  const code_verifier = req.session.codeVerifier;

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUrl,
    code_verifier: code_verifier,
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  return await response.json();
};

// Exchange code for access token
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (code) {
    try {
      const tokenResponse = await getToken(req, code);
      console.log(tokenResponse);

      // Save token response data to session
      req.session.access_token = tokenResponse.access_token;
      req.session.token_type = tokenResponse.token_type;
      req.session.expires_in = tokenResponse.expires_in;
      req.session.refresh_token = tokenResponse.refresh_token;
      req.session.scope = tokenResponse.scope;

      // Calculate and save the expiry time as an absolute timestamp
      const now = new Date();
      req.session.token_expiry = new Date(now.getTime() + tokenResponse.expires_in * 1000).toISOString();

      scheduleTokenRefresh(req);

      res.redirect('http://localhost:5173/');
    } catch (error) {
      console.error(error);
    }
  }
});

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

  if (response.ok) {
    const rawData = await response.json();

    const data = {
      track: rawData.item.name,
      artists: rawData.item.artists.map(artist => artist.name).join(', '),
      album: rawData.item.album.name,
      album_image_url: rawData.item.album.images[0]?.url,
      is_playing: rawData.is_playing,
      progress_ms: rawData.progress_ms,
      duration_ms: rawData.item.duration_ms, 
    }

    req.currentlyPlaying = data;
    next(); // Continue to next middleware function - Express allows async operations to complete BEFORE proceeding
  } else {
    const errorData = await response.json();
    console.error('Failed to fetch currently playing data', errorData);
    res.status(response.status).send(errorData);
  }
};

// --------
app.get('/currently-playing', fetchCurrentlyPlaying, (req, res) => {
  if (req.currentlyPlaying) {
    res.json(req.currentlyPlaying);
    console.log(req.session.token_expiry);
  } else {
    res.status(404).send('No track currently playing');
  }
});