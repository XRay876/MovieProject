import User from '../models/User.js';
import { compare } from 'bcryptjs'; // Added import for compare
import ApiError from '../utils/ApiError.js'; // Added import for ApiError
import tokenService from './token.service.js'; // Added import for tokenService

async function findByEmail(email) {
  return User.findOne({ email });
}

async function findByUsername(username) {
  return User.findOne({ username });
}

async function findByEmailOrUsername(identifier) {
  return User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier }]
  });
}

async function createUser({ username, email, passwordHash }) {
  const user = new User({
    username,
    email: email.toLowerCase(),
    passwordHash
  });
  return user.save();
}

async function getById(id) {
  return User.findById(id);
}

async function update(userId, updates) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (updates.username && updates.username !== user.username) {
    const existingUserWithUsername = await findByUsername(updates.username);
    if (existingUserWithUsername && !existingUserWithUsername._id.equals(userId)) {
      throw new ApiError(409, 'Username is already in use');
    }
  }

  Object.assign(user, updates);
  await user.save();
  return user;
}

async function _delete(userId, password) { // Renamed to _delete to avoid conflict with keyword
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatch = await compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid password');
  }

  await tokenService.revokeAllTokensForUser(userId);
  await user.deleteOne(); // Use deleteOne for Mongoose documents
}

export default {
  findByEmail,
  findByUsername,
  findByEmailOrUsername,
  createUser,
  getById,
  update,
  delete: _delete // Export as delete
};
