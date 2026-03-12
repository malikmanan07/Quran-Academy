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

  useEffect(() => {
    const fetch = async () => {
      try {
        const [c, s, p] = await Promise.all([
          getClassesByTeacher().catch(() => ({ data: { classes: [] } })),
          getAllStudents().catch(() => ({ data: { students: [] } })),
          getAllProgress().catch(() => ({ data: { progress: [] } })),
        ]);
        setClasses(c.data.classes || []);
        setStudents(s.data.students || []);
        setProgress(p.data.progress || []);
      } catch { /* silent */ }
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
      <TeacherStatsCards data={{ students: students.length, todayClasses: todayClasses.length, pendingReports: 0, monthlyClasses: classes.length }} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <TodaySchedule classes={todayClasses} />
        <MyStudentsList students={students} />
      </div>
      <div className="mt-6">
        <RecentProgress reports={progress} />
      </div>
    </div>
  );
};

export default DashboardPage;
