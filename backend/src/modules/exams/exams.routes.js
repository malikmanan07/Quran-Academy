import { Router } from 'express';
import * as ctrl from './exams.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { createExamSchema, updateExamSchema } from './exams.validation.js';

const router = Router();

router.get('/student/my-exams', auth, role('student'), ctrl.getMyExams);
router.get('/', auth, role('admin', 'teacher'), ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, role('teacher'), validate(createExamSchema), ctrl.create);
router.put('/:id', auth, role('teacher'), validate(updateExamSchema), ctrl.update);
router.delete('/:id', auth, role('teacher'), ctrl.remove);

export default router;
