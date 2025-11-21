import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest.js';
import authGuard from '../../middleware/authGuard.js';
import {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  deleteAccountValidation // Added deleteAccountValidation import
} from '../../validation/auth.validation.js';
import {
  showLoginForm,
  showRegisterForm,
  register,
  login,
  logout,
  refresh,
  showProfile,
  updateProfile,
  showEditProfileForm,
  showDeleteAccountForm, // Added showDeleteAccountForm import
  deleteAccount // Added deleteAccount import
} from '../../controllers/web/auth.controller.js';

const router = Router();

router.get('/auth/login', showLoginForm);

router.get('/auth/register', showRegisterForm);

router.post(
  '/auth/register',
  registerValidation,
  validateRequest,
  register
);

router.post(
  '/auth/login',
  loginValidation,
  validateRequest,
  login
);

router.post('/auth/logout', logout);

router.post('/auth/refresh', refresh);

router.get('/profile', authGuard, showProfile); // Existing profile GET route

router.get('/profile/edit', authGuard, showEditProfileForm); // New profile edit GET route

router.post( // Profile update POST route (changed from /profile/update)
  '/profile/edit',
  authGuard,
  profileUpdateValidation,
  validateRequest,
  updateProfile
);

router.get('/profile/delete', authGuard, showDeleteAccountForm); // New profile delete GET route

router.post( // Profile delete POST route
  '/profile/delete',
  authGuard,
  deleteAccountValidation,
  validateRequest,
  deleteAccount
);

export default router;

