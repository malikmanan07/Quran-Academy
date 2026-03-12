export const validateCourse = (values) => {
  const errors = {};

  if (!values.name?.trim()) errors.name = 'Course name is required';

  return errors;
};
