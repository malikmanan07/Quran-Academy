import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { useState, useEffect } from 'react';
import http from '../../services/http';

const adminMenu = [
  { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: '📊' },
  { label: 'Approvals', path: ROUTES.ADMIN_APPROVALS, icon: '⏳', isBadge: true },
  { label: 'All Users', path: ROUTES.ADMIN_USERS, icon: '👥' },
  { label: 'Students', path: ROUTES.ADMIN_STUDENTS, icon: '🎓' },
  { label: 'Teachers', path: ROUTES.ADMIN_TEACHERS, icon: '👨‍🏫' },
  { label: 'Courses', path: ROUTES.ADMIN_COURSES, icon: '📚' },
  { label: 'Classes', path: ROUTES.ADMIN_CLASSES, icon: '🕐' },
  { label: 'Payments', path: ROUTES.ADMIN_PAYMENTS, icon: '💰' },
  { label: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: '⚙️' },
];

const teacherMenu = [
  { label: 'Dashboard', path: ROUTES.TEACHER_DASHBOARD, icon: '📊' },
  { label: 'My Students', path: ROUTES.TEACHER_STUDENTS, icon: '🎓' },
  { label: 'Schedule', path: ROUTES.TEACHER_SCHEDULE, icon: '🕐' },
  { label: 'Progress', path: ROUTES.TEACHER_PROGRESS, icon: '📈' },
  { label: 'Materials', path: ROUTES.TEACHER_MATERIALS, icon: '📄' },
  { label: 'Profile', path: ROUTES.TEACHER_PROFILE, icon: '⚙️' },
];

const studentMenu = [
  { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, icon: '📊' },
  { label: 'My Courses', path: ROUTES.STUDENT_COURSES, icon: '📚' },
  { label: 'Progress', path: ROUTES.STUDENT_PROGRESS, icon: '📈' },
  { label: 'Exams', path: ROUTES.STUDENT_EXAMS, icon: '📝' },
  { label: 'Payments', path: ROUTES.STUDENT_PAYMENTS, icon: '💰' },
  { label: 'Profile', path: ROUTES.STUDENT_PROFILE, icon: '⚙️' },
];

const getMenu = (role) => {
  switch (role) {
    case ROLES.ADMIN: return adminMenu;
    case ROLES.TEACHER: return teacherMenu;
    case ROLES.STUDENT: return studentMenu;
    default: return [];
  }
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menu = getMenu(user?.role);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.role === ROLES.ADMIN) {
      http.get('/admin/pending-users')
        .then(({ data }) => setPendingCount(data.users?.length || 0))
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 z-50 w-64 bg-[#1B4332] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin">
          <ul className="space-y-1">
            {menu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#00B4D8] text-white shadow-md'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.isBadge && pendingCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#00B4D8] flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/60 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-red-600 transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
