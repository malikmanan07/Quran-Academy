import StatCardSkeleton from './StatCardSkeleton';
import TableSkeleton from './TableSkeleton';

const DashboardLoadingSkeleton = () => {
  return (
    <div className="animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-6 border-b border-[#E2E8F0]">
        <div className="space-y-2">
          <div className="h-7 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-64 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-full sm:w-32 animate-pulse" />
      </div>

      {/* Stats Grid */}
      <StatCardSkeleton />

      {/* Content Area */}
      <div className="space-y-6">
        <TableSkeleton rows={8} />
      </div>
    </div>
  );
};

export default DashboardLoadingSkeleton;
