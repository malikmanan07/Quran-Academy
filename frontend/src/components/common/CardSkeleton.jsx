const CardSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2 py-2">
            <div className="h-3 bg-gray-50 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-50 rounded animate-pulse w-5/6"></div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-24"></div>
            <div className="h-8 bg-gray-100 rounded-lg animate-pulse w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
