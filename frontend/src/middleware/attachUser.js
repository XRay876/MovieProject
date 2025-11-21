import config from '../config/env.js';
import authClient from '../api/auth.client.js';

const ACCESS_COOKIE = 'access_token';

async function attachUser(req, res, next) {
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
    res.locals.currentUser = null;
    return next();
  }

  try {
    const { user } = await authClient.getMe(token);
    req.user = user;
    res.locals.currentUser = user;
  } catch (error) {
    // If the token is invalid or expired, clear the cookie and treat as unauthenticated
    res.clearCookie(ACCESS_COOKIE);
    res.locals.currentUser = null;
  }

  return next();
}

export default attachUser;
