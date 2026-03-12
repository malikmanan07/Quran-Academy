import { Router } from 'express';
import * as ctrl from './teachers.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { createTeacherSchema, updateTeacherSchema } from './teachers.validation.js';

const router = Router();

router.get('/', auth, role('admin'), ctrl.getAll);
router.get('/:id', auth, role('admin', 'teacher'), ctrl.getById);
router.post('/', auth, role('admin'), validate(createTeacherSchema), ctrl.create);
router.put('/:id', auth, role('admin'), validate(updateTeacherSchema), ctrl.update);
router.delete('/:id', auth, role('admin'), ctrl.remove);

export default router;
