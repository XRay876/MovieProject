import config from '../config/env.js';

const BASE_URL = config.services.movies.baseUrl;
const TIMEOUT = config.services.movies.timeout;

async function callMoviesService(path, { method = 'GET', body, headers = {} } = {}) {
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
      const error = new Error(data.message || 'Movies service error');
      error.statusCode = res.status;
      error.details = data.errors;
      throw error;
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

function getList({ page, limit, q, genre, year, sort }) {
  const params = new URLSearchParams();
  if (page) params.set('page', page);
  if (limit) params.set('limit', limit);
  if (q) params.set('q', q);
  if (genre) params.set('genre', genre);
  if (year) params.set('year', year);
  if (sort) params.set('sort', sort);

  const query = params.toString() ? `?${params.toString()}` : '';
  return callMoviesService(`/api/movies${query}`);
}

function getOne(id) {
  return callMoviesService(`/api/movies/${id}`);
}

function createMovie(payload, accessToken) {
  return callMoviesService('/api/movies', {
    method: 'POST',
    body: payload,
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {}
  });
}

function updateMovie(id, payload, accessToken) {
  return callMoviesService(`/api/movies/${id}`, {
    method: 'PUT',
    body: payload,
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {}
  });
}

function deleteMovie(id, accessToken) {
  return callMoviesService(`/api/movies/${id}`, {
    method: 'DELETE',
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {}
  });
}

export default {
  getList,
  getOne,
  createMovie,
  updateMovie,
  deleteMovie
};
