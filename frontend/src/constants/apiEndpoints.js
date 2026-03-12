export const API = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Students
  STUDENTS: '/students',
  STUDENT_BY_ID: (id) => `/students/${id}`,

  // Teachers
  TEACHERS: '/teachers',
  TEACHER_BY_ID: (id) => `/teachers/${id}`,

  // Courses
  COURSES: '/courses',
  COURSE_BY_ID: (id) => `/courses/${id}`,

  // Classes
  CLASSES: '/classes',
  CLASSES_BY_TEACHER: () => `/classes/teacher/my-classes`,
  CLASSES_BY_STUDENT: () => `/classes/student/my-classes`,
  CLASS_STATUS: (id) => `/classes/${id}/status`,
  CLASS_BY_ID: (id) => `/classes/${id}`,

  // Payments
  PAYMENTS: '/payments',
  PAYMENTS_BY_STUDENT: () => `/payments/student/my-payments`,
  PAYMENT_STATUS: (id) => `/payments/${id}/status`,
  PAYMENT_BY_ID: (id) => `/payments/${id}`,

  // Progress
  PROGRESS: '/progress',
  PROGRESS_BY_STUDENT: () => `/progress/student/my-progress`,
  PROGRESS_BY_ID: (id) => `/progress/${id}`,

  // Exams
  EXAMS: '/exams',
  EXAMS_BY_STUDENT: () => `/exams/student/my-exams`,
  EXAM_BY_ID: (id) => `/exams/${id}`,

  // Course Material
  COURSE_MATERIAL: '/course-material',
  COURSE_MATERIAL_BY_STUDENT: () => `/course-material/student/my-materials`,
  COURSE_MATERIAL_BY_ID: (id) => `/course-material/${id}`,

  // Stats
  ADMIN_STATS: '/stats/admin',
};
