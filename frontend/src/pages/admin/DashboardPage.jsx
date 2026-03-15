import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import http from '../../services/http';
import StatsCards from '../../components/dashboard/admin/StatsCards';
import RecentStudents from '../../components/dashboard/admin/RecentStudents';
import RecentPayments from '../../components/dashboard/admin/RecentPayments';
import UpcomingClasses from '../../components/dashboard/admin/UpcomingClasses';
import QuickActions from '../../components/dashboard/admin/QuickActions';
import DashboardCharts from '../../components/dashboard/admin/DashboardCharts';
import StatCardSkeleton from '../../components/common/StatCardSkeleton';
import TableSkeleton from '../../components/common/TableSkeleton';
import { cachedRequest, getCache } from '../../services/apiCache';

const DashboardPage = () => {
  const { user } = useAuth();
  const initialCache = getCache('admin:stats');
  const [stats, setStats] = useState(initialCache);
  const [loading, setLoading] = useState(!initialCache);

  useEffect(() => {
    const fetchStats = async () => {
      // Revalidate in background. Only show UI blockers if we have NO cached state.
      if (!initialCache) setLoading(true);
      try {
        const data = await cachedRequest('admin:stats', async () => {
          const response = await http.get('stats/admin');
          return response.data?.data || response.data;
        }, 300);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
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
        <>
          <StatCardSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="h-64 bg-white animate-pulse rounded-2xl" />
            <div className="h-64 bg-white animate-pulse rounded-2xl" />
          </div>
        </>
      ) : (
        <>
          <StatsCards data={stats} />
          <DashboardCharts stats={stats} />
        </>
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
