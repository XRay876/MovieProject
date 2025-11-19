import { Router } from 'express';
import authGuard from '../../middleware/authGuard.js';
import validateRequest from '../../middleware/validateRequest.js';
import isOwner from '../../middleware/isOwner.js';
import {
  createMovieValidation,
  updateMovieValidation
} from '../../validation/movie.validation.js';
import {
  listMovies,
  getMovie,
  createMovieApi,
  updateMovieApi,
  deleteMovieApi
} from '../../controllers/api/movies.api.controller.js';

const router = Router();

router.get('/', listMovies);
router.get('/:id', getMovie);

router.post(
  '/',
  authGuard,
  createMovieValidation,
  validateRequest,
  createMovieApi
);

router.put(
  '/:id',
  authGuard,
  isOwner,
  updateMovieValidation,
  validateRequest,
  updateMovieApi
);

router.delete(
  '/:id',
  authGuard,
  isOwner,
  deleteMovieApi
);

export default router;
