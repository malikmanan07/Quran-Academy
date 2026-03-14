import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const CurrencyContext = createContext();

const CURRENCIES = {
  PKR: { symbol: 'Rs.', name: 'Pakistani Rupee', flag: '🇵🇰' },
  USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  SAR: { symbol: 'SR', name: 'Saudi Riyal', flag: '🇸🇦' },
  AED: { symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  BDT: { symbol: '৳', name: 'Bangladeshi Taka', flag: '🇧🇩' },
  INR: { symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  EGP: { symbol: 'E£', name: 'Egyptian Pound', flag: '🇪🇬' },
  JOD: { symbol: 'JD', name: 'Jordanian Dinar', flag: '🇯🇴' },
  NGN: { symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
  ZAR: { symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  TRY: { symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿' },
  KWD: { symbol: 'KD', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
  QAR: { symbol: 'QR', name: 'Qatari Riyal', flag: '🇶🇦' },
  OMR: { symbol: 'OMR', name: 'Omani Rial', flag: '🇴🇲' },
  BHD: { symbol: 'BD', name: 'Bahraini Dinar', flag: '🇧🇭' },
};

const COUNTRY_CURRENCY = {
  PK: 'PKR', US: 'USD', GB: 'GBP',
  SA: 'SAR', AE: 'AED', DE: 'EUR',
  FR: 'EUR', IT: 'EUR', ES: 'EUR',
  CA: 'CAD', AU: 'AUD', MY: 'MYR',
  ID: 'IDR', BD: 'BDT', IN: 'INR',
  EG: 'EGP', JO: 'JOD', NG: 'NGN',
  ZA: 'ZAR', SG: 'SGD', TR: 'TRY',
  NZ: 'NZD', KW: 'KWD', QA: 'QAR',
  OM: 'OMR', BH: 'BHD',
};

export const TIMEZONE_CURRENCY = {
  'Asia/Karachi': 'PKR',
  'America/New_York': 'USD',
  'America/Chicago': 'USD',
  'America/Los_Angeles': 'USD',
  'Europe/London': 'GBP',
  'Asia/Riyadh': 'SAR',
  'Asia/Dubai': 'AED',
  'Europe/Berlin': 'EUR',
  'Europe/Paris': 'EUR',
  'America/Toronto': 'CAD',
  'Australia/Sydney': 'AUD',
  'Asia/Kuala_Lumpur': 'MYR',
  'Asia/Jakarta': 'IDR',
  'Asia/Dhaka': 'BDT',
  'Asia/Kolkata': 'INR',
  'Africa/Cairo': 'EGP',
  'Asia/Amman': 'JOD',
  'Africa/Lagos': 'NGN',
  'Africa/Johannesburg': 'ZAR',
  'Asia/Singapore': 'SGD',
  'Europe/Istanbul': 'TRY',
  'Pacific/Auckland': 'NZD',
  'Asia/Kuwait': 'KWD',
  'Asia/Qatar': 'QAR',
  'Asia/Muscat': 'OMR',
  'Asia/Bahrain': 'BHD',
};

const getDefaultCurrency = () => {
  // 1. FIRST check timezone (most accurate)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (TIMEZONE_CURRENCY[tz]) return TIMEZONE_CURRENCY[tz];
  
  // 2. Then check localStorage
  const saved = localStorage.getItem('qa_currency');
  if (saved && CURRENCIES[saved]) return saved;
  
  // 3. Default USD
  return 'USD';
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(getDefaultCurrency());
  const [rates, setRates] = useState(null);

  const fetchRates = async () => {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/PKR');
      const data = await res.json();
      setRates(data.rates);
      localStorage.setItem('qa_rates', JSON.stringify(data.rates));
      localStorage.setItem('qa_rates_time', Date.now().toString());
    } catch {
      const cached = localStorage.getItem('qa_rates');
      if (cached) setRates(JSON.parse(cached));
    }
  };

  useEffect(() => {
    const lastFetch = localStorage.getItem('qa_rates_time');
    const sixHours = 6 * 60 * 60 * 1000;
    if (!lastFetch || Date.now() - Number(lastFetch) > sixHours) {
      fetchRates();
    } else {
      const cached = localStorage.getItem('qa_rates');
      if (cached) setRates(JSON.parse(cached));
    }
  }, []);

  const formatCurrency = useCallback((amountPKR) => {
    if (amountPKR === undefined || amountPKR === null) return '';
    if (!rates) return `Rs. ${amountPKR}`;
    
    const pkrRate = rates['PKR'] || 1;
    const targetRate = rates[currency] || 1;
    const converted = (amountPKR / pkrRate) * targetRate;
    
    const info = CURRENCIES[currency];
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(Math.round(converted));
    
    return `${info.symbol} ${formatted}`;
  }, [currency, rates]);

  const updateCurrency = useCallback((newCurrency) => {
    if (!CURRENCIES[newCurrency]) return;
    setCurrencyState(newCurrency);
    localStorage.setItem('qa_currency', newCurrency);
  }, []);

  const setCurrencyByCountry = useCallback((countryCode) => {
    const matchedCurrency = COUNTRY_CURRENCY[countryCode] || 'USD';
    updateCurrency(matchedCurrency);
  }, [updateCurrency]);

  return (
    <CurrencyContext.Provider value={{
      currency,
      currencies: CURRENCIES,
      rates,
      formatCurrency,
      setCurrency: updateCurrency,
      setCurrencyByCountry,
      currencyInfo: CURRENCIES[currency],
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
