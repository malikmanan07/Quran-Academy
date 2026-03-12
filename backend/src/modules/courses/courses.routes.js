import { Router } from 'express';
import * as ctrl from './courses.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { createCourseSchema, updateCourseSchema } from './courses.validation.js';

const router = Router();

router.get('/', auth, ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, role('admin'), validate(createCourseSchema), ctrl.create);
router.put('/:id', auth, role('admin'), validate(updateCourseSchema), ctrl.update);
router.delete('/:id', auth, role('admin'), ctrl.remove);

export default router;
