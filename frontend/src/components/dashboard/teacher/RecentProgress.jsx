import { Link } from 'react-router-dom';
import AppButton from '../../common/AppButton';
import { ROUTES } from '../../../constants/routes';
import { formatDate } from '../../../utils/formatDate';

const stars = (n) => '⭐'.repeat(Math.min(n || 0, 5));

const RecentProgress = ({ reports }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
    <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
      <h3 className="text-base font-semibold text-[#1A1A2E]">Recent Progress Reports</h3>
      <Link to={ROUTES.TEACHER_PROGRESS}><AppButton variant="outline" size="sm">View All</AppButton></Link>
    </div>
    <div className="divide-y divide-[#E2E8F0]">
      {(!reports || reports.length === 0) ? (
        <div className="p-8 text-center text-sm text-[#4A5568]">No progress reports yet</div>
      ) : (
        reports.slice(0, 5).map((r, i) => (
          <div key={i} className="flex items-center gap-3 p-4 hover:bg-[#F0F4F8]/50 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A2E]">{r.studentName || 'Student'}</p>
              <p className="text-xs text-[#4A5568]">{r.lesson || r.title || 'Lesson'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs">{stars(r.rating)}</p>
              <p className="text-xs text-[#4A5568]">{formatDate(r.createdAt)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default RecentProgress;
