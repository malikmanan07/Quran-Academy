import { useTranslation } from 'react-i18next';

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    { key: 'one', icon: '🎯', title: t('features.oneOnOne'), desc: t('features.oneOnOneDesc') },
    { key: 'expert', icon: '👨‍🏫', title: t('features.expertTeachers'), desc: t('features.expertTeachersDesc') },
    { key: 'flex', icon: '📅', title: t('features.flexibleSchedule'), desc: t('features.flexibleScheduleDesc') },
    { key: 'any', icon: '📱', title: t('features.learnAnywhere'), desc: t('features.learnAnywhereDesc') },
    { key: 'track', icon: '📊', title: t('features.progressTracking'), desc: t('features.progressTrackingDesc') },
    { key: 'cert', icon: '🏆', title: t('features.certificates'), desc: t('features.certificatesDesc') },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#F0F4F8] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">
            {t('features.title')}
          </h2>
          <p className="text-[#4A5568] max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f) => (
            <div
              key={f.key}
              className="bg-white rounded-xl p-7 shadow-md border border-[#E2E8F0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group card-text"
            >
              <div className="w-14 h-14 rounded-xl bg-[#00B4D8]/10 flex items-center justify-center text-2xl mb-5 group-hover:bg-[#00B4D8]/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">{f.title}</h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
