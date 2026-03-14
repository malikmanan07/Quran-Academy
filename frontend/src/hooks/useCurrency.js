import { useContext } from 'react';
import { CurrencyContext } from '../context/CurrencyContext';

// We keep this hook as a wrapper to avoid breaking existing imports
// But now it uses the global context instead of local state
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // This can happen if used outside Provider, but here we already have it in main.jsx
    return { rates: null, currency: 'USD', setCurrency: () => {}, formatAmount: (v) => `$${v}` };
  }
  return context;
};
