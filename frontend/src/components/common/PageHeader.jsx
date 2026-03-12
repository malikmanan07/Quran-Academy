import AppButton from './AppButton';

const PageHeader = ({ title, subtitle, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-6 border-b border-[#E2E8F0]">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[#4A5568] mt-0.5">{subtitle}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <AppButton
          variant="primary"
          onClick={onAction}
          className="w-full sm:w-auto"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {actionLabel}
        </AppButton>
      )}
    </div>
  );
};

export default PageHeader;
