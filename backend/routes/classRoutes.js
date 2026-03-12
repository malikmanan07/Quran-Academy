import express from 'express';
import { 
  getClassesByTeacher, 
  getClassesByStudent, 
  addClass, 
  updateClassStatus, 
  updateMeetingLink,
  deleteClass 
} from '../controllers/classController.js';
import auth from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/teacher/:id', auth, getClassesByTeacher);
router.get('/student/:id', auth, getClassesByStudent);
router.post('/', auth, authorizeRoles('admin'), addClass);
router.put('/:id/status', auth, authorizeRoles('admin', 'teacher'), updateClassStatus);
router.put('/:id/meeting', auth, authorizeRoles('admin', 'teacher'), updateMeetingLink);
router.delete('/:id', auth, authorizeRoles('admin'), deleteClass);

export default router;