import db from '../config/db.js';
import { payments, users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

// Get All Payments
export const getAllPayments = async (req, res) => {
  try {
    const result = await db.select({
      id: payments.id,
      amount: payments.amount,
      month: payments.month,
      status: payments.status,
      paidAt: payments.paidAt,
      studentName: users.name,
    })
    .from(payments)
    .leftJoin(users, eq(payments.studentId, users.id));

    res.json({ success: true, payments: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Payments By Student
export const getPaymentsByStudent = async (req, res) => {
  try {
    const result = await db.select()
      .from(payments)
      .where(eq(payments.studentId, parseInt(req.params.id)));

    res.json({ success: true, payments: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Payment
export const addPayment = async (req, res) => {
  try {
    const { studentId, amount, month } = req.body;

    const newPayment = await db.insert(payments).values({
      studentId, amount, month
    }).returning();

    res.status(201).json({ success: true, payment: newPayment[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Payment Status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await db.update(payments)
      .set({ 
        status, 
        paidAt: status === 'Paid' ? new Date() : null 
      })
      .where(eq(payments.id, parseInt(req.params.id)))
      .returning();

    res.json({ success: true, payment: updated[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};