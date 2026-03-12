import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const teacherLinks = [
    { label: 'Home', path: '/teacher/dashboard' },
    { label: 'Regular Schedule', path: '/teacher/schedule' },
    { label: 'List of Students', path: '/teacher/students' },
    { label: 'Course Material', path: '/teacher/material' },
    { label: 'Progress', path: '/teacher/progress' },
    { label: 'Teacher Profile', path: '/teacher/profile' },
  ];

  const studentLinks = [
    { label: 'Home', path: '/student/dashboard' },
    { label: 'My Schedule', path: '/student/schedule' },
    { label: 'My Progress', path: '/student/progress' },
    { label: 'Exams', path: '/student/exams' },
    { label: 'Profile', path: '/student/profile' },
  ];

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Teachers', path: '/admin/teachers' },
    { label: 'Students', path: '/admin/students' },
    { label: 'Schedule', path: '/admin/schedule' },
    { label: 'Courses', path: '/admin/courses' },
    { label: 'Payments', path: '/admin/payments' },
  ];

  const links =
    user?.role === 'teacher' ? teacherLinks :
    user?.role === 'student' ? studentLinks :
    adminLinks;

  return (
    <nav className="navbar-custom">
      <div className="navbar-logo">
        <span className="logo-quran">Quran</span>
        <span className="logo-academe">ACADEME</span>
      </div>

      <div className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="nav-link-custom"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="navbar-user">
        <span className="user-name">{user?.name}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;