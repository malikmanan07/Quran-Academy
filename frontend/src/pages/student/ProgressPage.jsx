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
      setLoading(true);
      try { 
        const res = await getProgressByStudent();
        // Extract from response.data (axios) -> .data (backend) -> .progress
        const list = res.data?.data?.progress || res.data?.progress || [];
        setProgress(list);
      } catch (err) {
        console.error('ProgressPage fetch error:', err);
      } finally {
        setLoading(false);
      }
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
