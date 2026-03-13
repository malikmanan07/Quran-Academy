import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import AppButton from '../common/AppButton';
import CurrencySelector from '../common/CurrencySelector';
import WhatsAppButton from '../common/WhatsAppButton';
import { useCurrency } from '../../hooks/useCurrency';
import Footer from './Footer';

const navLinks = [
  { label: 'Home', to: ROUTES.HOME, hash: '' },
  { label: 'Courses', to: ROUTES.HOME, hash: '#courses' },
  { label: 'Pricing', to: ROUTES.HOME, hash: '#pricing' },
  { label: 'About', to: ROUTES.HOME, hash: '#about' },
];

const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle initial load with hash
    if (location.hash && location.pathname === '/') {
      const id = location.hash.substring(1);
      const attemptScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          // If element not ready, wait a bit
          setTimeout(attemptScroll, 100);
        }
      };
      attemptScroll();
    }
  }, [location.hash, location.pathname]);

  const handleNav = (e, link) => {
    setMenuOpen(false);

    // If it's a hash link and we are on home page
    if (link.hash && location.pathname === '/') {
      e.preventDefault();
      const id = link.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        // Update URL without refresh
        window.history.pushState(null, '', link.hash);
      }
    } else if (link.hash) {
      // Cross-page hash link
      e.preventDefault();
      navigate('/' + link.hash);
    }
    // else default behavior (home link, etc)
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4F8]">
      <header className="bg-[#1B3A5C] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl">📖</span>
            <span className="text-lg font-bold">Quran Academy</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.label} href={link.hash || link.to}
                onClick={(e) => handleNav(e, link)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all duration-200">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
            <Link to={ROUTES.LOGIN}>
              <AppButton variant="outline" size="sm" className="!border-white/30 !text-white hover:!bg-white/10">Login</AppButton>
            </Link>
            <Link to={ROUTES.SIGNUP}>
              <AppButton variant="accent" size="sm">Sign Up</AppButton>
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" aria-label="Toggle menu">
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" onClick={() => setMenuOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 h-full w-64 bg-[#1B3A5C] z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl md:hidden flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-lg font-bold text-white">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-white/10 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          {navLinks.map((link) => (
            <a key={link.label} href={link.hash || link.to}
              onClick={(e) => handleNav(e, link)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              {link.label}
            </a>
          ))}
          <div className="mt-3">
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
          </div>
        </div>
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link to={ROUTES.LOGIN} onClick={() => setMenuOpen(false)} className="block">
            <AppButton variant="outline" fullWidth className="!border-white/30 !text-white hover:!bg-white/10">Login</AppButton>
          </Link>
          <Link to={ROUTES.SIGNUP} onClick={() => setMenuOpen(false)} className="block">
            <AppButton variant="accent" fullWidth>Sign Up</AppButton>
          </Link>
        </div>
      </div>


      <main className="flex-1 w-full max-w-full overflow-x-hidden relative">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PublicLayout;
