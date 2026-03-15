import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ROUTES } from './constants/routes';
import { ROLES } from './constants/roles';
import Loader from './components/common/Loader';
import ErrorBoundary from './components/common/ErrorBoundary';
import PageSkeleton from './components/common/PageSkeleton';
import { lazy, Suspense } from 'react';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
const HomePage = lazy(() => import('./pages/public/HomePage'));
const LoginPage = lazy(() => import('./pages/public/LoginPage'));
const SignupPage = lazy(() => import('./pages/public/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPasswordPage'));
const PendingApprovalPage = lazy(() => import('./pages/public/PendingApprovalPage'));
const UnauthorizedPage = lazy(() => import('./pages/public/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/DashboardPage'));
const StudentsPage = lazy(() => import('./pages/admin/StudentsPage'));
const TeachersPage = lazy(() => import('./pages/admin/TeachersPage'));
const CoursesPage = lazy(() => import('./pages/admin/CoursesPage'));
const ClassesPage = lazy(() => import('./pages/admin/ClassesPage'));
const PaymentsPage = lazy(() => import('./pages/admin/PaymentsPage'));
const ApprovalsPage = lazy(() => import('./pages/admin/ApprovalsPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const ParentsPage = lazy(() => import('./pages/admin/ParentsPage'));
const TrialRequestsPage = lazy(() => import('./pages/admin/TrialRequestsPage'));
const EnrollmentRequestsPage = lazy(() => import('./pages/admin/EnrollmentRequestsPage'));
const MessagesPage = lazy(() => import('./pages/common/MessagesPage'));

// Teacher Pages
const TeacherDashboard = lazy(() => import('./pages/teacher/DashboardPage'));
const MyStudentsPage = lazy(() => import('./pages/teacher/MyStudentsPage'));
const SchedulePage = lazy(() => import('./pages/teacher/SchedulePage'));
const TeacherProgress = lazy(() => import('./pages/teacher/ProgressPage'));
const MaterialsPage = lazy(() => import('./pages/teacher/MaterialsPage'));
const TeacherProfilePage = lazy(() => import('./pages/teacher/ProfilePage'));
const TeacherDailyProgress = lazy(() => import('./pages/teacher/DailyProgressPage'));
const TeacherAttendance = lazy(() => import('./pages/teacher/AttendancePage'));
const TeacherFeedbackPage = lazy(() => import('./pages/teacher/TeacherFeedbackPage'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/DashboardPage'));
const MyCoursesPage = lazy(() => import('./pages/student/MyCoursesPage'));
const StudentProgress = lazy(() => import('./pages/student/ProgressPage'));
const ExamsPage = lazy(() => import('./pages/student/ExamsPage'));
const StudentPayments = lazy(() => import('./pages/student/PaymentsPage'));
const StudentProfilePage = lazy(() => import('./pages/student/ProfilePage'));
const StudentDailyProgress = lazy(() => import('./pages/student/DailyProgressPage'));
const BrowseCoursesPage = lazy(() => import('./pages/student/CoursesPage'));
const StudentAttendance = lazy(() => import('./pages/student/AttendancePage'));
const StudentClassesPage = lazy(() => import('./pages/student/ClassesPage'));
const StudentCertificatesPage = lazy(() => import('./pages/student/CertificatesPage'));
const StudentMaterialsPage = lazy(() => import('./pages/student/MaterialsPage'));

// Parent Pages
const ParentDashboard = lazy(() => import('./pages/parent/DashboardPage'));
const ChildProgressPage = lazy(() => import('./pages/parent/ChildProgressPage'));
const ChildPaymentsPage = lazy(() => import('./pages/parent/ChildPaymentsPage'));
const ChildAttendancePage = lazy(() => import('./pages/student/AttendancePage')); // Reuse student attendance view

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageSkeleton />;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (user.status === 'pending') return <Navigate to="/pending-approval" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="animate-fade-in">
          <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_STUDENTS} element={<StudentsPage />} />
          <Route path={ROUTES.ADMIN_TEACHERS} element={<TeachersPage />} />
          <Route path={ROUTES.ADMIN_COURSES} element={<CoursesPage />} />
          <Route path={ROUTES.ADMIN_CLASSES} element={<ClassesPage />} />
          <Route path={ROUTES.ADMIN_PAYMENTS} element={<PaymentsPage />} />
          <Route path={ROUTES.ADMIN_APPROVALS} element={<ApprovalsPage />} />
          <Route path={ROUTES.ADMIN_USERS} element={<UsersPage />} />
          <Route path={ROUTES.ADMIN_SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.ADMIN_PARENTS} element={<ParentsPage />} />
          <Route path={ROUTES.ADMIN_TRIAL_REQUESTS} element={<TrialRequestsPage />} />
          <Route path={ROUTES.ADMIN_ENROLLMENT_REQUESTS} element={<EnrollmentRequestsPage />} />
          <Route path={ROUTES.ADMIN_MESSAGES} element={<MessagesPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route element={
          <ProtectedRoute roles={[ROLES.TEACHER]}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path={ROUTES.TEACHER_DASHBOARD} element={<TeacherDashboard />} />
          <Route path={ROUTES.TEACHER_STUDENTS} element={<MyStudentsPage />} />
          <Route path={ROUTES.TEACHER_SCHEDULE} element={<SchedulePage />} />
          <Route path={ROUTES.TEACHER_PROGRESS} element={<TeacherProgress />} />
          <Route path={ROUTES.TEACHER_DAILY_PROGRESS} element={<TeacherDailyProgress />} />
          <Route path={ROUTES.TEACHER_MATERIALS} element={<MaterialsPage />} />
          <Route path={ROUTES.TEACHER_ATTENDANCE} element={<TeacherAttendance />} />
          <Route path={ROUTES.TEACHER_FEEDBACK} element={<TeacherFeedbackPage />} />
          <Route path={ROUTES.TEACHER_MESSAGES} element={<MessagesPage />} />
          <Route path={ROUTES.TEACHER_PROFILE} element={<TeacherProfilePage />} />
        </Route>

        {/* Student Routes */}
        <Route element={
          <ProtectedRoute roles={[ROLES.STUDENT]}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentDashboard />} />
          <Route path={ROUTES.STUDENT_COURSES} element={<MyCoursesPage />} />
          <Route path={ROUTES.STUDENT_PROGRESS} element={<StudentProgress />} />
          <Route path={ROUTES.STUDENT_EXAMS} element={<ExamsPage />} />
          <Route path={ROUTES.STUDENT_DAILY_PROGRESS} element={<StudentDailyProgress />} />
          <Route path={ROUTES.STUDENT_PAYMENTS} element={<StudentPayments />} />
          <Route path={ROUTES.STUDENT_BROWSE_COURSES} element={<BrowseCoursesPage />} />
          <Route path={ROUTES.STUDENT_ATTENDANCE} element={<StudentAttendance />} />
          <Route path={ROUTES.STUDENT_MESSAGES} element={<MessagesPage />} />
          <Route path={ROUTES.STUDENT_PROFILE} element={<StudentProfilePage />} />
          <Route path={ROUTES.STUDENT_CLASSES} element={<StudentClassesPage />} />
          <Route path={ROUTES.STUDENT_CERTIFICATES} element={<StudentCertificatesPage />} />
          <Route path={ROUTES.STUDENT_MATERIALS} element={<StudentMaterialsPage />} />
        </Route>

        {/* Parent Routes */}
        <Route element={
          <ProtectedRoute roles={[ROLES.PARENT]}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path={ROUTES.PARENT_DASHBOARD} element={<ParentDashboard />} />
          <Route path={ROUTES.PARENT_CHILDREN} element={<ParentDashboard />} />
          <Route path="/parent/progress/:id" element={<ChildProgressPage />} />
          <Route path="/parent/attendance/:id" element={<ChildAttendancePage />} />
          <Route path="/parent/payments/:id" element={<ChildPaymentsPage />} />
          <Route path={ROUTES.PARENT_MESSAGES} element={<MessagesPage />} />
        </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;