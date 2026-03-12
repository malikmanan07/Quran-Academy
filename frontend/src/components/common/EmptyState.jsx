import AppButton from './AppButton';

const EmptyState = ({
  icon,
  title = 'No data found',
  message = 'There is nothing to display right now.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icon ? (
        <div className="text-gray-300 mb-4">{icon}</div>
      ) : (
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">{title}</h3>
      <p className="text-sm text-[#4A5568] mb-6 text-center max-w-sm">
        {message}
      </p>
      {actionLabel && onAction && (
        <AppButton variant="outline" onClick={onAction}>
          {actionLabel}
        </AppButton>
      )}
    </div>
  );
};

export default EmptyState;
