import { Router } from 'express';
import authenticate from '../../middlewares/authMiddleware.js';
import authorize from '../../middlewares/roleMiddleware.js';
import * as ctrl from './feedback.controller.js';

const router = Router();
router.use(authenticate);
router.post('/create', authorize('teacher'), ctrl.create);
router.get('/student/:id', ctrl.getByStudent);
router.get('/my-feedback', authorize('student'), ctrl.getMyFeedback);
router.get('/my-students-feedback', authorize('teacher'), ctrl.getMyStudentsFeedback);

export default router;
