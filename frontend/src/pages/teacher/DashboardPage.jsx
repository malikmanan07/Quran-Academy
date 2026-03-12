import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClassesByTeacher } from '../../features/classes/api';
import { getAllStudents } from '../../features/students/api';
import { getAllProgress } from '../../features/progress/api';
import TeacherStatsCards from '../../components/dashboard/teacher/TeacherStatsCards';
import TodaySchedule from '../../components/dashboard/teacher/TodaySchedule';
import MyStudentsList from '../../components/dashboard/teacher/MyStudentsList';
import RecentProgress from '../../components/dashboard/teacher/RecentProgress';

const DashboardPage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [cRes, sRes, pRes] = await Promise.all([
          getClassesByTeacher().catch(() => ({ data: { data: { classes: [] } } })),
          getAllStudents().catch(() => ({ data: { data: { students: [] } } })),
          getAllProgress().catch(() => ({ data: { data: { progress: [] } } })),
        ]);
        
        // Extract from response.data (axios) -> .data (backend payload)
        setClasses(cRes.data?.data?.classes || cRes.data?.classes || []);
        setStudents(sRes.data?.data?.students || sRes.data?.students || []);
        setProgress(pRes.data?.data?.progress || pRes.data?.progress || []);
      } catch (err) {
        console.error('Teacher Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetch();
  }, [user]);

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
