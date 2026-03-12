import express from 'express';
import { getAllPayments, getPaymentsByStudent, addPayment, updatePaymentStatus } from '../controllers/paymentController.js';
import auth from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, authorizeRoles('admin'), getAllPayments);
router.get('/student/:id', auth, getPaymentsByStudent);
router.post('/', auth, authorizeRoles('admin'), addPayment);
router.put('/:id', auth, authorizeRoles('admin'), updatePaymentStatus);

export default router;