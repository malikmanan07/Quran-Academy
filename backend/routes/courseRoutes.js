import express from 'express';
import { getAllCourses, addCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import auth from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getAllCourses);
router.post('/', auth, authorizeRoles('admin'), addCourse);
router.put('/:id', auth, authorizeRoles('admin'), updateCourse);
router.delete('/:id', auth, authorizeRoles('admin'), deleteCourse);

export default router;