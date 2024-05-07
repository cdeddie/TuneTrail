import express from 'express';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import { config } from './config/index.js';
import authRoutes from './routes/auth.js';
import spotifyRoutes from './routes/spotify.js';
import { router as publicRoutes } from './routes/publicSpotify.js'

const app = express();

app.set('trust proxy', 1);
// temporary to check express-rate-limit proxy issue
app.get('/ip', (request, response) => response.send(request.ip));

app.use(express.json());

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production'}
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://tunetrail.site' : true,
  credentials: true,
}));

app.use(cookieparser());

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: (req, res) => {
    return req.app.locals.limit;
  },
  message: 'Too many requests, try again later'
});

app.use('/auth', authRoutes);
app.use('/spotify', spotifyRoutes);
app.use('/', apiLimiter, publicRoutes);

app.listen(config.port);
