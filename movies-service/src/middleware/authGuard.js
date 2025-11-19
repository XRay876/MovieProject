import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import config from '../config/env.js';
import authClient from '../api/auth.client.js';

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

async function authGuard(req, res, next) {
  let token = null;

  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    token = parts[1];
  }

  if (!token && req.cookies && req.cookies[ACCESS_COOKIE]) {
    token = req.cookies[ACCESS_COOKIE];
  }

  if (!token) {
    return next(new ApiError(401, 'Authorization required'));
  }

  try {
    const payload = jwt.verify(token, config.jwt.accessSecret);
    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username
    };
    return next();
  } catch (err) {
    if (err.name !== 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid access token'));
    }
  }

  const refreshToken = req.cookies && req.cookies[REFRESH_COOKIE];

  if (!refreshToken) {
    return next(new ApiError(401, 'Your session expired'));
  }

  try {
    const userAgent = req.get('User-Agent');
    const ip = req.ip;

    const data = await authClient.refresh({
      refreshToken,
      userAgent,
      ip
    });

    const cookieOpts = {
      httpOnly: true,
      secure: req.app.get('env') === 'production',
      sameSite: 'lax',
      path: '/'
    };

    res.cookie(ACCESS_COOKIE, data.tokens.accessToken, cookieOpts);
    res.cookie(REFRESH_COOKIE, data.tokens.refreshToken, cookieOpts);

    req.user = data.user;

    return next();
  } catch (err) {
    const cookieOpts = {
      httpOnly: true,
      secure: req.app.get('env') === 'production',
      sameSite: 'lax',
      path: '/'
    };

    res.clearCookie(ACCESS_COOKIE, cookieOpts);
    res.clearCookie(REFRESH_COOKIE, cookieOpts);

    return next(new ApiError(401, 'Session expired. Please log in again.'));
  }
}

export default authGuard;
