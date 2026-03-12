import { Router } from 'express';
import * as ctrl from './students.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { createStudentSchema, updateStudentSchema } from './students.validation.js';

const router = Router();

router.get('/', auth, role('admin', 'teacher'), ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, role('admin'), validate(createStudentSchema), ctrl.create);
router.put('/:id', auth, role('admin'), validate(updateStudentSchema), ctrl.update);
router.delete('/:id', auth, role('admin'), ctrl.remove);

export default router;
