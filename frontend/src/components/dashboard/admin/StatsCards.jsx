import { useNavigate } from 'react-router-dom';

const StatsCards = ({ data }) => {
  const navigate = useNavigate();

  const cards = [
    { label: 'Total Students', icon: '👨‍🎓', color: 'bg-[#1B3A5C]/10 text-[#1B3A5C]', trend: '+12%', value: data?.totalStudents || 0 },
    { label: 'Total Teachers', icon: '🎓', color: 'bg-[#1B4332]/10 text-[#1B4332]', trend: '+5%', value: data?.totalTeachers || 0 },
    { label: 'Total Courses', icon: '📚', color: 'bg-[#00B4D8]/10 text-[#00B4D8]', trend: '+2', value: data?.totalCourses || 0 },
    { label: 'Monthly Revenue', icon: '💰', color: 'bg-green-100 text-green-700', trend: '+18%', value: data?.monthlyRevenue || 0, isCurrency: true },
    { label: 'Pending Approvals', icon: '⏳', color: 'bg-amber-100 text-amber-700', trend: 'Action Needed', value: data?.pendingApprovals || 0, onClick: () => navigate('/admin/approvals') },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
      {cards.map((s, i) => (
        <div key={i} onClick={s.onClick} className={`bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow ${s.onClick ? 'cursor-pointer hover:border-amber-300' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-[#4A5568] mb-1">{s.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
                {s.isCurrency ? `PKR ${s.value.toLocaleString()}` : s.value}
              </p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${s.color}`}>
              {s.icon}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {s.onClick ? (
              <span className="text-amber-600 font-semibold">{s.trend}</span>
            ) : (
              <>
                <span className="text-green-600 font-semibold flex items-center gap-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {s.trend}
                </span>
                <span className="text-[#4A5568]">this month</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
