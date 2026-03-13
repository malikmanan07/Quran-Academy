const stats = [
  { value: '500+', label: 'Global Students', icon: '👨‍🎓' },
  { value: '50+', label: 'Expert Teachers', icon: '🎓' },
  { value: '20+', label: 'Countries', icon: '🌍' },
  { value: '98%', label: 'Satisfaction Rate', icon: '⭐' },
];

const StatsBar = () => {
  return (
    <section className="bg-[#00B4D8] py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center text-white">
              <span className="text-2xl block mb-2">{stat.icon}</span>
              <p className="text-3xl sm:text-4xl font-extrabold mb-1">{stat.value}</p>
              <p className="text-sm text-white/80 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
