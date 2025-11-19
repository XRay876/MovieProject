import Movie from '../models/Movie.js';

function buildFilters({ q, genre, year }) {
  const filters = {};
  if (q) {
    filters.$text = { $search: q };
  }
  if (genre) {
    filters.genres = genre;
  }
  if (year) {
    const y = parseInt(year, 10);
    if (!Number.isNaN(y)) {
      filters.year = y;
    }
  }
  return filters;
}

async function createMovie({ name, description, year, genres, rating, owner }) {
  const movie = new Movie({
    name,
    description,
    year,
    genres,
    rating,
    owner
  });
  return movie.save();
}

async function getMovieById(id) {
  return Movie.findById(id);
}

async function getMovies({ page = 1, limit = 10, q, genre, year, sort }) {
  const filters = buildFilters({ q, genre, year });

  const pageInt = parseInt(page, 10) || 1;
  const limitInt = parseInt(limit, 10) || 10;

  const skip = (pageInt - 1) * limitInt;

  const sortOption = (() => {
    switch (sort) {
      case 'year_asc':
        return { year: 1 };
      case 'year_desc':
        return { year: -1 };
      case 'rating_desc':
        return { rating: -1 };
      case 'rating_asc':
        return { rating: 1 };
      case 'created_desc':
        return { createdAt: -1 };
      case 'created_asc':
        return { createdAt: 1 };
      default:
        return { createdAt: -1 };
    }
  })();

  const [items, total] = await Promise.all([
    Movie.find(filters)
      .sort(sortOption)
      .skip(skip)
      .limit(limitInt),
    Movie.countDocuments(filters)
  ]);

  return { items, total, page: pageInt, limit: limitInt };
}

async function updateMovie(id, updates) {
  return Movie.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

async function deleteMovie(id) {
  return Movie.findByIdAndDelete(id);
}

export {
  createMovie,
  getMovieById,
  getMovies,
  updateMovie,
  deleteMovie
};
