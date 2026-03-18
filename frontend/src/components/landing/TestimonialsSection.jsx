import { useTranslation } from 'react-i18next';

const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      text: t('testimonials.t1'),
      name: t('testimonials.t1name'),
      location: t('testimonials.t1city'),
      initials: 'SA',
    },
    {
      text: t('testimonials.t2'),
      name: t('testimonials.t2name'),
      location: t('testimonials.t2city'),
      initials: 'AH',
    },
    {
      text: t('testimonials.t3'),
      name: t('testimonials.t3name'),
      location: t('testimonials.t3city'),
      initials: 'FM',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] relative overflow-hidden w-full max-w-full">
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#00B4D8]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#00B4D8]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t('testimonials.title')}
          </h2>
          <p className="text-white/60">{t('testimonials.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((test, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-7 border border-white/10 hover:bg-white/15 transition-colors duration-300 card-text"
            >
              <div className="flex items-center gap-1 text-amber-400 text-sm mb-4">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-6 italic">
                "{test.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00B4D8]/20 border border-[#00B4D8]/30 flex items-center justify-center text-white text-xs font-bold">
                  {test.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{test.name}</p>
                  <p className="text-white/50 text-xs">{test.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
