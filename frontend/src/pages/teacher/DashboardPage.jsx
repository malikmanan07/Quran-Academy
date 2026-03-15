import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClassesByTeacher } from '../../features/classes/api';
import { getAllStudents } from '../../features/students/api';
import { getAllProgress } from '../../features/progress/api';
import TeacherStatsCards from '../../components/dashboard/teacher/TeacherStatsCards';
import TodaySchedule from '../../components/dashboard/teacher/TodaySchedule';
import MyStudentsList from '../../components/dashboard/teacher/MyStudentsList';
import RecentProgress from '../../components/dashboard/teacher/RecentProgress';
import { cachedRequest, getCache } from '../../services/apiCache';

const DashboardPage = () => {
  const { user } = useAuth();
  const cachedData = getCache(`teacher:dashboard:${user?.id}`);
  const [classes, setClasses] = useState(cachedData?.classes || []);
  const [students, setStudents] = useState(cachedData?.students || []);
  const [progress, setProgress] = useState(cachedData?.progress || []);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
  const fetch = async () => {
    // If not cache-loaded, show spinner. Else, revalidate silently behind scenes!
    if (!cachedData) setLoading(true);
    try {
      const dashboardData = await cachedRequest(`teacher:dashboard:${user?.id}`, async () => {
        const [cRes, sRes, pRes] = await Promise.all([
          getClassesByTeacher().catch(() => ({ data: { data: { classes: [] } } })),
          getAllStudents({ teacherId: user.id }).catch(() => ({ data: { data: { students: [] } } })),
          getAllProgress().catch(() => ({ data: { data: { progress: [] } } })),
        ]);
        return {
          classes: cRes.data?.data?.classes || cRes.data?.classes || [],
          students: sRes.data?.data?.students || sRes.data?.students || [],
          progress: pRes.data?.data?.progress || pRes.data?.progress || []
        };
      }, 120);
      
      setClasses(dashboardData.classes);
      setStudents(dashboardData.students);
      setProgress(dashboardData.progress);
    } catch (err) {
      console.error('Teacher Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
  if (user?.id) fetch();
}, [user?.id]);

  const today = new Date().toISOString().split('T')[0];
  const todayClasses = classes.filter(c => c.date?.startsWith(today));
  const todayStr = new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">Welcome back, {user?.name} 👋</h1>
        <p className="text-sm text-[#4A5568]">{todayStr}</p>
      </div>
      <TeacherStatsCards loading={loading} data={{ students: students.length, todayClasses: todayClasses.length, pendingReports: 0, monthlyClasses: classes.length }} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <TodaySchedule classes={todayClasses} loading={loading} />
        <MyStudentsList students={students} loading={loading} />
      </div>
      <div className="mt-6">
        <RecentProgress reports={progress} loading={loading} />
      </div>
    </div>
  );
};

export default DashboardPage;
