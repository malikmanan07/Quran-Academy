import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ROUTES } from './constants/routes';
import { ROLES } from './constants/roles';
import Loader from './components/common/Loader';
import ErrorBoundary from './components/common/ErrorBoundary';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import PendingApprovalPage from './pages/public/PendingApprovalPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Admin Pages
import AdminDashboard from './pages/admin/DashboardPage';
import StudentsPage from './pages/admin/StudentsPage';
import TeachersPage from './pages/admin/TeachersPage';
import CoursesPage from './pages/admin/CoursesPage';
import ClassesPage from './pages/admin/ClassesPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import ApprovalsPage from './pages/admin/ApprovalsPage';
import UsersPage from './pages/admin/UsersPage';
import SettingsPage from './pages/admin/SettingsPage';
import ParentsPage from './pages/admin/ParentsPage';
import TrialRequestsPage from './pages/admin/TrialRequestsPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/DashboardPage';
import MyStudentsPage from './pages/teacher/MyStudentsPage';
import SchedulePage from './pages/teacher/SchedulePage';
import TeacherProgress from './pages/teacher/ProgressPage';
import MaterialsPage from './pages/teacher/MaterialsPage';
import TeacherProfilePage from './pages/teacher/ProfilePage';

// Student Pages
import StudentDashboard from './pages/student/DashboardPage';
import MyCoursesPage from './pages/student/MyCoursesPage';
import StudentProgress from './pages/student/ProgressPage';
import ExamsPage from './pages/student/ExamsPage';
import StudentPayments from './pages/student/PaymentsPage';
import StudentProfilePage from './pages/student/ProfilePage';

// Parent Pages
import ParentDashboard from './pages/parent/DashboardPage';
import ChildProgressPage from './pages/parent/ChildProgressPage';
import ChildPaymentsPage from './pages/parent/ChildPaymentsPage';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
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
          <Route path={ROUTES.TEACHER_MATERIALS} element={<MaterialsPage />} />
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
          <Route path={ROUTES.STUDENT_PAYMENTS} element={<StudentPayments />} />
          <Route path={ROUTES.STUDENT_PROFILE} element={<StudentProfilePage />} />
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
          <Route path="/parent/payments/:id" element={<ChildPaymentsPage />} />
        </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;