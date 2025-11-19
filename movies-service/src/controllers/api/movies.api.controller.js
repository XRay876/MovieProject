import ApiError from '../../utils/ApiError.js';
import {
  createMovie,
  getMovieById,
  getMovies,
  updateMovie,
  deleteMovie
} from '../../services/movie.service.js';
import { buildPagination } from '../../utils/pagination.js';

async function listMovies(req, res, next) {
  try {
    const { page, limit, q, genre, year, sort } = req.query;
    const { items, total, page: p, limit: l } = await getMovies({
      page,
      limit,
      q,
      genre,
      year,
      sort
    });

    const pagination = buildPagination({ page: p, limit: l, total });

    return res.json({
      data: items,
      pagination
    });
  } catch (err) {
    return next(err);
  }
}

async function getMovie(req, res, next) {
  try {
    const { id } = req.params;
    const movie = await getMovieById(id);
    if (!movie) {
      throw new ApiError(404, 'Movie not found');
    }
    return res.json({ data: movie });
  } catch (err) {
    return next(err);
  }
}

async function createMovieApi(req, res, next) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }
    const { name, description, year, genres, rating } = req.body;
    const movie = await createMovie({
      name,
      description,
      year,
      genres,
      rating,
      owner: req.user.id
    });
    return res.status(201).json({ data: movie });
  } catch (err) {
    return next(err);
  }
}

async function updateMovieApi(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, year, genres, rating } = req.body;
    const movie = await updateMovie(id, {
      name,
      description,
      year,
      genres,
      rating
    });
    if (!movie) {
      throw new ApiError(404, 'Movie not found');
    }
    return res.json({ data: movie });
  } catch (err) {
    return next(err);
  }
}

async function deleteMovieApi(req, res, next) {
  try {
    const { id } = req.params;
    await deleteMovie(id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export {
  listMovies,
  getMovie,
  createMovieApi,
  updateMovieApi,
  deleteMovieApi
};
