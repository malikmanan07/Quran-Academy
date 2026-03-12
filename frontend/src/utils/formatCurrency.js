export const formatPKR = (amount) => {
  if (amount === null || amount === undefined) return 'PKR 0';
  const num = Number(amount);
  if (isNaN(num)) return 'PKR 0';
  return `PKR ${num.toLocaleString('en-PK')}`;
};
