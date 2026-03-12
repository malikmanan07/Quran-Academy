const variants = {
  primary: 'bg-[#1B3A5C] text-white hover:bg-[#153050] focus:ring-[#1B3A5C]',
  secondary: 'bg-[#1B4332] text-white hover:bg-[#153828] focus:ring-[#1B4332]',
  accent: 'bg-[#00B4D8] text-white hover:bg-[#009BB8] focus:ring-[#00B4D8]',
  outline:
    'border-2 border-[#1B3A5C] text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white focus:ring-[#1B3A5C]',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const AppButton = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  fullWidth = false,
}) => {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};

export default AppButton;
