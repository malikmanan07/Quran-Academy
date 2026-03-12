import { formatDate } from '../../../utils/formatDate';

const ratingColor = (r) => {
  const n = Number(r) || 0;
  if (n >= 5) return 'border-green-400 bg-green-50';
  if (n >= 3) return 'border-amber-400 bg-amber-50';
  return 'border-red-400 bg-red-50';
};

const stars = (n) => '⭐'.repeat(Math.min(n || 0, 5));

const ProgressTimeline = ({ progress }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
    <div className="p-5 border-b border-[#E2E8F0]">
      <h3 className="text-base font-semibold text-[#1A1A2E]">Progress Timeline</h3>
    </div>
    {(!progress || progress.length === 0) ? (
      <div className="p-8 text-center text-sm text-[#4A5568]">No progress entries yet</div>
    ) : (
      <div className="p-4 space-y-4">
        {progress.map((r, i) => (
          <div key={i} className={`flex gap-4 p-4 rounded-xl border-l-4 ${ratingColor(r.rating)}`}>
            <div className="text-center min-w-[60px]">
              <p className="text-xs font-semibold text-[#1A1A2E]">{formatDate(r.createdAt)}</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-[#1A1A2E]">{r.lesson || r.title || 'Lesson'}</p>
                <span className="text-xs">{stars(r.rating)}</span>
              </div>
              <p className="text-xs text-[#4A5568]">{r.remarks || 'No remarks'}</p>
              {r.teacherName && <p className="text-xs text-[#4A5568] mt-1">By {r.teacherName}</p>}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ProgressTimeline;
