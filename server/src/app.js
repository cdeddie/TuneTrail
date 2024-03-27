// TODO: Convert fetch requests to Axios

import express from 'express';
import session from 'express-session';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import { config } from './config/index.js';
import authRoutes from './routes/auth.js';
import spotifyRoutes from './routes/spotify.js';

const app = express();

app.use(express.json());

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production'}
}));

app.use(cors({
  origin: true,
  credentials: true, // To support session cookies
}));

app.use(cookieparser());

app.use('/auth', authRoutes);
app.use('/spotify', spotifyRoutes);

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});