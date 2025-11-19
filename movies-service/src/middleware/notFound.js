import ApiError from '../utils/ApiError.js';

function notFound(req, res, next) {
  const isApi = req.originalUrl.startsWith('/api');
  if (isApi) {
    return next(new ApiError(404, 'Route not found'));
  }
  return res.status(404).render('error', { status: 404, message: 'Page not found' });
}

export default notFound;