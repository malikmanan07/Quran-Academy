import AppBadge from './AppBadge';
import { formatDate } from '../../utils/formatDate';

const MonthlyFeedbackList = ({ feedback, loading }) => {
  if (loading) return <div className="space-y-4">{[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />)}</div>;

  if (!feedback || feedback.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] text-center">
        <p className="text-[#4A5568]">No monthly reports available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((report) => (
        <div key={report.id} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-bold text-[#1A1A2E]">
                {new Date(0, report.month - 1).toLocaleString('default', { month: 'long' })} {report.year} Report
              </h4>
              <p className="text-xs text-[#4A5568]">Submitted on {formatDate(report.createdAt)}</p>
            </div>
            <AppBadge
              status={report.overallGrade === 'excellent' ? 'Active' : report.overallGrade === 'good' ? 'Info' : 'Warning'}
            >
              {report.overallGrade.toUpperCase()}
            </AppBadge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-[#1A1A2E]">Lesson Progress (Sabaq)</p>
              <p className="text-[#4A5568] bg-gray-50 p-3 rounded-xl">{report.sabaqProgress}</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-[#1A1A2E]">Tajweed & Technique</p>
              <p className="text-[#4A5568] bg-gray-50 p-3 rounded-xl">{report.tajweedProgress || 'No specific notes'}</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-[#1A1A2E]">Behavior & Discipline</p>
              <p className="text-[#4A5568] bg-gray-50 p-3 rounded-xl">{report.behavior || 'Good'}</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-[#1A1A2E]">Teacher's Recommendations</p>
              <p className="text-[#1B3A5C] bg-blue-50/50 p-3 rounded-xl font-medium">{report.recommendations}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthlyFeedbackList;
