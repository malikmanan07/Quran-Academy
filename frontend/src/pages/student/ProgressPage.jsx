import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import DashboardLoadingSkeleton from '../../components/common/DashboardLoadingSkeleton';
import ProgressStats from '../../components/student/progress/ProgressStats';
import ProgressTimeline from '../../components/student/progress/ProgressTimeline';
import QuranProgressMap from '../../components/common/QuranProgressMap';
import { getProgressByStudent } from '../../features/progress/api';
import { getMyQuranProgress } from '../../features/quranProgress/api';

const ProgressPage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [quranProg, setQuranProg] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try { 
        const [res, qRes] = await Promise.all([
          getProgressByStudent(),
          getMyQuranProgress().catch(() => ({ data: { data: { progress: [] } } })),
        ]);
        const list = res.data?.data?.progress || res.data?.progress || [];
        setProgress(list);
        setQuranProg(qRes.data?.data?.progress || []);
      } catch (err) {
        console.error('ProgressPage fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetch();
  }, [user]);

  if (loading) return <DashboardLoadingSkeleton />;

  return (
    <div>
      <PageHeader title="My Progress" subtitle="Track your learning journey" />
      <div className="mb-6">
        <QuranProgressMap progress={quranProg} />
      </div>
      <ProgressStats progress={progress} />
      <ProgressTimeline progress={progress} />
    </div>
  );
};

export default ProgressPage;
