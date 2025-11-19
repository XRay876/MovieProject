import { Router } from 'express';
import validateRequest from '../middleware/validateRequest.js';
import {
  registerValidation,
  loginValidation
} from '../validation/auth.validation.js';
import {
  showLoginForm,
  showRegisterForm,
  register,
  login,
  logout,
  refresh
} from '../controllers/auth.controller.js';

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

export default router;
