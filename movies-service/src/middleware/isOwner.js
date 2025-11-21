import ApiError from '../utils/ApiError.js';
import Movie from '../models/Movie.js';

async function isOwner(req, res, next) {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      throw new ApiError(404, 'Movie not found');
    }

    if (!req.user || movie.owner.toString() !== req.user.id) {
      throw new ApiError(403, 'You are not allowed to modify this movie');
    }   
    req.movie = movie;
    return next();
  } catch (err) {
    return next(err);
  }
}

export default isOwner;
