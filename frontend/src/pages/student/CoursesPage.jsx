import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import GridSkeleton from '../../components/common/GridSkeleton';
import EmptyState from '../../components/common/EmptyState';
import AppBadge from '../../components/common/AppBadge';
import { getAllCourses } from '../../features/courses/api';
import { getMyEnrollmentRequests, createEnrollmentRequest } from '../../features/enrollments/api';
import { getClassesByStudent } from '../../features/classes/api';
import { useAuth } from '../../context/AuthContext';
import { cachedRequest, getCache } from '../../services/apiCache';
import { getMyCourses } from '../../features/students/api';
import EnrollmentRequestModal from '../../components/student/EnrollmentRequestModal';
import { useCurrency } from '../../hooks/useCurrency';

const CoursesPage = () => {
  const { user } = useAuth();
  const cacheKey = `student:browse_courses:${user?.id}`;
  const initialCache = getCache(cacheKey);

  const [courses, setCourses] = useState(initialCache?.courses || []);
  const [requests, setRequests] = useState(initialCache?.requests || []);
  const [userClasses, setUserClasses] = useState(initialCache?.classes || []);
  const [loading, setLoading] = useState(!initialCache);
  const [requestLoading, setRequestLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { toast, showToast } = useToast();
  const { formatCurrency } = useCurrency();

  const fetch = async () => {
    if (!initialCache) setLoading(true);
    try {
      const data = await cachedRequest(cacheKey, async () => {
        const [crsRes, reqRes, myCrsRes] = await Promise.all([
          getAllCourses(),
          getMyEnrollmentRequests(),
          getMyCourses()
        ]);
        
        const resData = myCrsRes.data;
        return {
          courses: crsRes.data?.data?.courses || crsRes.data?.courses || [],
          requests: reqRes.data?.data?.requests || reqRes.data?.requests || [],
          enrolled: resData?.data?.courses || resData?.courses || resData?.data || []
        };
      }, 30);
      
      setCourses(data.courses);
      setRequests(data.requests);
      setUserClasses(data.enrolled); // Using userClasses state to store enrolled courses for status check
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => { 
    if (user?.id) fetch(); 
  }, [user?.id]);

  const getEnrollmentStatus = (courseId) => {
    const cid = Number(courseId);
    
    // 1. Check Enrolled Courses first (highest priority)
    const enrolledArr = Array.isArray(userClasses) ? userClasses : [];
    const isEnrolled = enrolledArr.some(c => Number(c.id) === cid || Number(c.courseId) === cid);
    if (isEnrolled) return 'approved';
    
    // 2. Check Requests
    const allRequests = Array.isArray(requests) ? requests : [];
    const courseReqs = allRequests.filter(r => Number(r.courseId) === cid);
    
    if (courseReqs.some(r => r.status === 'approved')) return 'approved';
    if (courseReqs.some(r => r.status === 'pending')) return 'pending';
    
    return courseReqs[0]?.status || null;
  };

  const handleEnrollRequest = async (data) => {
    setRequestLoading(true);
    try {
      await createEnrollmentRequest(data);
      showToast('Enrollment request submitted successfully!', 'success');
      setSelectedCourse(null);
      fetch();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit request', 'error');
    }
    setRequestLoading(false);
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Browse Courses"
        subtitle="Explore and request enrollment in our available courses."
      />

      {loading ? (
        <GridSkeleton />
      ) : courses.length === 0 ? (
        <EmptyState title="No Courses Available" message="There are currently no active courses to browse." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const reqStatus = getEnrollmentStatus(course.id);
            return (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-lg font-bold text-[#1A1A2E] leading-tight">
                      {course.name}
                    </h3>
                    {reqStatus === 'pending' && <AppBadge variant="warning">Pending</AppBadge>}
                    {reqStatus === 'approved' && <AppBadge variant="success">Enrolled</AppBadge>}
                    {reqStatus === 'rejected' && <AppBadge variant="error">Rejected</AppBadge>}
                  </div>

                  <p className="text-sm text-[#4A5568] flex-1 mb-6">
                    {course.description || "No description provided."}
                  </p>

                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-[#4A5568]">
                      <span className="w-5 text-center">⏱️</span>
                      {course.duration || 'Not specified'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#4A5568]">
                      <span className="w-5 text-center">📈</span>
                      {course.level || 'All Levels'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#4A5568]">
                      <span className="w-5 text-center">💰</span>
                      <strong className="text-[#1A1A2E]">{formatCurrency(course.price)}</strong> / month
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] mt-auto">
                    {reqStatus === 'approved' ? (
                      <button className="w-full py-2.5 rounded-xl font-bold bg-[#00B4D8] text-white opacity-90 cursor-default flex items-center justify-center gap-2">
                        ✅ Already Enrolled
                      </button>
                    ) : reqStatus === 'pending' ? (
                      <button className="w-full py-2.5 rounded-xl font-bold bg-[#FEF3C7] text-[#B45309] cursor-not-allowed border border-[#FDE68A]">
                        Request Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="w-full py-2.5 rounded-xl font-bold bg-[#00B4D8] text-white hover:bg-[#0096B4] transition-colors cursor-pointer"
                      >
                        {reqStatus === 'rejected' ? 'Request Again' : 'Request Enrollment'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EnrollmentRequestModal
        show={!!selectedCourse}
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onSubmit={handleEnrollRequest}
        loading={requestLoading}
      />
    </div>
  );
};

export default CoursesPage;
