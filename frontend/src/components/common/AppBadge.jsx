const statusStyles = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  inactive: 'bg-red-100 text-red-700 border-red-200',
  danger: 'bg-red-100 text-red-700 border-red-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  unpaid: 'bg-red-100 text-red-700 border-red-200',
  regular: 'bg-blue-100 text-blue-700 border-blue-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
  accent: 'bg-purple-100 text-purple-700 border-purple-200',
  error: 'bg-red-100 text-red-700 border-red-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
};

const AppBadge = ({ 
  status, 
  variant, 
  size = 'md', 
  className = '', 
  children 
}) => {
  const badgeStatus = variant || status || 'pending';
  const key = badgeStatus.toLowerCase();
  const style = statusStyles[key] || statusStyles.pending;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${sizeClasses[size]} ${style} ${className}`}
    >
      {children || status}
    </span>
  );
};

export default AppBadge;
