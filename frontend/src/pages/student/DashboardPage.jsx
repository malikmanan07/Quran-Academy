import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClassesByStudent } from '../../features/classes/api';
import { getProgressByStudent } from '../../features/progress/api';
import { getPaymentsByStudent } from '../../features/payments/api';
import { getMaterialsByStudent } from '../../features/materials/api';
import { getMyQuranProgress } from '../../features/quranProgress/api';
import StudentStatsCards from '../../components/dashboard/student/StudentStatsCards';
import UpcomingClasses from '../../components/dashboard/student/UpcomingClasses';
import MyProgressSummary from '../../components/dashboard/student/MyProgressSummary';
import RecentMaterials from '../../components/dashboard/student/RecentMaterials';
import MyCertificates from '../../components/student/MyCertificates';
import QuranProgressMap from '../../components/common/QuranProgressMap';
import StatCardSkeleton from '../../components/common/StatCardSkeleton';
import TableSkeleton from '../../components/common/TableSkeleton';

const DashboardPage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quranProg, setQuranProg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ attended: 0, pendingPayments: 0, progress: 0, materials: 0 });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [cRes, pRes, payRes, mRes, qRes] = await Promise.all([
          getClassesByStudent().catch(() => ({ data: { data: { classes: [] } } })),
          getProgressByStudent().catch(() => ({ data: { data: { progress: [] } } })),
          getPaymentsByStudent().catch(() => ({ data: { data: { payments: [] } } })),
          getMaterialsByStudent().catch(() => ({ data: { data: { materials: [] } } })),
          getMyQuranProgress().catch(() => ({ data: { data: { progress: [] } } })),
        ]);

        const cls = cRes.data?.data?.classes || cRes.data?.classes || [];
        const prg = pRes.data?.data?.progress || pRes.data?.progress || [];
        const pays = payRes.data?.data?.payments || payRes.data?.payments || [];
        const mats = mRes.data?.data?.materials || mRes.data?.data || mRes.data?.materials || [];
        const qp = qRes.data?.data?.progress || [];

        setClasses(cls);
        setProgress(prg);
        setMaterials(mats);
        setQuranProg(qp);
        
        setStats({
          attended: cls.filter(x => x.status === 'completed' || x.status === 'Completed').length,
          pendingPayments: pays.filter(x => x.status !== 'Paid' && x.status !== 'paid').length,
          progress: prg.length > 0 ? Math.round(prg.reduce((a, x) => a + (Number(x.rating) || 0), 0) / prg.length * 20) : 0,
          materials: mats.length,
        });
      } catch (err) {
        console.error('Student Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetch();
  }, [user]);

  const today = new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">Welcome, {user?.name} 👋</h1>
        <p className="text-sm text-[#4A5568]">{today}</p>
      </div>
      {loading ? <StatCardSkeleton /> : <StudentStatsCards data={stats} loading={loading} />}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {loading ? <TableSkeleton /> : <UpcomingClasses classes={classes.filter(c => c.status === 'scheduled' || c.status === 'Scheduled')} loading={loading} />}
        <MyProgressSummary progress={progress} loading={loading} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <QuranProgressMap progress={quranProg} mini />
        <MyCertificates />
      </div>
      <div className="mt-6"><RecentMaterials materials={materials} loading={loading} /></div>
    </div>
  );
};

export default DashboardPage;
