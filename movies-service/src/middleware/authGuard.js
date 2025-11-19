import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import config from '../config/env.js';

const ACCESS_COOKIE = 'access_token';

function authGuard(req, res, next) {
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
  } catch {
    return next(new ApiError(401, 'Invalid or expired access token'));
  }
}

export default authGuard;
