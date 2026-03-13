import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyChildren } from '../../features/parent/api';
import EmptyState from '../../components/common/EmptyState';
import StatCardSkeleton from '../../components/common/StatCardSkeleton';

const DashboardPage = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyChildren();
        setChildren(res.data?.data?.children || []);
      } catch { setChildren([]); }
      setLoading(false);
    };
    fetch();
  }, []);

  const today = new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">Welcome, {user?.name} 👋</h1>
        <p className="text-sm text-[#4A5568]">{today}</p>
      </div>

      {/* Stats */}
      {loading ? <StatCardSkeleton /> : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm">
            <p className="text-2xl font-bold text-[#00B4D8]">{children.length}</p>
            <p className="text-sm text-[#4A5568]">Linked Children</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm">
            <p className="text-2xl font-bold text-[#1B4332]">👨‍👩‍👧</p>
            <p className="text-sm text-[#4A5568]">Parent Portal</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm">
            <p className="text-2xl font-bold text-[#1B3A5C]">📊</p>
            <p className="text-sm text-[#4A5568]">Track Progress</p>
          </div>
        </div>
      )}

      {/* Children cards */}
      <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">My Children</h2>
      {children.length === 0 ? (
        <EmptyState icon="👨‍👩‍👧" title="No Children Linked" message="Ask admin to link your children" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map(c => (
            <div key={c.id} className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#00B4D8] flex items-center justify-center text-white font-bold text-sm">
                  {c.studentName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-[#1A1A2E]">{c.studentName}</p>
                  <p className="text-xs text-[#4A5568]">{c.studentEmail}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/parent/progress/${c.studentId}`} className="flex-1 text-center px-3 py-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-medium hover:bg-[#00B4D8]/20 transition-colors">Progress</Link>
                <Link to={`/parent/payments/${c.studentId}`} className="flex-1 text-center px-3 py-2 rounded-lg bg-[#1B4332]/10 text-[#1B4332] text-xs font-medium hover:bg-[#1B4332]/20 transition-colors">Payments</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
