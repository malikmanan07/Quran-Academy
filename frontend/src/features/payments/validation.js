export const validatePayment = (values) => {
  const errors = {};

  if (!values.studentId) errors.studentId = 'Student is required';
  if (!values.amount) errors.amount = 'Amount is required';
  if (!values.month?.trim()) errors.month = 'Month is required';

  return errors;
};
