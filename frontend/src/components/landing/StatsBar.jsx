import { useTranslation } from 'react-i18next';

const StatsBar = () => {
  const { t } = useTranslation();

  const stats = [
    { key: 'global', value: '500+', label: t('stats.globalStudents'), icon: '👨‍🎓' },
    { key: 'expert', value: '50+', label: t('stats.expertTeachers'), icon: '🎓' },
    { key: 'countries', value: '20+', label: t('stats.countries'), icon: '🌍' },
    { key: 'satisfaction', value: '98%', label: t('stats.satisfactionRate'), icon: '⭐' },
  ];

  return (
    <section className="bg-[#00B4D8] py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.key} className="text-center text-white">
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
