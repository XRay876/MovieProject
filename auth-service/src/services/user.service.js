import User from '../models/User.js';

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

export default {
  findByEmail,
  findByUsername,
  findByEmailOrUsername,
  createUser,
  getById
};
