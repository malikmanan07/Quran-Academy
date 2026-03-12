export const validateTeacher = (values) => {
  const errors = {};

  if (!values.name?.trim()) errors.name = 'Name is required';

  if (!values.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!values.password?.trim() && !values.isEdit) {
    errors.password = 'Password is required';
  }

  return errors;
};
