import { Router } from 'express';
import * as ctrl from './certificates.controller.js';
import auth from '../../middlewares/authMiddleware.js';
import role from '../../middlewares/roleMiddleware.js';

const router = Router();

router.get('/my-certificates', auth, role('student'), ctrl.getMyCertificates);
router.get('/all', auth, role('admin'), ctrl.getAllGenerated);
router.post('/generate', auth, role('admin'), ctrl.generate);
router.get('/:id/download', auth, ctrl.download);

export default router;
