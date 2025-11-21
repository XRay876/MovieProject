import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import config from '../config/env.js';


function authGuard(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next(new ApiError(401, 'Authorization header missing or invalid'));
  }

  const token = parts[1];

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
