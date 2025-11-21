import moviesClient from '../../api/movies.client.js';
import { getAllowedGenres } from '../../services/genre.service.js';
import ApiError from '../../utils/ApiError.js';

async function listMoviesPage(req, res, next) {
  try {
    const { page, limit, q, genre, year, sort } = req.query;

    const { data: movies, pagination } = await moviesClient.getList({
      page,
      limit,
      q,
      genre,
      year,
      sort
    });

    return res.render('movies/index', {
      movies,
      pagination,
      query: { q, genre, year, sort },
      genres: getAllowedGenres()
    });
  } catch (err) {
    return next(err);
  }
}

function showCreateForm(req, res) {
  return res.render('movies/new', {
    movie: {},
    errors: [],
    genres: getAllowedGenres()
  });
}

async function createMovieHandler(req, res, next) {
  try {
    if (!req.user) {
      throw new ApiError(401, 'You must be logged in to create a movie');
    }

    const { name, description, year, genres, rating } = req.body;
    // const accessToken = req.cookies && req.cookies.access_token;

    const { data: movie } = await moviesClient.createMovie(
      { name, description, year, genres, rating },
      req.accessToken
    );

    return res.redirect(`/movies/${movie._id}`);
  } catch (err) {
    const errors = (err.details || []).map(e => ({
      msg: e.message || e.msg || err.message,
      field: e.field || e.param
    }));

    return res
      .status(err.statusCode || 400)
      .render('movies/new', {
        movie: req.body,
        errors: errors.length ? errors : [{ msg: err.message }],
        genres: getAllowedGenres()
      });
  }
}

async function showMoviePage(req, res, next) {
  try {
    const { id } = req.params;

    const { data: movie } = await moviesClient.getOne(id);

    const isOwner = req.user && movie.owner && movie.owner.toString() === req.user.id;

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

    const { data: movie } = await moviesClient.getOne(id);

    // Optional double-check on frontend
    if (!req.user || movie.owner.toString() !== req.user.id) {
      throw new ApiError(403, 'You are not allowed to edit this movie');
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
    // const accessToken = req.cookies && req.cookies.access_token;

    const { data: updated } = await moviesClient.updateMovie(
      id,
      { name, description, year, genres, rating },
      req.accessToken
    );

    return res.redirect(`/movies/${updated._id}`);
  } catch (err) {
    const errors = (err.details || []).map(e => ({
      msg: e.message || e.msg || err.message,
      field: e.field || e.param
    }));

    return res
      .status(err.statusCode || 400)
      .render('movies/edit', {
        movie: { ...req.body, _id: req.params.id },
        errors: errors.length ? errors : [{ msg: err.message }],
        genres: getAllowedGenres()
      });
  }
}

async function deleteMovieHandler(req, res, next) {
  try {
    const { id } = req.params;
    // const accessToken = req.cookies && req.cookies.access_token;

    await moviesClient.deleteMovie(id, req.accessToken);
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
