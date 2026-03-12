import AppBadge from '../../common/AppBadge';

const getGrade = (pct) => {
  if (pct >= 90) return { grade: 'A+', color: 'text-green-600' };
  if (pct >= 80) return { grade: 'A', color: 'text-green-600' };
  if (pct >= 70) return { grade: 'B', color: 'text-blue-600' };
  if (pct >= 60) return { grade: 'C', color: 'text-amber-600' };
  return { grade: 'F', color: 'text-red-600' };
};

const ExamResultCard = ({ exam, onClose }) => {
  const pct = exam.totalMarks ? Math.round((exam.obtainedMarks / exam.totalMarks) * 100) : 0;
  const { grade, color } = getGrade(pct);
  const passed = pct >= 50;

  return (
    <div className="text-center">
      <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold ${color} border-4 ${passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        {grade}
      </div>
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">{exam.title}</h3>
      <p className="text-3xl font-bold text-[#1A1A2E] mb-1">
        {exam.obtainedMarks || 0} <span className="text-base text-[#4A5568] font-normal">/ {exam.totalMarks || 0}</span>
      </p>
      <p className="text-sm text-[#4A5568] mb-3">{pct}% Score</p>
      <AppBadge status={passed ? 'Active' : 'Inactive'} className="mb-4" />
      {exam.remarks && <p className="text-sm text-[#4A5568] mt-4 bg-[#F0F4F8] p-3 rounded-lg">{exam.remarks}</p>}
    </div>
  );
};

export default ExamResultCard;
