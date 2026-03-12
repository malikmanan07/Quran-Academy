const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-[#E2E8F0] overflow-hidden animate-pulse">
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-6 py-4">
        <div className="flex gap-4">
          {[...Array(cols)].map((_, i) => (
            <div key={i} className="h-4 bg-[#E2E8F0] rounded w-full" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-[#E2E8F0]">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-6 py-5 flex gap-4">
            {[...Array(cols)].map((_, j) => (
              <div key={j} className="h-4 bg-[#F1F5F9] rounded w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
