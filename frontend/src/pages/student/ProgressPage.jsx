import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import StatCardSkeleton from '../../components/common/StatCardSkeleton';
import TableSkeleton from '../../components/common/TableSkeleton';
import ProgressStats from '../../components/student/progress/ProgressStats';
import ProgressTimeline from '../../components/student/progress/ProgressTimeline';
import QuranProgressMap from '../../components/common/QuranProgressMap';
import MonthlyFeedbackList from '../../components/common/MonthlyFeedbackList';
import { getProgressByStudent } from '../../features/progress/api';
import { getMyQuranProgress } from '../../features/quranProgress/api';
import http from '../../services/http';

const ProgressPage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [quranProg, setQuranProg] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try { 
        const [res, qRes, fRes] = await Promise.all([
          getProgressByStudent(),
          getMyQuranProgress().catch(() => ({ data: { data: { progress: [] } } })),
          http.get('feedback/my-feedback').catch(() => ({ data: { data: { feedback: [] } } })),
        ]);
        const list = res.data?.data?.progress || res.data?.progress || [];
        setProgress(list);
        setQuranProg(qRes.data?.data?.progress || []);
        setFeedback(fRes.data?.data?.feedback || []);
      } catch (err) {
        console.error('ProgressPage fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetch();
  }, [user]);

  return (
    <div>
      <PageHeader title="My Progress" subtitle="Track your learning journey" />
      <div className="mb-6">
        <QuranProgressMap progress={quranProg} />
      </div>
      {loading ? <StatCardSkeleton /> : <ProgressStats progress={progress} />}
      
      <div className="mt-12 mb-8">
        <h3 className="text-xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-2">
          <span>🌟</span> Teacher's Monthly Reports
        </h3>
        <MonthlyFeedbackList feedback={feedback} />
      </div>

      {loading ? <TableSkeleton /> : <ProgressTimeline progress={progress} />}
    </div>
  );
};

export default ProgressPage;
