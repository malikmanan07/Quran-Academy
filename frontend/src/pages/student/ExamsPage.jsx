import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import AppModal from '../../components/common/AppModal';
import ExamCard from '../../components/student/exams/ExamCard';
import ExamResultCard from '../../components/student/exams/ExamResultCard';
import { getExamsByStudent } from '../../features/exams/api';

const tabs = ['Upcoming', 'Results'];

const ExamsPage = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Upcoming');
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await getExamsByStudent(); setExams(data.exams || []); }
      catch { /* silent */ }
      setLoading(false);
    };
    if (user?.id) fetch();
  }, [user]);

  if (loading) return <Loader />;

  const upcoming = exams.filter(e => e.status !== 'completed');
  const completed = exams.filter(e => e.status === 'completed');
  const current = tab === 'Upcoming' ? upcoming : completed;

  return (
    <div>
      <PageHeader title="My Exams" subtitle="View upcoming exams and results" />
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-[#E2E8F0] mb-6 w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === t ? 'bg-[#1B3A5C] text-white' : 'text-[#4A5568] hover:bg-[#F0F4F8]'
            }`}>{t}</button>
        ))}
      </div>
      {current.length === 0 ? (
        <EmptyState title={`No ${tab} Exams`} message={tab === 'Upcoming' ? 'No exams scheduled.' : 'No completed exams yet.'} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {current.map((e) => <ExamCard key={e.id} exam={e} onViewResult={setSelectedExam} />)}
        </div>
      )}
      <AppModal show={!!selectedExam} onClose={() => setSelectedExam(null)} title="Exam Result">
        {selectedExam && <ExamResultCard exam={selectedExam} />}
      </AppModal>
    </div>
  );
};

export default ExamsPage;
