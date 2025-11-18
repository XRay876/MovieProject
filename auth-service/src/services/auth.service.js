import { genSalt, hash, compare } from 'bcryptjs';
import ApiError from '../utils/ApiError';
import { bcrypt as _bcrypt } from '../config/env';
import { findByEmail, findByUsername, createUser, findByEmailOrUsername, getById } from './user.service';
import { generateAccessToken, generateRefreshToken, saveTokens, verifyRefreshToken, findActiveToken, revokeToken, revokeAllTokensForUser } from './token.service';

async function register({ username, email, password, userAgent, ip }) {
  const existingByEmail = await findByEmail(email);
  if (existingByEmail) {
    throw new ApiError(409, 'Email is already in use');
  }

  const existingByUsername = await findByUsername(username);
  if (existingByUsername) {
    throw new ApiError(409, 'Username is already in use');
  }

  const salt = await genSalt(_bcrypt.saltRounds);
  const passwordHash = await hash(password, salt);

  const user = await createUser({ username, email, passwordHash });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await saveTokens({
    userId: user._id,
    accessToken,
    refreshToken,
    userAgent,
    ip
  });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    },
    tokens: {
      accessToken,
      refreshToken
    }
  };
}

async function login({ emailOrUsername, password, userAgent, ip }) {
  const user = await findByEmailOrUsername(emailOrUsername);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await saveTokens({
    userId: user._id,
    accessToken,
    refreshToken,
    userAgent,
    ip
  });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    },
    tokens: {
      accessToken,
      refreshToken
    }
  };
}

async function refresh({ refreshToken, userAgent, ip }) {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const tokenDoc = await findActiveToken(refreshToken);
  if (!tokenDoc) {
    throw new ApiError(401, 'Refresh token not found or revoked');
  }

  const user = tokenDoc.user;
  if (!user) {
    throw new ApiError(401, 'User not found for this token');
  }

  await revokeToken(refreshToken);

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  await saveTokens({
    userId: user._id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    userAgent,
    ip
  });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    },
    tokens: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  };
}

async function logout({ refreshToken }) {
  await revokeToken(refreshToken);
}

async function logoutAll({ userId }) {
  await revokeAllTokensForUser(userId);
}

async function getMe(userId) {
  const user = await getById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  };
}

export default {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  getMe
};
