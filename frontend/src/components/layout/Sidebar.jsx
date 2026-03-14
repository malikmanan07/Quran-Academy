import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { useState, useEffect } from 'react';
import http from '../../services/http';

const adminMenu = [
  { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: '📊' },
  { label: 'Enrollment Requests', path: ROUTES.ADMIN_ENROLLMENT_REQUESTS, icon: '📩', isBadge: true, badgeKey: 'enrollments' },
  { label: 'Approvals', path: ROUTES.ADMIN_APPROVALS, icon: '⏳', isBadge: true, badgeKey: 'pending' },
  { label: 'Trial Requests', path: ROUTES.ADMIN_TRIAL_REQUESTS, icon: '🎯', isBadge: true, badgeKey: 'trial' },
  { label: 'All Users', path: ROUTES.ADMIN_USERS, icon: '👥' },
  { label: 'Students', path: ROUTES.ADMIN_STUDENTS, icon: '🎓' },
  { label: 'Teachers', path: ROUTES.ADMIN_TEACHERS, icon: '👨‍🏫' },
  { label: 'Parents', path: ROUTES.ADMIN_PARENTS, icon: '👨‍👩‍👧' },
  { label: 'Courses', path: ROUTES.ADMIN_COURSES, icon: '📚' },
  { label: 'Classes', path: ROUTES.ADMIN_CLASSES, icon: '🕐' },
  { label: 'Payments', path: ROUTES.ADMIN_PAYMENTS, icon: '💰', isBadge: true, badgeKey: 'payments' },
  { label: 'Messages', path: ROUTES.ADMIN_MESSAGES, icon: '💬', isBadge: true, badgeKey: 'messages' },
  { label: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: '⚙️' },
];

const teacherMenu = [
  { label: 'Dashboard', path: ROUTES.TEACHER_DASHBOARD, icon: '📊' },
  { label: 'My Students', path: ROUTES.TEACHER_STUDENTS, icon: '🎓' },
  { label: 'Schedule', path: ROUTES.TEACHER_SCHEDULE, icon: '🕐' },
  { label: 'Attendance', path: ROUTES.TEACHER_ATTENDANCE, icon: '📋' },
  { label: 'Progress', path: ROUTES.TEACHER_PROGRESS, icon: '📈' },
  { label: 'Daily Sabaq', path: ROUTES.TEACHER_DAILY_PROGRESS, icon: '📝' },
  { label: 'Feedback', path: ROUTES.TEACHER_FEEDBACK, icon: '🌟' },
  { label: 'Materials', path: ROUTES.TEACHER_MATERIALS, icon: '📄' },
  { label: 'Messages', path: ROUTES.TEACHER_MESSAGES, icon: '💬', isBadge: true, badgeKey: 'messages' },
];

const studentMenu = [
  { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, icon: '📊' },
  { label: 'Browse Courses', path: ROUTES.STUDENT_BROWSE_COURSES, icon: '🔍' },
  { label: 'My Courses', path: ROUTES.STUDENT_COURSES, icon: '📚' },
  { label: 'Attendance', path: ROUTES.STUDENT_ATTENDANCE, icon: '📋' },
  { label: 'Progress', path: ROUTES.STUDENT_PROGRESS, icon: '📈' },
  { label: 'Daily Sabaq', path: ROUTES.STUDENT_DAILY_PROGRESS, icon: '📝' },
  { label: 'Exams', path: ROUTES.STUDENT_EXAMS, icon: '📝' },
  { label: 'Payments', path: ROUTES.STUDENT_PAYMENTS, icon: '💰' },
  { label: 'Messages', path: ROUTES.STUDENT_MESSAGES, icon: '💬', isBadge: true, badgeKey: 'messages' },
];

const parentMenu = [
  { label: 'Dashboard', path: ROUTES.PARENT_DASHBOARD, icon: '📊' },
  { label: 'My Children', path: ROUTES.PARENT_CHILDREN, icon: '👨‍👩‍👧' },
  { label: 'Messages', path: ROUTES.PARENT_MESSAGES, icon: '💬', isBadge: true, badgeKey: 'messages' },
];

const getMenu = (role) => {
  switch (role) {
    case ROLES.ADMIN: return adminMenu;
    case ROLES.TEACHER: return teacherMenu;
    case ROLES.STUDENT: return studentMenu;
    case ROLES.PARENT: return parentMenu;
    default: return [];
  }
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menu = getMenu(user?.role);
  const [badges, setBadges] = useState({ pending: 0, trial: 0, enrollments: 0, messages: 0, payments: 0 });

  useEffect(() => {
    if (user?.role === ROLES.ADMIN) {
      Promise.all([
        http.get('admin/pending-users').catch(() => ({ data: { users: [] } })),
        http.get('trial/requests').catch(() => ({ data: { data: { pendingCount: 0 } } })),
        http.get('enrollments/requests').catch(() => ({ data: { data: { pendingCount: 0 } } })),
        http.get('stats/admin').catch(() => ({ data: { data: { pendingPayments: 0 } } })),
      ]).then(([pRes, tRes, eRes, sRes]) => {
        setBadges(prev => ({
          ...prev,
          pending: pRes.data?.users?.length || 0,
          trial: tRes.data?.data?.pendingCount || 0,
          enrollments: eRes.data?.data?.pendingCount || 0,
          payments: sRes.data?.data?.pendingPayments || 0,
        }));
      });
    }
    
    // Fetch unread messages count for everyone
    if (user) {
      http.get('messages/unread-count')
        .then(res => setBadges(prev => ({ ...prev, messages: res.data?.data?.count || 0 })))
        .catch(() => {});
    }
  }, [user?.id, user?.role]);

  const handleLogout = () => { logout(); navigate(ROUTES.LOGIN); };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-16 left-0 bottom-0 z-50 w-64 bg-[#1B4332] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin">
          <ul className="space-y-1">
            {menu.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive ? 'bg-[#00B4D8] text-white shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.isBadge && badges[item.badgeKey] > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {badges[item.badgeKey]}
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
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-red-600 transition-colors duration-200 cursor-pointer">
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
