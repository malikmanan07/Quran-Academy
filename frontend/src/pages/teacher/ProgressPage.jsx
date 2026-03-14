import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import ProgressTable from '../../components/teacher/progress/ProgressTable';
import ProgressModal from '../../components/teacher/progress/ProgressModal';
import AppModal from '../../components/common/AppModal';
import AppButton from '../../components/common/AppButton';
import QuranProgressMap from '../../components/common/QuranProgressMap';
import { getAllProgress, createProgress, updateProgress, deleteProgress } from '../../features/progress/api';
import { getMyStudents } from '../../features/teachers/api';
import { getQuranProgress, updateQuranPara } from '../../features/quranProgress/api';
import handleApiError from '../../utils/handleApiError';
import { useSearch } from '../../hooks/useSearch';
import SearchInput from '../../components/common/SearchInput';
import AppPagination from '../../components/common/AppPagination';
import TableSkeleton from '../../components/common/TableSkeleton';

const ProgressPage = () => {
  const { user } = useAuth();
  const { 
    data: progress, 
    loading, 
    total, 
    page, 
    setPage, 
    pageSize, 
    setPageSize, 
    search, 
    setSearch, 
    refresh 
  } = useSearch(getAllProgress);

  const [students, setStudents] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [quranProg, setQuranProg] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const { toast, showToast } = useToast();

  const fetchStudents = async () => {
    try {
      const response = await getMyStudents();
      const list = response.data?.data?.students || response.data?.students || response.data || [];
      
      // Deduplicate by id:
      const unique = list.filter((s, i, arr) =>
        arr.findIndex(x => x.id === s.id) === i
      );
      setStudents(unique);
    } catch (err) {
      console.error('Students error:', err);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const fetchQuranProgress = async (studentId) => {
    if (!studentId) { setQuranProg([]); return; }
    try {
      const res = await getQuranProgress(studentId);
      setQuranProg(res.data?.data?.progress || []);
    } catch { setQuranProg([]); }
  };

  const handleParaUpdate = async (paraNumber, status) => {
    if (!selectedStudent) return;
    try {
      await updateQuranPara(selectedStudent, paraNumber, status);
      showToast('Para status updated');
      fetchQuranProgress(selectedStudent);
    } catch (err) { showToast(handleApiError(err), 'error'); }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editReport) { await updateProgress(editReport.id, data); showToast('Report updated'); }
      else { await createProgress({ ...data, teacherId: user?.id }); showToast('Report added'); }
      setShowModal(false); setEditReport(null); refresh();
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const confirmDelete = async () => {
    try { await deleteProgress(deleteTarget.id); showToast('Report deleted'); setDeleteTarget(null); refresh(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };


  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Progress Reports" subtitle={`${total} reports`}
        actionLabel="Add Report" onAction={() => { setEditReport(null); setShowModal(true); }} />

      {/* Quran Progress Map */}
      <div className="mb-6 bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <h3 className="text-sm font-bold text-[#1A1A2E]">📖 Quran Para Progress</h3>
          <select
            value={selectedStudent}
            onChange={(e) => { setSelectedStudent(e.target.value); fetchQuranProgress(e.target.value); }}
            className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B4D8]/40 outline-none"
          >
            <option value="">Select Student</option>
            {students.map(s => <option key={`${s.id}-${s.name}`} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        {selectedStudent ? (
          <QuranProgressMap progress={quranProg} editable onUpdatePara={handleParaUpdate} />
        ) : (
          <p className="text-sm text-[#4A5568] text-center py-6">Select a student to view and update Quran progress</p>
        )}
      </div>
      
      <div className="mb-6">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Search reports..." 
          className="w-full md:w-96"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {loading ? (
          <TableSkeleton rows={pageSize} cols={5} />
        ) : (
          <ProgressTable progress={progress} loading={loading}
            onEdit={(r) => { setEditReport(r); setShowModal(true); }} onDelete={setDeleteTarget} />
        )}
      </div>

      <AppPagination 
        total={total} 
        page={page} 
        pageSize={pageSize} 
        onPageChange={setPage} 
        onPageSizeChange={setPageSize} 
      />
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
