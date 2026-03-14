import { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DashboardLoadingSkeleton from '../common/DashboardLoadingSkeleton';

import { useSocket } from '../../hooks/useSocket';

const DashboardLayout = () => {
  const { user } = useAuth();
  useSocket(); // Initialize real-time connection
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#F0F4F8] w-full max-w-full overflow-x-hidden">
      <Navbar onToggleSidebar={toggleSidebar} user={user} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <main className="pt-16 lg:pl-64 min-h-screen transition-all duration-300 w-full max-w-full overflow-x-hidden">
        <div className="p-4 sm:p-6">
          <Suspense fallback={<DashboardLoadingSkeleton />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
