import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  return { toast, showToast };
};

const Toast = ({ toast }) => {
  if (!toast) return null;
  const bg = toast.type === 'success'
    ? 'bg-green-600'
    : toast.type === 'error'
    ? 'bg-red-600'
    : 'bg-[#00B4D8]';

  return (
    <div className={`fixed top-20 right-4 z-[100] ${bg} text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-in flex items-center gap-2 min-w-[250px]`}>
      <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
      {toast.message}
    </div>
  );
};

export default Toast;
