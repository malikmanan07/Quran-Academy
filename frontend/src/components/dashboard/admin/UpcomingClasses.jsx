import AppBadge from '../../common/AppBadge';

const UpcomingClasses = ({ classes = [] }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
    <div className="p-5 border-b border-[#E2E8F0]">
      <h3 className="text-base font-semibold text-[#1A1A2E]">Today's Classes</h3>
    </div>
    <div className="divide-y divide-[#E2E8F0]">
      {classes.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#4A5568]">No classes scheduled for today</div>
      ) : (
        classes.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-4 hover:bg-[#F0F4F8]/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {c.teacherName?.charAt(0) || 'T'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A2E] truncate">{c.studentName || 'Student'} — {c.courseName || 'Course'}</p>
              <p className="text-xs text-[#4A5568]">{c.teacherName || 'Teacher'} • {c.time || '—'}</p>
            </div>
            <AppBadge status={c.status === 'completed' || c.status === 'Completed' ? 'Active' : 'Pending'} />
          </div>
        ))
      )}
    </div>
  </div>
);

export default UpcomingClasses;
