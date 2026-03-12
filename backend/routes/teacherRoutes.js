import express from 'express';
import { getAllTeachers, getTeacher, addTeacher, updateTeacher, deleteTeacher } from '../controllers/teacherController.js';
import auth from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, authorizeRoles('admin'), getAllTeachers);
router.get('/:id', auth, getTeacher);
router.post('/', auth, authorizeRoles('admin'), addTeacher);
router.put('/:id', auth, authorizeRoles('admin'), updateTeacher);
router.delete('/:id', auth, authorizeRoles('admin'), deleteTeacher);

export default router;