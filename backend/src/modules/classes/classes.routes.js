import { Router } from 'express';
import * as ctrl from './classes.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { createClassSchema, updateClassSchema, updateStatusSchema } from './classes.validation.js';

const router = Router();

router.get('/teacher/my-classes', auth, role('teacher'), ctrl.getByTeacher);
router.get('/student/my-classes', auth, role('student'), ctrl.getByStudent);
router.get('/', auth, role('admin'), ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, role('admin'), validate(createClassSchema), ctrl.create);
router.put('/:id', auth, role('admin'), validate(updateClassSchema), ctrl.update);
router.put('/:id/status', auth, role('teacher', 'admin'), validate(updateStatusSchema), ctrl.updateStatus);
router.delete('/:id', auth, role('admin'), ctrl.remove);

export default router;
