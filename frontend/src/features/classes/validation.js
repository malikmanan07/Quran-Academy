export const validateClass = (values) => {
  const errors = {};

  if (!values.teacherId) errors.teacherId = 'Teacher is required';
  if (!values.studentId) errors.studentId = 'Student is required';
  if (!values.courseId) errors.courseId = 'Course is required';
  if (!values.teacherTime) errors.teacherTime = 'Teacher time is required';
  if (!values.studentTime) errors.studentTime = 'Student time is required';
  if (!values.classDate) errors.classDate = 'Class date is required';

  return errors;
};
