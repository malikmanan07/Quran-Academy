export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_TEACHERS: '/admin/teachers',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_CLASSES: '/admin/classes',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_APPROVALS: '/admin/approvals',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_PARENTS: '/admin/parents',
  ADMIN_TRIAL_REQUESTS: '/admin/trial-requests',

  // Teacher
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_STUDENTS: '/teacher/students',
  TEACHER_SCHEDULE: '/teacher/schedule',
  TEACHER_PROGRESS: '/teacher/progress',
  TEACHER_MATERIALS: '/teacher/materials',
  TEACHER_PROFILE: '/teacher/profile',

  // Student
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_COURSES: '/student/courses',
  STUDENT_PROGRESS: '/student/progress',
  STUDENT_EXAMS: '/student/exams',
  STUDENT_PAYMENTS: '/student/payments',
  STUDENT_PROFILE: '/student/profile',

  // Parent
  PARENT_DASHBOARD: '/parent/dashboard',
  PARENT_CHILDREN: '/parent/children',
  PARENT_PROGRESS: '/parent/progress/:id',
  PARENT_PAYMENTS: '/parent/payments/:id',
};
