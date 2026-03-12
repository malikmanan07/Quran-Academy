import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import ProgressTable from '../../components/teacher/progress/ProgressTable';
import ProgressModal from '../../components/teacher/progress/ProgressModal';
import AppModal from '../../components/common/AppModal';
import AppButton from '../../components/common/AppButton';
import { getAllProgress, createProgress, updateProgress, deleteProgress } from '../../features/progress/api';
import { getAllStudents } from '../../features/students/api';
import handleApiError from '../../utils/handleApiError';

const ProgressPage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([getAllProgress(), getAllStudents()]);
      setProgress(p.data.progress || []);
      setStudents(s.data.students || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editReport) { await updateProgress(editReport.id, data); showToast('Report updated'); }
      else { await createProgress({ ...data, teacherId: user?.id }); showToast('Report added'); }
      setShowModal(false); setEditReport(null); fetch();
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const confirmDelete = async () => {
    try { await deleteProgress(deleteTarget.id); showToast('Report deleted'); setDeleteTarget(null); fetch(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Progress Reports" subtitle={`${progress.length} reports`}
        actionLabel="Add Report" onAction={() => { setEditReport(null); setShowModal(true); }} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <ProgressTable progress={progress} loading={loading}
          onEdit={(r) => { setEditReport(r); setShowModal(true); }} onDelete={setDeleteTarget} />
      </div>
      <ProgressModal show={showModal} onClose={() => { setShowModal(false); setEditReport(null); }}
        report={editReport} onSubmit={onSubmit} loading={saving} students={students} />
      <AppModal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" size="sm">
        <p className="text-sm text-[#4A5568] mb-6">Delete this progress report?</p>
        <div className="flex justify-end gap-3">
          <AppButton variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</AppButton>
          <AppButton variant="danger" onClick={confirmDelete}>Delete</AppButton>
        </div>
      </AppModal>
    </div>
  );
};

export default ProgressPage;
