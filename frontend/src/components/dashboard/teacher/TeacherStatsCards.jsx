import StatCardSkeleton from '../../common/StatCardSkeleton';

const TeacherStatsCards = ({ data, loading }) => {
  if (loading) return <StatCardSkeleton />;

  const cards = [
    { label: 'My Students', value: data.students || 0, icon: '👨‍🎓', color: 'bg-[#1B3A5C]/10 text-[#1B3A5C]' },
    { label: "Today's Classes", value: data.todayClasses || 0, icon: '📅', color: 'bg-[#00B4D8]/10 text-[#00B4D8]' },
    { label: 'Pending Reports', value: data.pendingReports || 0, icon: '📋', color: 'bg-[#1B4332]/10 text-[#1B4332]' },
    { label: 'Monthly Classes', value: data.monthlyClasses || 0, icon: '📊', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((c, i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-[#4A5568]">{c.label}</p>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${c.color}`}>{c.icon}</div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">{c.value}</p>
        </div>
      ))}
    </div>
  );
};

export default TeacherStatsCards;
