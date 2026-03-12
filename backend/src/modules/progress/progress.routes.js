import { Router } from 'express';
import * as ctrl from './progress.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { createProgressSchema, updateProgressSchema } from './progress.validation.js';

const router = Router();

router.get('/student/my-progress', auth, role('student'), ctrl.getMyProgress);
router.get('/', auth, role('admin', 'teacher'), ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, role('teacher'), validate(createProgressSchema), ctrl.create);
router.put('/:id', auth, role('teacher'), validate(updateProgressSchema), ctrl.update);
router.delete('/:id', auth, role('teacher'), ctrl.remove);

export default router;
