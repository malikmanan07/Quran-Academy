import { Router } from 'express';
import * as ctrl from './payments.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { createPaymentSchema, updateStatusSchema } from './payments.validation.js';

const router = Router();

router.get('/student/my-payments', auth, role('student'), ctrl.getMyPayments);
router.get('/', auth, role('admin'), ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, role('admin'), validate(createPaymentSchema), ctrl.create);
router.put('/:id/status', auth, role('admin'), validate(updateStatusSchema), ctrl.updateStatus);

export default router;
