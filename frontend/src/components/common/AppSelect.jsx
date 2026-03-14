const AppSelect = ({
  label,
  name,
  options = [],
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-[#1A1A2E] mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#1A1A2E] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none cursor-pointer ${
          error
            ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500'
            : 'border-[#E2E8F0]'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={`${opt.value}-${opt.label}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default AppSelect;
