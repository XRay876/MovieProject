import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

function errorHandler(err, req, res, next) { 
  logger.error(err);

  const isApi = req.originalUrl.startsWith('/api');

  if (err instanceof ApiError) {
    if (isApi) {
      return res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
        errors: err.details || undefined
      });
    }
    return res
      .status(err.statusCode)
      .render('error', { status: err.statusCode, message: err.message, errors: err.details });
  }

  if (err.name === 'ValidationError') {
    if (isApi) {
      return res.status(400).json({
        status: 400,
        message: 'Database validation error',
        errors: err.errors
      });
    }
    return res
      .status(400)
      .render('error', { status: 400, message: 'Database validation error', errors: err.errors });
  }

  if (err.name === 'CastError') {
    if (isApi) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid ID format'
      });
    }
    return res
      .status(400)
      .render('error', { status: 400, message: 'Invalid ID format' });
  }

  if (isApi) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }

  return res
    .status(500)
    .render('error', { status: 500, message: 'Internal server error' });
}

export default errorHandler;
