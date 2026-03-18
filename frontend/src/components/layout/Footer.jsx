import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1B3A5C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📖</span>
              <h3 className="text-xl font-bold">Quran Academy</h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              {t('footer.about')}
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: 'f', label: 'Facebook' },
                { icon: 'ig', label: 'Instagram' },
                { icon: 'wa', label: 'WhatsApp' },
                { icon: 'yt', label: 'YouTube' },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-[#00B4D8] transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5">
              {[
                { label: t('nav.home'), to: ROUTES.HOME },
                { label: t('nav.courses'), to: '#courses' },
                { label: t('nav.pricing'), to: '#pricing' },
                { label: t('nav.login'), to: ROUTES.LOGIN },
                { label: t('nav.signup'), to: ROUTES.SIGNUP },
              ].map((l, i) => (
                <li key={i}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('footer.courses')}</h4>
            <ul className="space-y-2.5">
              {['Nazra Quran', 'Hifz ul Quran', 'Tajweed ul Quran', 'Islamic Studies'].map((c, i) => (
                <li key={i}>
                  <a href="#courses" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <span className="mt-0.5">📧</span>
                <span>info@quranacademy.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <span className="mt-0.5">📞</span>
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <span className="mt-0.5">📍</span>
                <span>{t('footer.location')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">© {year} Quran Academy. {t('footer.rights')}</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">{t('footer.privacy')}</a>
            <span className="w-px h-3 bg-white/20" />
            <a href="#" className="hover:text-white/70 transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
