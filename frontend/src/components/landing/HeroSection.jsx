import * as React from 'react';
import { useTranslation } from 'react-i18next';
import AppButton from '../common/AppButton';
import TrialBookingModal from './TrialBookingModal';

const HeroSection = () => {
  const { t } = useTranslation();
  const [showTrial, setShowTrial] = React.useState(false);

  const featurePills = [
    { key: 'global', icon: '🌍', text: t('hero.globalStudents') },
    { key: 'timezone', icon: '⏰', text: t('hero.flexibleTimezones') },
    { key: 'trial', icon: '✅', text: t('hero.freeTrial') },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] text-white overflow-hidden flex items-center w-full max-w-full">
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%3E%3Cg%20fill%3D%22%23fff%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] pointer-events-none" />

      {/* Glow effects */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-[#00B4D8]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00B4D8]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left hero-text">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6">
              🌙 {t('hero.trusted')}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-tight mb-6">
              {t('hero.title')}{' '}
              <span className="text-[#00B4D8]">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="text-base sm:text-lg text-white/75 max-w-xl mx-auto lg:mx-0 mb-4 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
              {featurePills.map(f => (
                <span key={f.key} className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium text-white/90">
                  {f.icon} {f.text}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <AppButton variant="accent" size="lg" onClick={() => setShowTrial(true)}>{t('hero.startFreeTrial')}</AppButton>
              <a href="#courses">
                <AppButton variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                  {t('hero.viewCourses')}
                </AppButton>
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-white/70">
              <span className="flex items-center gap-1.5">⭐ <strong className="text-white">4.9</strong> {t('hero.rating')}</span>
              <span className="w-px h-4 bg-white/20" />
              <span className="flex items-center gap-1.5">👨‍🎓 <strong className="text-white">500+</strong> {t('hero.students')}</span>
              <span className="w-px h-4 bg-white/20" />
              <span className="flex items-center gap-1.5">🎓 <strong className="text-white">50+</strong> {t('hero.teachers')}</span>
            </div>
          </div>

          {/* Right decorative cards */}
          <div className="hidden lg:flex flex-col items-center gap-5 relative">
            <div className="animate-float-slow bg-white/10 backdrop-blur-md rounded-2xl p-5 w-72 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#00B4D8]/20 flex items-center justify-center text-lg">🕐</div>
                <div>
                  <p className="text-sm font-semibold">{t('hero.nextClass')}</p>
                  <p className="text-xs text-white/60">{t('hero.tajweedUstaz')}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#00B4D8]">25 min</span>
                <span className="px-3 py-1 rounded-full bg-[#00B4D8]/20 text-[#00B4D8] text-xs font-medium">{t('hero.upcoming')}</span>
              </div>
            </div>

            <div className="animate-float-medium bg-white/10 backdrop-blur-md rounded-2xl p-5 w-64 ml-20 border border-white/10">
              <p className="text-sm font-semibold mb-2">📈 {t('hero.myProgress')}</p>
              <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
                <div className="bg-[#00B4D8] h-2.5 rounded-full w-[72%]" />
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>Juz 18 / 30</span>
                <span className="text-[#00B4D8] font-medium">72%</span>
              </div>
            </div>

            <div className="animate-float-fast bg-white/10 backdrop-blur-md rounded-2xl p-5 w-60 mr-16 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#00B4D8] flex items-center justify-center text-sm font-bold">UA</div>
                <div>
                  <p className="text-sm font-semibold">{t('teachers.ustazAhmad')}</p>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    ⭐⭐⭐⭐⭐ <span className="text-white/60 ml-1">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrialBookingModal show={showTrial} onClose={() => setShowTrial(false)} />
    </section>
  );
};

export default HeroSection;
