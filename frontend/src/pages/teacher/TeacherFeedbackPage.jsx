import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import AppTable from '../../components/common/AppTable';
import AppButton from '../../components/common/AppButton';
import AppBadge from '../../components/common/AppBadge';
import FeedbackModal from '../../components/teacher/FeedbackModal';
import http from '../../services/http';
import handleApiError from '../../utils/handleApiError';

const TeacherFeedbackPage = () => {
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, reportsRes] = await Promise.all([
        http.get('teachers/my-students'),
        http.get('feedback/my-students-feedback')
      ]);
      const list = studentsRes.data?.data?.students || studentsRes.data?.students || [];
      const unique = list.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);
      setStudents(unique);
      setReports(reportsRes.data?.data?.feedback || []);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const studentColumns = [
    { key: 'name', label: 'Student', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1B3A5C] flex items-center justify-center text-white text-xs font-bold">
          {r.name?.charAt(0)}
        </div>
        <span className="font-medium text-[#1A1A2E]">{r.name}</span>
      </div>
    )},
    { key: 'course', label: 'Course', render: (r) => r.courseName || '—' },
    { key: 'action', label: 'Action', render: (r) => (
      <AppButton
        variant="primary"
        size="sm"
        onClick={() => {
          setSelectedStudent(r);
          setIsModalOpen(true);
        }}
      >
        Write Monthly Report
      </AppButton>
    )},
  ];

  const reportColumns = [
    { key: 'studentName', label: 'Student' },
    { key: 'month', label: 'Period', render: (r) => `${new Date(0, r.month - 1).toLocaleString('default', { month: 'short' })} ${r.year}` },
    { key: 'grade', label: 'Grade', render: (r) => (
      <AppBadge
        status={r.overallGrade === 'excellent' ? 'Active' : r.overallGrade === 'good' ? 'Info' : 'Warning'}
      >
        {r.overallGrade.replace('-', ' ')}
      </AppBadge>
    )},
    { key: 'date', label: 'Submitted', render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Monthly Feedback" subtitle="Write and view monthly progress reports for your students" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">My Students</h3>
          <AppTable columns={studentColumns} data={students} loading={loading} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">Recent Reports</h3>
          <AppTable columns={reportColumns} data={reports} loading={loading} />
        </div>
      </div>

      {selectedStudent && (
        <FeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          student={selectedStudent}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default TeacherFeedbackPage;
