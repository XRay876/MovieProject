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
  port: process.env.PORT || 3000,

  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET')
  },

  services: {
    auth: {
      baseUrl: requireEnv('AUTH_SERVICE_URL'),
      timeout: parseInt(process.env.AUTH_SERVICE_TIMEOUT || '5000', 10)
    },
    movies: {
      baseUrl: requireEnv('MOVIES_SERVICE_URL'),
      timeout: parseInt(process.env.MOVIES_SERVICE_TIMEOUT || '5000', 10)
    }
  },

  cookies: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
};

export default config;
