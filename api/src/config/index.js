import dotenv from 'dotenv';;

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  stateKey: 'spotify_auth_state',
  scope: 'user-read-private user-read-email user-read-playback-state user-read-currently-playing user-top-read',
  sessionSecret: process.env.SESSION_SECRET,
};