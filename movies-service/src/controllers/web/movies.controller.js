import ApiError from '../../utils/ApiError.js';
import { getAllowedGenres } from '../../services/genre.service.js';
import {
  createMovie,
  getMovieById,
  getMovies,
  updateMovie,
  deleteMovie
} from '../../services/movie.service.js';
import { buildPagination } from '../../utils/pagination.js';

async function listMoviesPage(req, res, next) {
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

    return res.render('movies/index', {
      movies: items,
      pagination,
      query: { q, genre, year, sort },
      genres: getAllowedGenres()
    });
  } catch (err) {
    return next(err);
  }
}

async function showCreateForm(req, res) {
  return res.render('movies/new', {
    movie: {},
    errors: [],
    genres: getAllowedGenres()
  });
}

async function createMovieHandler(req, res, next) {
  try {
    const { name, description, year, genres, rating } = req.body;

    if (!req.user) {
      throw new ApiError(401, 'You must be logged in to create a movie');
    }

    const movie = await createMovie({
      name,
      description,
      year,
      genres,
      rating,
      owner: req.user.id
    });

    return res.redirect(`/movies/${movie._id}`);
  } catch (err) {
    return next(err);
  }
}

async function showMoviePage(req, res, next) {
  try {
    const { id } = req.params;
    const movie = await getMovieById(id);
    if (!movie) {
      throw new ApiError(404, 'Movie not found');
    }

    const isOwner = req.user && movie.owner.toString() === req.user.id;

    return res.render('movies/show', {
      movie,
      isOwner
    });
  } catch (err) {
    return next(err);
  }
}

async function showEditForm(req, res, next) {
  try {
    const { id } = req.params;
    const movie = await getMovieById(id);
    if (!movie) {
      throw new ApiError(404, 'Movie not found');
    }

    return res.render('movies/edit', {
      movie,
      errors: [],
      genres: getAllowedGenres()
    });
  } catch (err) {
    return next(err);
  }
}

async function updateMovieHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, year, genres, rating } = req.body;

    const updated = await updateMovie(id, {
      name,
      description,
      year,
      genres,
      rating
    });

    if (!updated) {
      throw new ApiError(404, 'Movie not found');
    }

    return res.redirect(`/movies/${updated._id}`);
  } catch (err) {
    return next(err);
  }
}

async function deleteMovieHandler(req, res, next) {
  try {
    const { id } = req.params;
    await deleteMovie(id);
    return res.redirect('/movies');
  } catch (err) {
    return next(err);
  }
}

export {
  listMoviesPage,
  showCreateForm,
  createMovieHandler,
  showMoviePage,
  showEditForm,
  updateMovieHandler,
  deleteMovieHandler
};
