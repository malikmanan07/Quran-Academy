import { Router } from 'express';
import authenticate from '../../middlewares/authMiddleware.js';
import * as ctrl from './messages.controller.js';

const router = Router();
router.use(authenticate);
router.post('/send', ctrl.send);
router.get('/inbox', ctrl.inbox);
router.get('/search-users', ctrl.searchUsers);
router.get('/conversation/:userId', ctrl.conversation);
router.put('/:id/read', ctrl.markRead);
router.get('/unread-count', ctrl.unreadCount);

export default router;
