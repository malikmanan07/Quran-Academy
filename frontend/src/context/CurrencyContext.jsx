import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const CurrencyContext = createContext();

const CACHE_KEY = 'qa_exchange_rates';
const CACHE_CURRENCY = 'qa_selected_currency';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const tzToCurrency = (tz) => {
  if (tz?.startsWith('Asia/Karachi')) return 'PKR';
  if (tz?.startsWith('America/')) return 'USD';
  if (tz?.startsWith('Europe/London')) return 'GBP';
  if (tz?.startsWith('Asia/Riyadh')) return 'SAR';
  if (tz?.startsWith('Asia/Dubai')) return 'AED';
  if (tz?.startsWith('Europe/')) return 'EUR';
  return 'USD';
};

export const CurrencyProvider = ({ children }) => {
  const [rates, setRates] = useState({ PKR: 1, USD: 0.0036, GBP: 0.0028, SAR: 0.013, AED: 0.013, EUR: 0.0033 });
  const [currency, setCurrencyState] = useState(() => {
    const saved = localStorage.getItem(CACHE_CURRENCY);
    if (saved) return saved;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tzToCurrency(tz);
  });

  const fetchRates = useCallback(async () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setRates(data);
          return;
        }
      }
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/PKR');
      const json = await res.json();
      const data = json.rates || {};
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      setRates(data);
    } catch {
      setRates({ PKR: 1, USD: 0.0036, GBP: 0.0028, SAR: 0.013, AED: 0.013, EUR: 0.0033 });
    }
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const setCurrency = (c) => {
    setCurrencyState(c);
    localStorage.setItem(CACHE_CURRENCY, c);
  };

  const formatAmount = useCallback((amount) => {
    if (amount === undefined || amount === null) return '';
    const rate = rates[currency] || 1;
    const value = amount * rate;
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'PKR' ? 0 : 2,
        maximumFractionDigits: currency === 'PKR' ? 0 : 2,
      }).format(value);
    } catch (e) {
      return `${currency} ${value.toFixed(2)}`;
    }
  }, [rates, currency]);

  return (
    <CurrencyContext.Provider value={{ rates, currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
