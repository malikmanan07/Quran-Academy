import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import { formatDate } from '../../../utils/formatDate';
import TableSkeleton from '../../common/TableSkeleton';

const UpcomingClasses = ({ classes, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
    <div className="p-5 border-b border-[#E2E8F0]">
      <h3 className="text-base font-semibold text-[#1A1A2E]">Upcoming Classes</h3>
    </div>
    <div className="divide-y divide-[#E2E8F0]">
      {loading ? (
        <TableSkeleton rows={3} cols={3} />
      ) : (!classes || classes.length === 0) ? (
        <div className="p-8 text-center text-sm text-[#4A5568]">No upcoming classes</div>
      ) : (
        classes.slice(0, 5).map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-4 hover:bg-[#F0F4F8]/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B4332] to-[#1B3A5C] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {c.teacherName?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A2E] truncate">{c.courseName || 'Course'}</p>
              <p className="text-xs text-[#4A5568]">{c.teacherName || 'Teacher'} • {formatDate(c.date)} {c.time || ''}</p>
            </div>
            {c.meetingLink && (
              <a href={c.meetingLink} target="_blank" rel="noopener noreferrer">
                <AppButton variant="accent" size="sm">Join</AppButton>
              </a>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);

export default UpcomingClasses;
