import pkg from 'jsonwebtoken';
import config from '../config/env.js';
import Token from '../models/Token.js';
import ApiError from '../utils/ApiError.js';

const { jwt: _jwt } = config;
const { sign, verify } = pkg;

function generateAccessToken(user) {
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    username: user.username
  };

  const token = sign(payload, _jwt.accessSecret, {
    expiresIn: _jwt.accessExpiresIn
  });

  return token;
}

function generateRefreshToken(user) {
  const payload = {
    sub: user._id.toString()
  };

  const token = sign(payload, _jwt.refreshSecret, {
    expiresIn: _jwt.refreshExpiresIn
  });

  return token;
}

function verifyAccessToken(token) {
  try {
    return verify(token, _jwt.accessSecret);
  } catch (err) {
    return null;
  }
}

function verifyRefreshToken(token) {
  try {
    return verify(token, _jwt.refreshSecret);
  } catch (err) {
    return null;
  }
}

async function saveTokens({ userId, accessToken, refreshToken, userAgent, ip }) {
  const decodedRefresh = verifyRefreshToken(refreshToken);

  if (!decodedRefresh) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const expiresAt = new Date(decodedRefresh.exp * 1000);

  const tokenDoc = new Token({
    user: userId,
    accessToken,
    refreshToken,
    userAgent,
    ip,
    expiresAt
  });

  return tokenDoc.save();
}

async function findActiveToken(refreshToken) {
  return Token.findOne({
    refreshToken,
    isRevoked: false
  }).populate('user');
}

async function revokeToken(refreshToken) {
  const doc = await Token.findOne({ refreshToken });
  if (!doc) return;
  doc.isRevoked = true;
  await doc.save();
}

async function revokeAllTokensForUser(userId) {
  await Token.updateMany(
    { user: userId, isRevoked: false },
    { $set: { isRevoked: true } }
  );
}

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  saveTokens,
  findActiveToken,
  revokeToken,
  revokeAllTokensForUser
};
