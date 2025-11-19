import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

function errorHandler(err, req, res, next) {
  logger.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
      errors: err.details || undefined
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      message: 'Database validation error',
      errors: err.errors
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 400,
      message: 'Invalid ID format'
    });
  }

  return res.status(500).json({
    status: 500,
    message: 'Internal server error'
  });
}

export default errorHandler;
