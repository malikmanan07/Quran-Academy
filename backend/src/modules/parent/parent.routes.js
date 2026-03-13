import { Router } from 'express';
import * as ctrl from './parent.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';

const router = Router();

// Parent routes
router.get('/my-children', auth, role('parent'), ctrl.getMyChildren);
router.get('/child/:id/progress', auth, role('parent'), ctrl.getChildProgress);
router.get('/child/:id/attendance', auth, role('parent'), ctrl.getChildAttendance);
router.get('/child/:id/payments', auth, role('parent'), ctrl.getChildPayments);
router.get('/child/:id/classes', auth, role('parent'), ctrl.getChildClasses);

// Admin routes for parent management
router.post('/link-parent', auth, role('admin'), ctrl.linkParent);
router.get('/all-parents', auth, role('admin'), ctrl.getAllParents);

export default router;
