import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import AppTable from '../../components/common/AppTable';
import AppBadge from '../../components/common/AppBadge';
import AppButton from '../../components/common/AppButton';
import EmptyState from '../../components/common/EmptyState';
import { getAllEnrollmentRequests, approveEnrollment, rejectEnrollment } from '../../features/enrollments/api';
import { getAllTeachers } from '../../features/teachers/api';
import AssignTeacherModal from '../../components/admin/AssignTeacherModal';

const EnrollmentRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingReq, setApprovingReq] = useState(null);
  const [processLoading, setProcessLoading] = useState(false);
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const [reqRes, teachRes] = await Promise.all([
        getAllEnrollmentRequests(),
        getAllTeachers({ limit: 100 })
      ]);
      setRequests(reqRes.data?.data?.requests || reqRes.data?.requests || []);
      setTeachers(teachRes.data?.data?.teachers || teachRes.data?.teachers || []);
    } catch { showToast('Error fetching enrollment requests', 'error'); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleApprove = async ({ requestId, teacherId }) => {
    setProcessLoading(true);
    try {
      await approveEnrollment(requestId);
      showToast('Enrollment approved successfully!', 'success');
      setApprovingReq(null);
      fetch();
    } catch (err) {
      showToast('Failed to approve request', 'error');
    }
    setProcessLoading(false);
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection:");
    if (!reason && reason !== "") return; // cancelled

    setProcessLoading(true);
    try {
      await rejectEnrollment(id, reason || 'No reason specified');
      showToast('Enrollment rejected', 'info');
      fetch();
    } catch { showToast('Failed to reject request', 'error'); }
    setProcessLoading(false);
  };

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'courseName', label: 'Course' },
    { 
      key: 'preference', 
      label: 'Preference', 
      render: (r) => (
        <div className="text-sm">
          <p className="font-semibold text-[#1A1A2E]">{r.preferredDays}</p>
          <p className="text-[#4A5568]">{r.preferredTime}</p>
        </div>
      )
    },
    {
      key: 'status', 
      label: 'Status',
      render: (r) => (
        <AppBadge 
          type={r.status === 'pending' ? 'warning' : r.status === 'approved' ? 'success' : 'error'} 
          text={r.status.charAt(0).toUpperCase() + r.status.slice(1)} 
        />
      )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (r) => (
        r.status === 'pending' && (
          <div className="flex gap-2">
            <AppButton size="sm" onClick={() => setApprovingReq(r)}>Approve</AppButton>
            <AppButton variant="outline" size="sm" onClick={() => handleReject(r.id)}>Reject</AppButton>
          </div>
        )
      ) 
    }
  ];

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Enrollment Requests" subtitle={`${requests.filter(r => r.status === 'pending').length} pending requests`} />
      
      {requests.length === 0 && !loading ? (
        <EmptyState title="No Requests" message="There are no course enrollment requests." />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <AppTable columns={columns} data={requests} loading={loading} />
        </div>
      )}

      <AssignTeacherModal 
        show={!!approvingReq}
        onClose={() => setApprovingReq(null)}
        request={approvingReq}
        teachers={teachers}
        onSubmit={handleApprove}
        loading={processLoading}
      />
    </div>
  );
};

export default EnrollmentRequestsPage;
