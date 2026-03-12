import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import http from '../../services/http';
import StatsCards from '../../components/dashboard/admin/StatsCards';
import RecentStudents from '../../components/dashboard/admin/RecentStudents';
import RecentPayments from '../../components/dashboard/admin/RecentPayments';
import UpcomingClasses from '../../components/dashboard/admin/UpcomingClasses';
import QuickActions from '../../components/dashboard/admin/QuickActions';
import StatCardSkeleton from '../../components/common/StatCardSkeleton';
import TableSkeleton from '../../components/common/TableSkeleton';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await http.get('/stats/admin');
        setStats(data);
      } catch { /* silent */ }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString('en-PK', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">Welcome, {user?.name} 👋</h1>
          <p className="text-sm text-[#4A5568]">{today}</p>
        </div>
      </div>

      {loading ? (
        <StatCardSkeleton />
      ) : (
        <StatsCards data={stats} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {loading ? (
          <TableSkeleton rows={5} cols={3} />
        ) : (
          <RecentStudents students={stats?.recentStudents || []} loading={loading} />
        )}
        {loading ? (
          <TableSkeleton rows={5} cols={3} />
        ) : (
          <RecentPayments payments={stats?.recentPayments || []} loading={loading} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {loading ? (
          <TableSkeleton rows={3} cols={4} />
        ) : (
          <UpcomingClasses classes={stats?.todayClasses || []} />
        )}
        <QuickActions />
      </div>
    </div>
  );
};

export default DashboardPage;
