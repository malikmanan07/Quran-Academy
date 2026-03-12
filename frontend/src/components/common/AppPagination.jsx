import { usePagination } from '../../hooks/usePagination';

const AppPagination = ({ total, page, pageSize, onPageChange, onPageSizeChange }) => {
  const { paginationRange, hasNext, hasPrev } = usePagination(total, page, pageSize);

  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mt-2">
      <div className="text-sm text-[#4A5568]">
        Showing <span className="font-semibold text-[#1A1A2E]">{start}-{end}</span> of{' '}
        <span className="font-semibold text-[#1A1A2E]">{total}</span> results
      </div>

      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="mr-4 px-2 py-1.5 border border-[#E2E8F0] rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#00B4D8]"
        >
          {[10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>

        <div className="flex items-center bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrev}
            className={`px-3 py-2 text-[#4A5568] hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            ←
          </button>
          
          <div className="flex border-x border-[#E2E8F0]">
            {paginationRange.map((p, idx) => (
              <button
                key={idx}
                onClick={() => typeof p === 'number' && onPageChange(p)}
                disabled={p === '...'}
                className={`w-9 h-9 flex items-center justify-center text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-[#1B3A5C] text-white'
                    : p === '...'
                    ? 'cursor-default'
                    : 'text-[#4A5568] hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNext}
            className={`px-3 py-2 text-[#4A5568] hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppPagination;
