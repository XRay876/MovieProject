import { body } from 'express-validator';

const usernameValidation = body('username')
  .trim()
  .notEmpty().withMessage('Username is required')
  .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters long')
  .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be alphanumeric (underscore allowed)');

const emailValidation = body('email')
  .normalizeEmail()
  .isEmail().withMessage('Valid email is required');

const passwordValidation = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  .matches(/[A-Za-z]/).withMessage('Password must contain at least one letter')
  .matches(/[0-9]/).withMessage('Password must contain at least one number');

const confirmPasswordValidation = body('confirmPassword')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  });

const registerValidation = [
  usernameValidation,
  emailValidation,
  passwordValidation,
  confirmPasswordValidation
];

const loginValidation = [
  body('emailOrUsername')
    .trim()
    .notEmpty().withMessage('Email or username is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
];

const logoutValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
];

const deleteAccountValidation = [
  body('password').notEmpty().withMessage('Password is required for confirmation')
];

export default {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  logoutValidation,
  updateProfileValidation: [usernameValidation],
  deleteAccountValidation
};
