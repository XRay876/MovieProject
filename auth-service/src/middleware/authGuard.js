import ApiError from '../utils/ApiError.js';
import tokenService from '../services/token.service.js';

async function authGuard(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new ApiError(401, 'Authorization header missing or invalid');
    }

    const accessToken = parts[1];

    const payload = tokenService.verifyAccessToken(accessToken);
    if (!payload) {
      throw new ApiError(401, 'Invalid or expired access token');
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username
    };

    return next();
  } catch (err) {
    return next(
      err instanceof ApiError ? err : new ApiError(401, 'Unauthorized')
    );
  }
}

export default authGuard;
