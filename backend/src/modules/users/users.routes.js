import { Router } from 'express';
import * as ctrl from './users.controller.js';
import * as certCtrl from '../certificates/certificates.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';

const router = Router();

// /api/admin/...
router.get('/pending-users', auth, role('admin'), ctrl.getPendingUsers);
router.get('/users', auth, role('admin'), ctrl.getAllUsers);
router.put('/users/:id/approve', auth, role('admin'), ctrl.approveUser);
router.put('/users/:id/reject', auth, role('admin'), ctrl.rejectUser);
router.get('/course-completions', auth, role('admin'), certCtrl.getCompletions);

export default router;
