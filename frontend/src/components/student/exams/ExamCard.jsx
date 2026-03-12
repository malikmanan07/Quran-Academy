import AppBadge from '../../common/AppBadge';
import { formatDate } from '../../../utils/formatDate';

const ExamCard = ({ exam, onViewResult }) => (
  <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all">
    <div className="bg-gradient-to-br from-[#1B3A5C] to-[#00B4D8] p-5 text-center text-white">
      <span className="text-3xl block mb-1">📝</span>
      <p className="text-sm font-medium">{exam.courseName || 'Course'}</p>
    </div>
    <div className="p-4">
      <h3 className="text-sm font-semibold text-[#1A1A2E] mb-2">{exam.title || 'Exam'}</h3>
      <div className="flex items-center gap-2 text-xs text-[#4A5568] mb-2">
        <span>📅 {formatDate(exam.date)}</span>
        {exam.duration && <span>⏱ {exam.duration}</span>}
      </div>
      <AppBadge status={exam.status === 'completed' ? 'Completed' : 'Pending'} />
      {exam.status === 'completed' && onViewResult && (
        <button onClick={() => onViewResult(exam)}
          className="mt-3 w-full py-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] text-sm font-medium hover:bg-[#00B4D8]/20 transition-colors cursor-pointer">
          View Result
        </button>
      )}
    </div>
  </div>
);

export default ExamCard;
