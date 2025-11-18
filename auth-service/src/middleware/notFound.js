import ApiError from '../utils/ApiError';

function notFound(req, res, next) {
  next(new ApiError(404, 'Route not found'));
}

export default notFound;
