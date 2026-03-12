import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import ProgressStats from '../../components/student/progress/ProgressStats';
import ProgressTimeline from '../../components/student/progress/ProgressTimeline';
import { getProgressByStudent } from '../../features/progress/api';

const ProgressPage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await getProgressByStudent(); setProgress(data.progress || []); }
      catch { /* silent */ }
      setLoading(false);
    };
    if (user?.id) fetch();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHeader title="My Progress" subtitle="Track your learning journey" />
      <ProgressStats progress={progress} />
      <ProgressTimeline progress={progress} />
    </div>
  );
};

export default ProgressPage;
