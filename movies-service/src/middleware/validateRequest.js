import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map(err => ({
    field: err.param,
    message: err.msg
  }));

  return next(new ApiError(422, 'Validation error', formatted));
}

export default validateRequest;
