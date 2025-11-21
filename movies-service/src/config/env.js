import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return process.env[name];
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,

  mongoUri: requireEnv('MONGODB_URI'),

  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET')
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  }

};

export default config;
