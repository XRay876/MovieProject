import { config as _config } from 'dotenv';

_config();

function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return process.env[name];
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,

  mongoUri: requireEnv('MONGODB_URI'),

  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  }
};

export default config;
