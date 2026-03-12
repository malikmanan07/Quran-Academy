import express from 'express';
import { getAllStudents, getStudent, addStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';
import auth from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, authorizeRoles('admin', 'teacher'), getAllStudents);
router.get('/:id', auth, getStudent);
router.post('/', auth, authorizeRoles('admin'), addStudent);
router.put('/:id', auth, authorizeRoles('admin'), updateStudent);
router.delete('/:id', auth, authorizeRoles('admin'), deleteStudent);

export default router;