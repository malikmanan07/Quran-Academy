import { Link } from 'react-router-dom';
import AppButton from '../../common/AppButton';
import { ROUTES } from '../../../constants/routes';
import { formatDate } from '../../../utils/formatDate';
import TableSkeleton from '../../common/TableSkeleton';

const stars = (n) => '⭐'.repeat(Math.min(n || 0, 5));

const MyProgressSummary = ({ progress, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
    <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
      <h3 className="text-base font-semibold text-[#1A1A2E]">My Progress</h3>
      <Link to={ROUTES.STUDENT_PROGRESS}><AppButton variant="outline" size="sm">View All</AppButton></Link>
    </div>
    <div className="divide-y divide-[#E2E8F0]">
      {loading ? (
        <TableSkeleton rows={3} cols={2} />
      ) : (!progress || progress.length === 0) ? (
        <div className="p-8 text-center text-sm text-[#4A5568]">No progress reports yet</div>
      ) : (
        progress.slice(0, 5).map((r, i) => (
          <div key={i} className="p-4 hover:bg-[#F0F4F8]/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-[#1A1A2E]">{r.lesson || r.title || 'Lesson'}</p>
              <span className="text-xs">{stars(r.rating)}</span>
            </div>
            <p className="text-xs text-[#4A5568]">{r.remarks || 'No remarks'}</p>
            <p className="text-xs text-[#4A5568] mt-1">{formatDate(r.createdAt)}</p>
          </div>
        ))
      )}
    </div>
  </div>
);

export default MyProgressSummary;
