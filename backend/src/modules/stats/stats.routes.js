import { Router } from 'express';
import { getAdminStats } from './stats.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';

const router = Router();

router.get('/admin', auth, role('admin'), getAdminStats);

export default router;
