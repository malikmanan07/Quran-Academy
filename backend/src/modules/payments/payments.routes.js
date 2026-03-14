import { Router } from 'express';
import * as ctrl from './payments.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { createPaymentSchema, updateStatusSchema } from './payments.validation.js';

const router = Router();

router.get('/student/my-payments', auth, role('student'), ctrl.getMyPayments);
router.post('/student/submit', auth, role('student'), ctrl.studentSubmit);
router.post('/parent/submit', auth, role('parent'), ctrl.parentSubmit);
router.get('/pending-verification', auth, role('admin'), ctrl.getPendingVerification);

router.get('/', auth, role('admin'), ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, role('admin'), validate(createPaymentSchema), ctrl.create);
router.put('/:id/status', auth, role('admin'), validate(updateStatusSchema), ctrl.updateStatus);
router.put('/:id/verify', auth, role('admin'), ctrl.verify);
router.put('/:id/reject', auth, role('admin'), ctrl.reject);

export default router;
