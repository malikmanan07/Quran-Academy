import NotificationBell from '../common/NotificationBell';

const Navbar = ({ onToggleSidebar, user }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#1B3A5C] text-white flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-md w-full">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <h1 className="text-lg font-bold hidden sm:block">Quran Academy</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium">{user?.name || 'User'}</p>
          <p className="text-xs text-white/70 capitalize">{user?.role || 'Guest'}</p>
        </div>
        <NotificationBell />
        <div className="w-9 h-9 rounded-full bg-[#00B4D8] flex items-center justify-center text-sm font-bold">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
