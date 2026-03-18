export const API = {
  // Auth
  LOGIN: 'auth/login',
  REGISTER: 'auth/signup',
  FORGOT_PASSWORD: 'auth/forgot-password',
  LOGOUT: 'auth/logout',
  ME: 'auth/me',

  // Students
  STUDENTS: 'students',
  STUDENT_BY_ID: (id) => `students/${id}`,
  STUDENT_COURSES: 'students/my-courses',

  // Teachers
  TEACHERS: 'teachers',
  TEACHER_BY_ID: (id) => `teachers/${id}`,
  MY_STUDENTS: 'teachers/my-students',
  TEACHER_COMPLETE_COURSE: (id) => `teacher/students/${id}/complete-course`,

  // Courses
  COURSES: 'courses',
  COURSE_BY_ID: (id) => `courses/${id}`,

  // Classes
  CLASSES: 'classes',
  CLASSES_BY_TEACHER: () => `classes/teacher/my-classes`,
  CLASSES_BY_STUDENT: () => `classes/student/my-classes`,
  CLASS_STATUS: (id) => `classes/${id}/status`,
  CLASS_BY_ID: (id) => `classes/${id}`,
  TEACHER_SCHEDULE_CLASS: 'classes/teacher/schedule',
  TEACHER_RESCHEDULE_CLASS: (id) => `classes/teacher/${id}/reschedule`,
  TEACHER_CANCEL_CLASS: (id) => `classes/teacher/${id}/cancel`,

  // Payments
  PAYMENTS: 'payments',
  PAYMENTS_BY_STUDENT: () => `payments/student/my-payments`,
  PAYMENT_STATUS: (id) => `payments/${id}/status`,
  PAYMENT_BY_ID: (id) => `payments/${id}`,

  // Progress
  PROGRESS: 'progress',
  PROGRESS_BY_STUDENT: () => `progress/student/my-progress`,
  PROGRESS_BY_ID: (id) => `progress/${id}`,

  // Exams
  EXAMS: 'exams',
  EXAMS_BY_STUDENT: () => `exams/student/my-exams`,
  EXAM_BY_ID: (id) => `exams/${id}`,

  // Course Material
  COURSE_MATERIAL: 'course-material',
  COURSE_MATERIAL_BY_STUDENT: () => `course-material/student/my-materials`,
  COURSE_MATERIAL_BY_ID: (id) => `course-material/${id}`,

  // Stats
  ADMIN_STATS: 'stats/admin',

  // Certificates
  MY_CERTIFICATES: 'certificates/my-certificates',
  GENERATE_CERTIFICATE: 'certificates/generate',

  // Parent
  PARENT_CHILDREN: 'parent/my-children',
  PARENT_CHILD_PROGRESS: (id) => `parent/child/${id}/progress`,
  PARENT_CHILD_ATTENDANCE: (id) => `parent/child/${id}/attendance`,
  PARENT_CHILD_PAYMENTS: (id) => `parent/child/${id}/payments`,
  PARENT_CHILD_CLASSES: (id) => `parent/child/${id}/classes`,
  ADMIN_LINK_PARENT: 'parent/link-parent',
  ADMIN_ALL_PARENTS: 'parent/all-parents',
  ADMIN_COURSE_COMPLETIONS: 'admin/course-completions',
  ALL_CERTIFICATES: 'certificates/all',

  // Trial
  TRIAL_BOOK: 'trial/book',
  TRIAL_REQUESTS: 'trial/requests',
  TRIAL_STATUS: (id) => `trial/${id}/status`,
  TRIAL_CONVERT: (id) => `trial/${id}/convert`,

  // Quran Progress
  QURAN_PROGRESS: (studentId) => `quran-progress/${studentId}`,
  QURAN_PROGRESS_MY: 'quran-progress/my-progress',
  QURAN_PROGRESS_UPDATE: (studentId, paraNumber) =>
    `quran-progress/${studentId}/para/${paraNumber}`,

  // Daily Progress (Sabaq, Sabqi, Manzil)
  DAILY_PROGRESS: 'daily-progress',
  MY_DAILY_PROGRESS: 'daily-progress/my-progress',
  DAILY_PROGRESS_BY_STUDENT: (studentId) => `daily-progress/student/${studentId}`,
  DAILY_PROGRESS_BY_ID: (id) => `daily-progress/${id}`,

  // Enrollments
  ENROLLMENT_REQUEST: 'enrollments/request',
  MY_ENROLLMENT_REQUESTS: 'enrollments/my-requests',
  ALL_ENROLLMENT_REQUESTS: 'enrollments/requests',
  APPROVE_ENROLLMENT: (id) => `enrollments/${id}/approve`,
  REJECT_ENROLLMENT: (id) => `enrollments/${id}/reject`,

  // Attendance
  MARK_ATTENDANCE: 'attendance/mark',
  MY_ATTENDANCE: 'attendance/my-attendance',
  ATTENDANCE_BY_STUDENT: (id) => `attendance/student/${id}`,
  ATTENDANCE_BY_CLASS: (id) => `attendance/class/${id}`,
  ATTENDANCE_STATS: (studentId) => `attendance/stats/${studentId}`,
};
