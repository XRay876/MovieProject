import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest.js';
import authGuard from '../../middleware/authGuard.js';
import isOwner from '../../middleware/isOwner.js';
import {
  createMovieValidation,
  updateMovieValidation
} from '../../validation/movie.validation.js';
import {
  listMoviesPage,
  showCreateForm,
  createMovieHandler,
  showMoviePage,
  showEditForm,
  updateMovieHandler,
  deleteMovieHandler
} from '../../controllers/web/movies.controller.js';

const router = Router();

router.get('/movies', listMoviesPage);

router.get('/movies/new', authGuard, showCreateForm);

router.post(
  '/movies',
  authGuard,
  createMovieValidation,
  validateRequest,
  createMovieHandler
);

router.get('/movies/:id', showMoviePage);

router.get('/movies/:id/edit', authGuard, isOwner, showEditForm);

router.post(
  '/movies/:id',
  authGuard,
  isOwner,
  updateMovieValidation,
  validateRequest,
  updateMovieHandler
);

router.post('/movies/:id/delete', authGuard, isOwner, deleteMovieHandler);

export default router;
