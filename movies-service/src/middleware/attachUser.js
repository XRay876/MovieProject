import jwt from 'jsonwebtoken';
import config from '../config/env.js';

function attachUser(req, res, next) {
  let token = null;

  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    token = parts[1];
  }

  if (!token) {
    res.locals.currentUser = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, config.jwt.accessSecret);
    const user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username
    };
    req.user = user;
    res.locals.currentUser = user;
  } catch {
    res.locals.currentUser = null;
  }

  return next();
}

export default attachUser;
