import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClassesByStudent } from '../../features/classes/api';
import { getProgressByStudent } from '../../features/progress/api';
import { getPaymentsByStudent } from '../../features/payments/api';
import { getAllMaterials } from '../../features/materials/api';
import StudentStatsCards from '../../components/dashboard/student/StudentStatsCards';
import UpcomingClasses from '../../components/dashboard/student/UpcomingClasses';
import MyProgressSummary from '../../components/dashboard/student/MyProgressSummary';
import RecentMaterials from '../../components/dashboard/student/RecentMaterials';

const DashboardPage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [stats, setStats] = useState({ attended: 0, pendingPayments: 0, progress: 0, materials: 0 });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [c, p, pay, m] = await Promise.all([
          getClassesByStudent().catch(() => ({ data: { classes: [] } })),
          getProgressByStudent().catch(() => ({ data: { progress: [] } })),
          getPaymentsByStudent().catch(() => ({ data: { payments: [] } })),
          getAllMaterials().catch(() => ({ data: { materials: [] } })),
        ]);
        const cls = c.data.classes || [];
        const prg = p.data.progress || [];
        const pays = pay.data.payments || [];
        const mats = m.data.materials || m.data || [];
        setClasses(cls);
        setProgress(prg);
        setMaterials(mats);
        setStats({
          attended: cls.filter(x => x.status === 'completed').length,
          pendingPayments: pays.filter(x => x.status !== 'Paid').length,
          progress: prg.length > 0 ? Math.round(prg.reduce((a, x) => a + (Number(x.rating) || 0), 0) / prg.length * 20) : 0,
          materials: mats.length,
        });
      } catch { /* silent */ }
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
      <StudentStatsCards data={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <UpcomingClasses classes={classes.filter(c => c.status === 'scheduled')} />
        <MyProgressSummary progress={progress} />
      </div>
      <div className="mt-6"><RecentMaterials materials={materials} /></div>
    </div>
  );
};

export default DashboardPage;
