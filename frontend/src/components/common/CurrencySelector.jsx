import { useState, useRef, useEffect } from 'react';

const currencies = [
  { code: 'PKR', flag: '🇵🇰', label: 'PKR' },
  { code: 'USD', flag: '🇺🇸', label: 'USD' },
  { code: 'GBP', flag: '🇬🇧', label: 'GBP' },
  { code: 'SAR', flag: '🇸🇦', label: 'SAR' },
  { code: 'AED', flag: '🇦🇪', label: 'AED' },
  { code: 'EUR', flag: '🇪🇺', label: 'EUR' },
];

const CurrencySelector = ({ currency, setCurrency }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = currencies.find(c => c.code === currency) || currencies[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors cursor-pointer"
      >
        <span>{current.flag}</span>
        <span>{current.code}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-1 z-50 min-w-[120px]">
          {currencies.map(c => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#F0F4F8] transition-colors cursor-pointer ${
                c.code === currency ? 'bg-[#F0F4F8] font-semibold text-[#00B4D8]' : 'text-[#1A1A2E]'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
