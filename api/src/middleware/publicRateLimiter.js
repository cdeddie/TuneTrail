import rateLimit from 'express-rate-limit';

const shortLimiter = rateLimit({
  windowMs: 1000,
  limit: 5,
  legacyHeaders: false,
  standardHeaders: 'draft-7'
});

const longLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  legacyHeaders: false,
  standardHeaders: 'draft-7'
});

export { shortLimiter, longLimiter }