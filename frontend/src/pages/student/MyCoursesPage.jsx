import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import CardSkeleton from '../../components/common/CardSkeleton';
import CourseProgressCard from '../../components/student/courses/CourseProgressCard';
import { getAllCourses } from '../../features/courses/api';

const MyCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await getAllCourses(); setCourses(data?.data?.courses || data?.courses || []); }
      catch { /* silent */ }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div>
      <PageHeader title="My Courses" subtitle={`${courses.length} enrolled courses`} />
      {loading ? (
        <CardSkeleton count={3} />
      ) : courses.length === 0 ? (
        <EmptyState title="No Courses" message="You are not enrolled in any courses yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => <CourseProgressCard key={c.id} course={c} />)}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
