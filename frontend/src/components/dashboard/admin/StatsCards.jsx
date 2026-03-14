import { useNavigate } from 'react-router-dom';

const StatsCards = ({ data }) => {
  const navigate = useNavigate();

  const cards = [
    { label: 'Total Revenue', icon: '💰', color: 'bg-green-100 text-green-700', value: data?.totalRevenue || 0, isCurrency: true },
    { label: 'Pending Payments', icon: '💸', color: 'bg-orange-100 text-orange-700', 
      value: `${data?.pendingPayments || 0} (PKR ${(data?.pendingPaymentsAmount || 0).toLocaleString()})`, 
      onClick: () => navigate('/admin/payments') 
    },
    { label: 'Active Students', icon: '👨‍🎓', color: 'bg-[#1B3A5C]/10 text-[#1B3A5C]', value: data?.totalStudents || 0 },
    { label: 'Active Teachers', icon: '🎓', color: 'bg-[#1B4332]/10 text-[#1B4332]', value: data?.totalTeachers || 0 },
    { label: 'Classes Today', icon: '📅', color: 'bg-blue-100 text-blue-700', value: data?.todayClasses?.length || 0, onClick: () => navigate('/admin/classes') },
    { label: 'Trial Requests', icon: '🎯', color: 'bg-indigo-100 text-indigo-700', value: data?.pendingTrials || 0, onClick: () => navigate('/admin/trial-requests') },
    { label: 'Enrollment Requests', icon: '📩', color: 'bg-purple-100 text-purple-700', value: data?.pendingEnrollments || 0, onClick: () => navigate('/admin/enrollment-requests') },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((s, i) => (
        <div key={i} onClick={s.onClick} className={`bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow ${s.onClick ? 'cursor-pointer hover:border-amber-300' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-[#4A5568] mb-1">{s.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">
                {s.isCurrency ? `PKR ${s.value.toLocaleString()}` : s.value}
              </p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${s.color}`}>
              {s.icon}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {s.onClick ? (
              <span className="text-[#00B4D8] font-semibold flex items-center gap-1 group-hover:text-[#1B3A5C] transition-colors">
                View details &rarr;
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
