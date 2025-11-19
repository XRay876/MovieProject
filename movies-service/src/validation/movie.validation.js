import { body } from 'express-validator';
import { getAllowedGenres } from '../services/genre.service.js';

const currentYear = new Date().getFullYear();

function genresValidator() {
  const allowedGenres = getAllowedGenres();
  return body('genres')
    .customSanitizer(value => {
      if (Array.isArray(value)) return value;
      if (!value) return [];
      return [value];
    })
    .custom((genres) => {
      if (!Array.isArray(genres)) {
        throw new Error('Genres must be an array');
      }
      if (genres.length < 1 || genres.length > 5) {
        throw new Error('Select between 1 and 5 genres');
      }
      for (const g of genres) {
        const trimmed = String(g).trim();
        if (!allowedGenres.includes(trimmed)) {
          throw new Error(`Invalid genre: ${trimmed}`);
        }
      }
      return true;
    });
}

const baseMovieValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters long'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters long'),
  body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 1800, max: currentYear }).withMessage(`Year must be between 1800 and ${currentYear}`),
  genresValidator(),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10')
];

const createMovieValidation = baseMovieValidation;

const updateMovieValidation = baseMovieValidation;

export {
  createMovieValidation,
  updateMovieValidation
};
