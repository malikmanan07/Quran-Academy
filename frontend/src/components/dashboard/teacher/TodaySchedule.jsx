import AppBadge from '../../common/AppBadge';
import SmartJoinButton from '../../common/SmartJoinButton';
import TableSkeleton from '../../common/TableSkeleton';

const TodaySchedule = ({ classes, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
    <div className="p-5 border-b border-[#E2E8F0]">
      <h3 className="text-base font-semibold text-[#1A1A2E]">Today's Schedule</h3>
    </div>
    <div className="divide-y divide-[#E2E8F0]">
      {loading ? (
        <TableSkeleton rows={3} cols={3} />
      ) : (!classes || classes.length === 0) ? (
        <div className="p-8 text-center text-sm text-[#4A5568]">No classes scheduled for today</div>
      ) : (
        classes.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-4 hover:bg-[#F0F4F8]/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {c.studentName?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A2E] truncate">{c.studentName || 'Student'} — {c.courseName || 'Course'}</p>
              <p className="text-xs text-[#4A5568]">{c.time || '—'} • {c.duration || '45min'}</p>
            </div>
            <div className="flex items-center gap-2">
              <AppBadge status={c.status === 'completed' || c.status === 'Completed' ? 'Active' : c.status === 'cancelled' || c.status === 'Cancelled' ? 'Inactive' : 'Pending'} />
              <SmartJoinButton 
                meetingLink={c.meetingLink} 
                meetingPlatform={c.meetingPlatform} 
                date={c.date} 
                time={c.time} 
                status={c.status} 
              />
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default TodaySchedule;
