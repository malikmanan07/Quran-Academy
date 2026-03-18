import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AppButton from '../common/AppButton';
import { ROUTES } from '../../constants/routes';

const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-24 bg-[#00B4D8] relative overflow-hidden w-full max-w-full">
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('cta.title')}
        </h2>
        <p className="text-white/80 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
          {t('cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={ROUTES.SIGNUP}>
            <AppButton
              variant="primary"
              size="lg"
              className="!bg-white !text-[#1B3A5C] hover:!bg-white/90 !font-bold"
            >
              {t('cta.enrollNow')}
            </AppButton>
          </Link>
          <a href="mailto:info@quranacademy.com">
            <AppButton
              variant="outline"
              size="lg"
              className="!border-white/40 !text-white hover:!bg-white/10"
            >
              {t('cta.contactUs')}
            </AppButton>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
