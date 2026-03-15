import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import CardSkeleton from '../../components/common/CardSkeleton';
import CourseProgressCard from '../../components/student/courses/CourseProgressCard';
import { getAllCourses } from '../../features/courses/api';
import { getMyEnrollmentRequests } from '../../features/enrollments/api';
import { getClassesByStudent } from '../../features/classes/api';
import { cachedRequest, getCache, invalidateCache } from '../../services/apiCache';

const MyCoursesPage = () => {
  const { user } = useAuth();
  const cacheKey = `student:my_enrolled_courses:${user?.id}`;
  const initialCache = getCache(cacheKey);
  
  const [courses, setCourses] = useState(initialCache || []);
  const [loading, setLoading] = useState(!initialCache);

  useEffect(() => {
    const fetch = async () => {
      if (!initialCache) setLoading(true);
      try { 
        const data = await cachedRequest(cacheKey, async () => {
          const [crsRes, reqRes, clsRes] = await Promise.all([
            getAllCourses(),
            getMyEnrollmentRequests(),
            getClassesByStudent()
          ]);
          
          const allCourses = crsRes.data?.data?.courses || crsRes.data?.courses || [];
          const requests = reqRes.data?.data?.requests || reqRes.data?.requests || [];
          const userClasses = clsRes.data?.data?.classes || clsRes.data?.classes || [];
          
          // Filter only enrolled courses
          return allCourses.filter(course => {
            const isApproved = requests.some(r => Number(r.courseId) === Number(course.id) && r.status === 'approved');
            const hasClasses = userClasses.some(c => Number(c.courseId) === Number(course.id));
            return isApproved || hasClasses;
          });
        }, 300);
        setCourses(data); 
      }
      catch { /* silent */ }
      finally { setLoading(false); }
    };
    if (user?.id) fetch();
  }, [user?.id]);

  return (
    <div>
      <PageHeader title="My Courses" subtitle={`${courses.length} enrolled courses`} />
      {loading && courses.length === 0 ? (
        <CardSkeleton items={3} />
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
