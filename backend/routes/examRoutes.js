import express from 'express';
import { getExamsByStudent, addExam, updateExam, deleteExam } from '../controllers/examController.js';
import auth from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/student/:id', auth, getExamsByStudent);
router.post('/', auth, authorizeRoles('admin', 'teacher'), addExam);
router.put('/:id', auth, authorizeRoles('admin', 'teacher'), updateExam);
router.delete('/:id', auth, authorizeRoles('admin', 'teacher'), deleteExam);

export default router;