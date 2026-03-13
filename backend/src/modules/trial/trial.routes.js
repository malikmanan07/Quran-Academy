import { Router } from 'express';
import * as ctrl from './trial.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';

const router = Router();

router.post('/book', ctrl.book); // Public — no auth
router.get('/requests', auth, role('admin'), ctrl.getAll);
router.put('/:id/status', auth, role('admin'), ctrl.updateStatus);
router.put('/:id/convert', auth, role('admin'), ctrl.convert);

export default router;
