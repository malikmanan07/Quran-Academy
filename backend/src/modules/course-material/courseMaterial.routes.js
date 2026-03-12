import { Router } from 'express';
import * as ctrl from './courseMaterial.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';
import validate from '../../middlewares/validateRequest.js';
import { createMaterialSchema, updateMaterialSchema } from './courseMaterial.validation.js';

const router = Router();

router.get('/student/my-materials', auth, role('student'), ctrl.getMyMaterials);
router.get('/', auth, role('admin', 'teacher'), ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, role('teacher'), validate(createMaterialSchema), ctrl.create);
router.put('/:id', auth, role('teacher'), validate(updateMaterialSchema), ctrl.update);
router.delete('/:id', auth, role('teacher'), ctrl.remove);

export default router;
