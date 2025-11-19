import { genSalt, hash, compare } from 'bcryptjs';
import ApiError from '../utils/ApiError.js';
import config from '../config/env.js';
import userService from './user.service.js';
import tokenService from './token.service.js';

const { bcrypt: _bcrypt } = config;

async function register({ username, email, password, userAgent, ip }) {
  const existingByEmail = await userService.findByEmail(email);
  if (existingByEmail) {
    throw new ApiError(409, 'Email is already in use');
  }

  const existingByUsername = await userService.findByUsername(username);
  if (existingByUsername) {
    throw new ApiError(409, 'Username is already in use');
  }

  const salt = await genSalt(_bcrypt.saltRounds);
  const passwordHash = await hash(password, salt);

  const user = await userService.createUser({ username, email, passwordHash });

  const accessToken = tokenService.generateAccessToken(user);
  const refreshToken = tokenService.generateRefreshToken(user);

  await tokenService.saveTokens({
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
  const user = await userService.findByEmailOrUsername(emailOrUsername);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = tokenService.generateAccessToken(user);
  const refreshToken = tokenService.generateRefreshToken(user);

  await tokenService.saveTokens({
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
  const decoded = tokenService.verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const tokenDoc = await tokenService.findActiveToken(refreshToken);
  if (!tokenDoc) {
    throw new ApiError(401, 'Refresh token not found or revoked');
  }

  const user = tokenDoc.user;
  if (!user) {
    throw new ApiError(401, 'User not found for this token');
  }

  await tokenService.revokeToken(refreshToken);

  const newAccessToken = tokenService.generateAccessToken(user);
  const newRefreshToken = tokenService.generateRefreshToken(user);

  await tokenService.saveTokens({
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
  await tokenService.revokeToken(refreshToken);
}

async function logoutAll({ userId }) {
  await tokenService.revokeAllTokensForUser(userId);
}

async function getMe(userId) {
  const user = await userService.getById(userId);
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
