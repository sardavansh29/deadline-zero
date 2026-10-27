import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import AppError from '../utils/AppError.js';

const cookieOptions = () => ({ httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' });
const csrfOptions = () => ({ httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' });

export function establishSession(res, user) {
  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('dz_session', token, cookieOptions());
  res.cookie('dz_csrf', crypto.randomBytes(32).toString('hex'), csrfOptions());
}

export function clearSession(res) {
  res.clearCookie('dz_session', { ...cookieOptions(), maxAge: undefined });
  res.clearCookie('dz_csrf', { ...csrfOptions(), maxAge: undefined });
}

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies.dz_session;
    if (!token) throw new Error('Missing session');
    req.userId = jwt.verify(token, process.env.JWT_SECRET).sub;
    next();
  } catch { next(new AppError('Your session has expired. Please sign in again.', 401)); }
}

export function requireCsrf(req, res, next) {
  const header = req.get('X-CSRF-Token');
  const cookieToken = req.cookies.dz_csrf;
  if (!header || !cookieToken || header.length !== cookieToken.length || !crypto.timingSafeEqual(Buffer.from(header), Buffer.from(cookieToken))) return next(new AppError('Invalid request token. Refresh and try again.', 403));
  next();
}
