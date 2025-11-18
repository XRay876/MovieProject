import User, { findOne, findById } from '../models/User';

async function findByEmail(email) {
  return findOne({ email });
}

async function findByUsername(username) {
  return findOne({ username });
}

async function findByEmailOrUsername(identifier) {
  return findOne({
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
  return findById(id);
}

export default {
  findByEmail,
  findByUsername,
  findByEmailOrUsername,
  createUser,
  getById
};
