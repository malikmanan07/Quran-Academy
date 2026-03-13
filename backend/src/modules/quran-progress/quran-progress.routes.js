import { Router } from 'express';
import * as ctrl from './quran-progress.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';

const router = Router();

router.get('/my-progress', auth, role('student'), ctrl.getMyProgress);
router.get('/:studentId', auth, role('admin', 'teacher', 'student'), ctrl.getByStudentId);
router.put('/:studentId/para/:paraNumber', auth, role('teacher'), ctrl.updatePara);

export default router;
