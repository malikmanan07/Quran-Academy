import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { 
    code: 'en', 
    label: 'English', 
    nativeLabel: 'English',
    flag: '🇺🇸',
  },
  { 
    code: 'ur', 
    label: 'Urdu', 
    nativeLabel: 'اردو',
    flag: '🇵🇰',
  },
  { 
    code: 'ar', 
    label: 'Arabic', 
    nativeLabel: 'عربي',
    flag: '🇸🇦',
  },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentLang = languages.find(
    l => l.code === (i18n.language?.split('-')[0] || 'en')
  ) || languages[0];

  // Close on outside click:
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    
    const isRTL = code === 'ar' || code === 'ur';
    
    if (isRTL) {
      document.documentElement.setAttribute('lang', code);
      document.documentElement.removeAttribute('dir');
      document.body.classList.add('rtl-text');
      document.body.classList.remove('ltr-text');
    } else {
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.removeAttribute('dir');
      document.body.classList.remove('rtl-text');
      document.body.classList.add('ltr-text');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 
          rounded-lg text-sm font-medium
          text-white/80 hover:text-white
          hover:bg-white/10 transition-all duration-200
          border border-white/20"
        title="Change Language"
      >
        {/* Globe Icon SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        
        {/* Current language */}
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline">
          {currentLang.nativeLabel}
        </span>
        
        {/* Chevron */}
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          width="12" height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 
          w-48 bg-white rounded-xl shadow-lg 
          border border-gray-100 overflow-hidden
          z-[60] animate-fadeIn">
          
          {/* Header */}
          <div className="px-4 py-2 bg-gray-50 
            border-b border-gray-100">
            <p className="text-[10px] font-bold 
              text-gray-400 uppercase tracking-widest">
              Select Language
            </p>
          </div>

          {/* Language Options */}
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`w-full flex items-center 
                gap-3 px-4 py-3 text-left
                hover:bg-gray-50 transition-colors
                ${currentLang.code === lang.code
                  ? 'bg-[#00B4D8]/10 text-[#00B4D8] font-medium'
                  : 'text-gray-700'
                }`}
            >
              {/* Flag */}
              <span className="text-xl">{lang.flag}</span>
              
              {/* Labels */}
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {lang.nativeLabel}
                </span>
                <span className="text-xs text-gray-400 font-normal">
                  {lang.label}
                </span>
              </div>

              {/* Active checkmark */}
              {currentLang.code === lang.code && (
                <svg 
                  className="ml-auto text-[#00B4D8]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
