import { Router } from 'express';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';
import * as ctrl from './enrollments.controller.js';

const router = Router();

router.post('/request', auth, role('student'), ctrl.createRequest);
router.get('/my-requests', auth, role('student'), ctrl.getMyRequests);
router.get('/requests', auth, role('admin'), ctrl.getAllRequests);
router.put('/:id/approve', auth, role('admin'), ctrl.approve);
router.put('/:id/reject', auth, role('admin'), ctrl.reject);

export default router;
