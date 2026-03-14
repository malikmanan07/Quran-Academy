import { Router } from 'express';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';
import * as ctrl from './attendance.controller.js';

const router = Router();

router.post('/mark', auth, role('teacher'), ctrl.mark);
router.get('/my-attendance', auth, role('student'), ctrl.getMyAttendance);
router.get('/student/:id', auth, role('teacher', 'admin', 'parent'), ctrl.getByStudent);
router.get('/class/:id', auth, role('teacher'), ctrl.getByClass);
router.get('/stats/:studentId', auth, ctrl.getStats);

export default router;
