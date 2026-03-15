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
import { cachedRequest, getCache } from '../../services/apiCache';

const DashboardPage = () => {
  const { user } = useAuth();
  const cachedData = getCache(`student:dashboard:${user?.id}`);
  const [classes, setClasses] = useState(cachedData?.cls || []);
  const [progress, setProgress] = useState(cachedData?.prg || []);
  const [materials, setMaterials] = useState(cachedData?.mats || []);
  const [quranProg, setQuranProg] = useState(cachedData?.qp || []);
  
  const initialStats = cachedData ? {
    attended: cachedData.cls.filter(x => x.status === 'completed' || x.status === 'Completed').length,
    pendingPayments: cachedData.pays.filter(x => x.status !== 'Paid' && x.status !== 'paid').length,
    progress: cachedData.prg.length > 0 ? Math.round(cachedData.prg.reduce((a, x) => a + (Number(x.rating) || 0), 0) / cachedData.prg.length * 20) : 0,
    materials: cachedData.mats.length,
  } : { attended: 0, pendingPayments: 0, progress: 0, materials: 0 };
  
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    const fetch = async () => {
      // If not cache-loaded, show spinner. Else, revalidate silently behind scenes!
      if (!cachedData) setLoading(true);
      try {
        const dashboardData = await cachedRequest(`student:dashboard:${user?.id}`, async () => {
          const [cRes, pRes, payRes, mRes, qRes] = await Promise.all([
            getClassesByStudent().catch(() => ({ data: { data: { classes: [] } } })),
            getProgressByStudent().catch(() => ({ data: { data: { progress: [] } } })),
            getPaymentsByStudent().catch(() => ({ data: { data: { payments: [] } } })),
            getMaterialsByStudent().catch(() => ({ data: { data: { materials: [] } } })),
            getMyQuranProgress().catch(() => ({ data: { data: { progress: [] } } })),
          ]);
          return {
            cls: cRes.data?.data?.classes || cRes.data?.classes || [],
            prg: pRes.data?.data?.progress || pRes.data?.progress || [],
            pays: payRes.data?.data?.payments || payRes.data?.payments || [],
            mats: mRes.data?.data?.materials || mRes.data?.data || mRes.data?.materials || [],
            qp: qRes.data?.data?.progress || []
          };
        }, 120);

        const { cls, prg, pays, mats, qp } = dashboardData;

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
  }, [user?.id]);

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
