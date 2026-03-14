import { Router } from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import roleMiddleware from '../../middlewares/roleMiddleware.js';
import * as controller from './daily-progress.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/my-progress', roleMiddleware('student'), controller.getMyDailyProgress);
router.get('/student/:id', roleMiddleware('teacher', 'admin'), controller.getDailyProgressByStudent);

router.post('/', roleMiddleware('teacher'), controller.createDailyProgress);
router.put('/:id', roleMiddleware('teacher', 'admin'), controller.updateDailyProgress);
router.delete('/:id', roleMiddleware('teacher', 'admin'), controller.deleteDailyProgress);

export default router;
