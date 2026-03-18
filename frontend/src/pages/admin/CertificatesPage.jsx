import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { getCompletionRequests, generateCertificate, getGeneratedCertificates } from '../../features/certificates/api';
import TableSkeleton from '../../components/common/TableSkeleton';
import EmptyState from '../../components/common/EmptyState';
import AppButton from '../../components/common/AppButton';
import AppBadge from '../../components/common/AppBadge';
import { useToast } from '../../components/common/Toast';
import Toast from '../../components/common/Toast';
import AppModal from '../../components/common/AppModal';

const AdminCertificatesPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast, showToast } = useToast();

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await getCompletionRequests();
      const list = res.data?.data?.completions || res.data?.completions || [];
      setPending(list);
    } catch (err) {
      showToast('Failed to fetch completion requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenerated = async () => {
    try {
      setLoading(true);
      const res = await getGeneratedCertificates();
      const list = res.data?.data?.certificates || res.data?.certificates || [];
      setGenerated(list);
    } catch (err) {
      showToast('Failed to fetch generated certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending') fetchPending();
    else fetchGenerated();
  }, [activeTab]);

  const handleGenerate = async () => {
    if (!selectedRequest) return;
    setSubmitting(true);
    try {
      await generateCertificate({
        studentId: selectedRequest.studentId,
        courseId: selectedRequest.courseId
      });
      showToast('Certificate generated successfully! 🏆', 'success');
      setPending(prev => prev.filter(p => !(p.studentId === selectedRequest.studentId && p.courseId === selectedRequest.courseId)));
      setSelectedRequest(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to generate certificate', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Toast toast={toast} />
      <PageHeader 
        title="🏆 Certificates Management" 
        subtitle="Manage course completions and issue official certificates"
      />

      <div className="flex bg-white/50 p-1 rounded-xl border border-[#E2E8F0] w-fit mb-6">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-[#00B4D8] text-white shadow-md' : 'text-[#4A5568] hover:bg-white'}`}
        >
          Pending Requests ({pending.length})
        </button>
        <button 
          onClick={() => setActiveTab('generated')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'generated' ? 'bg-[#00B4D8] text-white shadow-md' : 'text-[#4A5568] hover:bg-white'}`}
        >
          Generated ({generated.length})
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : activeTab === 'pending' ? (
        pending.length === 0 ? (
          <EmptyState icon="🎉" title="No Pending Requests" message="All completion requests have been processed." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pending.map(req => (
              <div key={`${req.studentId}-${req.courseId}`} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0] flex flex-col hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider">{req.courseName}</p>
                    <h3 className="text-lg font-bold text-[#1A1A2E]">{req.studentName}</h3>
                  </div>
                  <AppBadge variant="warning">Ready</AppBadge>
                </div>
                <div className="flex-1 space-y-2 mb-6">
                  <p className="text-sm text-[#4A5568]"><strong>Teacher:</strong> {req.teacherName}</p>
                  <p className="text-sm text-[#4A5568]"><strong>Completed:</strong> {new Date(req.completedAt).toLocaleDateString()}</p>
                  {req.notes && <p className="text-xs text-[#94A3B8] italic mt-2">"{req.notes}"</p>}
                </div>
                <AppButton fullWidth onClick={() => setSelectedRequest(req)}>
                  Generate Certificate 🏆
                </AppButton>
              </div>
            ))}
          </div>
        )
      ) : (
        generated.length === 0 ? (
          <EmptyState icon="🏆" title="No Certificates Yet" message="Generated certificates will appear here." />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-xs font-bold text-[#4A5568] uppercase">Cert No</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#4A5568] uppercase">Student</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#4A5568] uppercase">Course</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#4A5568] uppercase">Generated At</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#4A5568] uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {generated.map(cert => (
                  <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-[#00B4D8] font-bold">{cert.certificateNumber}</td>
                    <td className="px-6 py-4 font-medium text-[#1A1A2E]">{cert.studentName}</td>
                    <td className="px-6 py-4 text-sm text-[#4A5568]">{cert.courseName}</td>
                    <td className="px-6 py-4 text-sm text-[#94A3B8]">{new Date(cert.generatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right text-xs">
                      <span className="text-[#94A3B8]">Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <AppModal
        show={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="🏆 Generate Official Certificate"
      >
        <div className="space-y-4">
          <p className="text-[#4A5568]">
            Are you sure you want to generate an official certificate for <strong>{selectedRequest?.studentName}</strong> for completing <strong>{selectedRequest?.courseName}</strong>?
          </p>
          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
            <p className="text-xs text-[#94A3B8] uppercase font-bold">Details</p>
            <p className="text-sm"><strong>Student:</strong> {selectedRequest?.studentName}</p>
            <p className="text-sm"><strong>Teacher:</strong> {selectedRequest?.teacherName}</p>
            <p className="text-sm"><strong>Date:</strong> {selectedRequest && new Date(selectedRequest.completedAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <AppButton variant="secondary" fullWidth onClick={() => setSelectedRequest(null)}>Cancel</AppButton>
            <AppButton 
              fullWidth 
              loading={submitting} 
              onClick={handleGenerate}
            >
              Generate Now
            </AppButton>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default AdminCertificatesPage;
