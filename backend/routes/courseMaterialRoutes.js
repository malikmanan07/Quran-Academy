import express from 'express';
import {
  getAllMaterials,
  addMaterial,
  deleteMaterial
} from '../controllers/courseMaterialController.js';
import auth from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getAllMaterials);
router.post('/', auth, authorizeRoles('admin', 'teacher'), addMaterial);
router.delete('/:id', auth, authorizeRoles('admin', 'teacher'), deleteMaterial);

export default router;