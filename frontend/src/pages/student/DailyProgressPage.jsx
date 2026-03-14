import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import AppBadge from '../../components/common/AppBadge';
import DashboardLoadingSkeleton from '../../components/common/DashboardLoadingSkeleton';
import { getMyDailyProgress } from '../../features/dailyProgress/api';
import { formatDate } from '../../utils/formatDate';
import handleApiError from '../../utils/handleApiError';

const DailyProgressPage = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await getMyDailyProgress();
        setProgressData(res.data?.data?.progress || []);
      } catch (err) {
        showToast(handleApiError(err), 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const getGradeVariant = (grade) => {
    const g = grade?.toLowerCase() || '';
    if (g === 'excellent') return 'success';
    if (g === 'good') return 'info';
    if (g === 'poor') return 'danger';
    return 'warning';
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="My Sabaq Diary" subtitle="Review your daily lessons, sabqi, and manzil" />

      {loading ? (
        <DashboardLoadingSkeleton />
      ) : progressData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-8 text-center text-[#4A5568]">
          <span className="text-4xl block mb-2">📝</span>
          <p>You have no daily progress logged yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8FAFC] text-[#4A5568] font-medium border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Teacher</th>
                  <th className="px-6 py-4">Sabaq (Surah/Ayat)</th>
                  <th className="px-6 py-4">Grades (Sabaq/Sabqi/Manzil)</th>
                  <th className="px-6 py-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {progressData.map((record) => (
                  <tr key={record.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#1A1A2E]">{formatDate(record.date)}</td>
                    <td className="px-6 py-4 text-[#4A5568]">{record.teacherName || '-'}</td>
                    <td className="px-6 py-4 font-semibold text-[#1A1A2E]">
                      {record.sabaqSurah || '-'}
                      {record.sabaqAyatFrom || record.sabaqAyatTo ? ` (${record.sabaqAyatFrom || '*'} to ${record.sabaqAyatTo || '*'})` : ''}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <AppBadge variant={getGradeVariant(record.sabaqGrade)} size="sm">Sab: {record.sabaqGrade || '-'}</AppBadge>
                        <AppBadge variant={getGradeVariant(record.sabqiGrade)} size="sm">Sqi: {record.sabqiGrade || '-'}</AppBadge>
                        <AppBadge variant={getGradeVariant(record.manzilGrade)} size="sm">Man: {record.manzilGrade || '-'}</AppBadge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#4A5568] truncate max-w-[200px]" title={record.notes}>{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyProgressPage;
