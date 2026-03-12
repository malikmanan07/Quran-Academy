import { Link } from 'react-router-dom';
import AppButton from '../../common/AppButton';
import { ROUTES } from '../../../constants/routes';
import TableSkeleton from '../../common/TableSkeleton';

const MyStudentsList = ({ students, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
    <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
      <h3 className="text-base font-semibold text-[#1A1A2E]">My Students</h3>
      <Link to={ROUTES.TEACHER_STUDENTS}><AppButton variant="outline" size="sm">View All</AppButton></Link>
    </div>
    <div className="divide-y divide-[#E2E8F0]">
      {loading ? (
        <TableSkeleton rows={3} cols={3} />
      ) : (!students || students.length === 0) ? (
        <div className="p-8 text-center text-sm text-[#4A5568]">No students assigned</div>
      ) : (
        students.slice(0, 5).map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-4 hover:bg-[#F0F4F8]/50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#00B4D8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {s.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A2E] truncate">{s.name}</p>
              <p className="text-xs text-[#4A5568]">{s.courseName || 'Course'}</p>
            </div>
            <div className="w-20">
              <div className="flex justify-between text-xs text-[#4A5568] mb-1">
                <span>{s.progress || 0}%</span>
              </div>
              <div className="w-full bg-[#E2E8F0] rounded-full h-1.5">
                <div className="bg-[#00B4D8] h-1.5 rounded-full" style={{ width: `${s.progress || 0}%` }} />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default MyStudentsList;
