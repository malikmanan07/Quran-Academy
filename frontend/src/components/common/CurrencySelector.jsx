import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../../hooks/useCurrency';

const CurrencySelector = () => {
  const { currency, setCurrency, currencies } = useCurrency();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const current = currencies[currency] || currencies['PKR'];
  
  const filtered = Object.entries(currencies).filter(([code, info]) => 
    code.toLowerCase().includes(search.toLowerCase()) || 
    info.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => { 
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all duration-200 cursor-pointer min-w-[90px] justify-between border border-transparent hover:border-white/20"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{current.flag}</span>
          <span>{currency}</span>
        </div>
        <svg 
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-[#E2E8F0] p-2 z-[100] animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="relative mb-2">
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              autoFocus
              type="text"
              placeholder="Search currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent text-[#1A1A2E]"
            />
          </div>

          <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {filtered.length > 0 ? (
              filtered.map(([code, info]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => { 
                    setCurrency(code); 
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group cursor-pointer ${
                    code === currency 
                      ? 'bg-[#00B4D8]/10 text-[#00B4D8] font-bold' 
                      : 'text-[#4A5568] hover:bg-[#F8FAFC] hover:text-[#1A1A2E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{info.flag}</span>
                    <div className="flex flex-col items-start">
                      <span className="font-bold">{code}</span>
                      <span className="text-[11px] opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">
                        {info.name}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[13px] font-medium ${code === currency ? 'opacity-100' : 'opacity-40'}`}>
                    {info.symbol}
                  </span>
                </button>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-[#9CA3AF]">
                No currencies found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
