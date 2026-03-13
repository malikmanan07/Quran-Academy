export const convertPrice = (amountPKR, targetCurrency, rates) => {
  if (!rates || targetCurrency === 'PKR') return amountPKR;
  const rate = rates[targetCurrency];
  if (!rate) return amountPKR;
  return Math.round(amountPKR * rate * 100) / 100;
};

export const formatCurrency = (amount, currency = 'PKR') => {
  const symbols = {
    PKR: 'PKR', USD: '$', GBP: '£', SAR: 'SAR', AED: 'AED', EUR: '€',
  };
  const symbol = symbols[currency] || currency;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency === 'PKR' ? 0 : 2,
    maximumFractionDigits: currency === 'PKR' ? 0 : 2,
  }).format(amount);
  return `${symbol} ${formatted}`;
};
