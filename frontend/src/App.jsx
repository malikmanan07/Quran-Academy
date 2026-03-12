import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login/Login';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import Teachers from './pages/Admin/Teachers/Teachers';
import Students from './pages/Admin/Students/Students';
import Schedule from './pages/Admin/Schedule/Schedule';
import Courses from './pages/Admin/Courses/Courses';
import Payments from './pages/Admin/Payments/Payments';

// Teacher Pages
import TeacherDashboard from './pages/Teacher/Dashboard/TeacherDashboard';
import TeacherSchedule from './pages/Teacher/Schedule/Schedule';
import TeacherStudents from './pages/Teacher/Students/Students';
import TeacherProgress from './pages/Teacher/Progress/Progress';
import CourseMaterial from './pages/Teacher/CourseMaterial/CourseMaterial';
import TeacherProfile from './pages/Teacher/Profile/Profile';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard/StudentDashboard';
import StudentSchedule from './pages/Student/Schedule/Schedule';
import StudentProgress from './pages/Student/Progress/Progress';
import StudentExams from './pages/Student/Exams/Exams';
import StudentProfile from './pages/Student/Profile/Profile';

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/teachers" element={
          <ProtectedRoute roles={['admin']}>
            <Teachers />
          </ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute roles={['admin']}>
            <Students />
          </ProtectedRoute>
        } />
        <Route path="/admin/schedule" element={
          <ProtectedRoute roles={['admin']}>
            <Schedule />
          </ProtectedRoute>
        } />
        <Route path="/admin/courses" element={
          <ProtectedRoute roles={['admin']}>
            <Courses />
          </ProtectedRoute>
        } />
        <Route path="/admin/payments" element={
          <ProtectedRoute roles={['admin']}>
            <Payments />
          </ProtectedRoute>
        } />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute roles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        <Route path="/teacher/schedule" element={
          <ProtectedRoute roles={['teacher']}>
            <TeacherSchedule />
          </ProtectedRoute>
        } />
        <Route path="/teacher/students" element={
          <ProtectedRoute roles={['teacher']}>
            <TeacherStudents />
          </ProtectedRoute>
        } />
        <Route path="/teacher/progress" element={
          <ProtectedRoute roles={['teacher']}>
            <TeacherProgress />
          </ProtectedRoute>
        } />
        <Route path="/teacher/material" element={
          <ProtectedRoute roles={['teacher']}>
            <CourseMaterial />
          </ProtectedRoute>
        } />
        <Route path="/teacher/profile" element={
          <ProtectedRoute roles={['teacher']}>
            <TeacherProfile />
          </ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute roles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/schedule" element={
          <ProtectedRoute roles={['student']}>
            <StudentSchedule />
          </ProtectedRoute>
        } />
        <Route path="/student/progress" element={
          <ProtectedRoute roles={['student']}>
            <StudentProgress />
          </ProtectedRoute>
        } />
        <Route path="/student/exams" element={
          <ProtectedRoute roles={['student']}>
            <StudentExams />
          </ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute roles={['student']}>
            <StudentProfile />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;