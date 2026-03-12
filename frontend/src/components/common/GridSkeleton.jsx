const GridSkeleton = ({ items = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="h-48 bg-[#F1F5F9]" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-[#F1F5F9] rounded w-3/4" />
            <div className="h-4 bg-[#F1F5F9] rounded w-1/2" />
            <div className="flex justify-between items-center pt-4 border-t border-[#F1F5F9]">
              <div className="h-6 bg-[#F1F5F9] rounded w-20" />
              <div className="h-8 bg-[#F1F5F9] rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridSkeleton;
