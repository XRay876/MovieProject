import { Router } from 'express';
import { home } from '../../controllers/web/index.controller.js';

const router = Router();

router.get('/', home);

export default router;