import fetch from 'node-fetch';
import config from '../config/env.js';

const BASE_URL = config.authService.baseUrl;
const TIMEOUT = config.authService.timeout;

async function callAuthService(path, { method = 'POST', body, headers = {} } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || 'Auth service error');
      error.statusCode = res.status;
      error.details = data.errors;
      throw error;
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function register({ username, email, password, confirmPassword, userAgent, ip }) {
  return callAuthService('/api/auth/register', {
    method: 'POST',
    body: { username, email, password, confirmPassword },
    headers: {
      'User-Agent': userAgent || 'movies-service',
      'X-Forwarded-For': ip || ''
    }
  });
}

async function login({ emailOrUsername, password, userAgent, ip }) {
  return callAuthService('/api/auth/login', {
    method: 'POST',
    body: { emailOrUsername, password },
    headers: {
      'User-Agent': userAgent || 'movies-service',
      'X-Forwarded-For': ip || ''
    }
  });
}

async function refresh({ refreshToken, userAgent, ip }) {
  return callAuthService('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    headers: {
      'User-Agent': userAgent || 'movies-service',
      'X-Forwarded-For': ip || ''
    }
  });
}

async function logout({ refreshToken }) {
  return callAuthService('/api/auth/logout', {
    method: 'POST',
    body: { refreshToken }
  });
}

export default {
  register,
  login,
  refresh,
  logout
};
