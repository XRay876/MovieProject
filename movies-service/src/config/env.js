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
  },
  authService: {
    baseUrl: requireEnv('AUTH_SERVICE_URL'),
    timeout: parseInt(process.env.AUTH_SERVICE_TIMEOUT || '5000', 10)
  },

  cookies: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
};

export default config;
