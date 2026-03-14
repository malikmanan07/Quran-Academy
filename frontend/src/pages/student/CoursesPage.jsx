import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import DashboardLoadingSkeleton from '../../components/common/DashboardLoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import AppBadge from '../../components/common/AppBadge';
import { getAllCourses } from '../../features/courses/api';
import { getMyEnrollmentRequests, createEnrollmentRequest } from '../../features/enrollments/api';
import EnrollmentRequestModal from '../../components/student/EnrollmentRequestModal';
import { useCurrency } from '../../context/CurrencyContext';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { toast, showToast } = useToast();
  const { formatAmount } = useCurrency();

  const fetch = async () => {
    setLoading(true);
    try {
      const [crsRes, reqRes] = await Promise.all([
        getAllCourses(),
        getMyEnrollmentRequests()
      ]);
      setCourses(crsRes.data?.data?.courses || crsRes.data?.courses || []);
      setRequests(reqRes.data?.data?.requests || reqRes.data?.requests || []);
    } catch {
      // silent fail
    }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const getRequestStatus = (courseId) => {
    const req = requests.find(r => r.courseId === courseId);
    return req ? req.status : null; // 'pending' | 'approved' | 'rejected'
  };

  const handleEnrollRequest = async (data) => {
    setRequestLoading(true);
    try {
      await createEnrollmentRequest(data);
      showToast('Enrollment request submitted successfully!', 'success');
      setSelectedCourse(null);
      fetch(); // Refresh data to get newly created request
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit request', 'error');
    }
    setRequestLoading(false);
  };

  if (loading) return <DashboardLoadingSkeleton />;

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Browse Courses"
        subtitle="Explore and request enrollment in our available courses."
      />

      {courses.length === 0 ? (
        <EmptyState title="No Courses Available" message="There are currently no active courses to browse." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const reqStatus = getRequestStatus(course.id);
            return (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-lg font-bold text-[#1A1A2E] leading-tight">
                      {course.name}
                    </h3>
                    {reqStatus === 'pending' && <AppBadge type="warning" text="Pending" />}
                    {reqStatus === 'approved' && <AppBadge type="success" text="Enrolled" />}
                    {reqStatus === 'rejected' && <AppBadge type="error" text="Rejected" />}
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
                      <strong className="text-[#1A1A2E]">{formatAmount(course.price)}</strong> / month
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] mt-auto">
                    {reqStatus === 'approved' ? (
                      <button className="w-full py-2.5 rounded-xl font-bold bg-[#F0F4F8] text-[#1B3A5C] opacity-80 cursor-not-allowed">
                        Already Enrolled
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
