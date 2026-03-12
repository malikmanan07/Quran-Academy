const StatCardSkeleton = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded animate-pulse w-16"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-10"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCardSkeleton;
