import express from 'express';
import { getProgressByStudent, addProgress, updateProgress, deleteProgress } from '../controllers/progressController.js';
import auth from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/student/:id', auth, getProgressByStudent);
router.post('/', auth, authorizeRoles('admin', 'teacher'), addProgress);
router.put('/:id', auth, authorizeRoles('admin', 'teacher'), updateProgress);
router.delete('/:id', auth, authorizeRoles('admin', 'teacher'), deleteProgress);

export default router;