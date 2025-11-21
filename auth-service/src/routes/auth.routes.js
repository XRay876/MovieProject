import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import validateRequest from '../middleware/validateRequest.js';
import authGuard from '../middleware/authGuard.js';
import validations from '../validation/auth.validation.js';

const router = Router();

router.post(
  '/register',
  validations.registerValidation,
  validateRequest,
  authController.register
);

router.post(
  '/login',
  validations.loginValidation,
  validateRequest,
  authController.login
);

router.post(
  '/refresh',
  validations.refreshTokenValidation,
  validateRequest,
  authController.refresh
);

router.post(
  '/logout',
  validations.logoutValidation,
  validateRequest,
  authController.logout
);

// Logout from all devices
router.post(
  '/logout-all',
  authGuard,
  authController.logoutAll
);

router.get('/me', authGuard, authController.me);

router.put(
  '/profile',
  authGuard,
  validations.updateProfileValidation,
  validateRequest,
  authController.updateProfile
);

router.delete(
  '/profile',
  authGuard,
  validations.deleteAccountValidation,
  validateRequest,
  authController.deleteAccount
);

export default router;
