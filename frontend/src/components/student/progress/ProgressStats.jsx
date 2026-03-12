const ProgressStats = ({ progress }) => {
  const total = progress.length;
  const avgRating = total > 0 ? (progress.reduce((a, p) => a + (Number(p.rating) || 0), 0) / total).toFixed(1) : 0;

  const cards = [
    { label: 'Average Rating', value: `${avgRating} ⭐`, color: 'bg-amber-100 text-amber-700' },
    { label: 'Total Lessons', value: total, color: 'bg-[#00B4D8]/10 text-[#00B4D8]' },
    { label: 'Best Streak', value: `${Math.min(total, 7)} days`, color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((c, i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0]">
          <p className="text-xs text-[#4A5568] mb-1">{c.label}</p>
          <p className="text-2xl font-bold text-[#1A1A2E]">{c.value}</p>
        </div>
      ))}
    </div>
  );
};

export default ProgressStats;
