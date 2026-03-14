import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import AppModal from '../../components/common/AppModal';
import AppButton from '../../components/common/AppButton';
import AppBadge from '../../components/common/AppBadge';
import DailySabaqModal from '../../components/teacher/DailySabaqModal';
import { getDailyProgressByStudent, createDailyProgress, updateDailyProgress, deleteDailyProgress } from '../../features/dailyProgress/api';
import { getAllStudents } from '../../features/students/api';
import { formatDate } from '../../utils/formatDate';
import handleApiError from '../../utils/handleApiError';
import Loader from '../../components/common/Loader';

const DailyProgressPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getAllStudents({ limit: 1000 });
        setStudents(res.data?.students || []);
      } catch { /* silent */ }
    };
    fetchStudents();
  }, []);

  const fetchProgress = async (studentId) => {
    if (!studentId) { setProgressData([]); return; }
    setLoading(true);
    try {
      const res = await getDailyProgressByStudent(studentId);
      setProgressData(res.data?.data?.progress || []);
    } catch (err) {
      showToast(handleApiError(err), 'error');
      setProgressData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (e) => {
    const id = e.target.value;
    setSelectedStudent(id);
    fetchProgress(id);
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editRecord) {
        await updateDailyProgress(editRecord.id, data);
        showToast('Daily progress updated');
      } else {
        await createDailyProgress(data);
        showToast('Daily progress logged successfully');
      }
      setShowModal(false);
      setEditRecord(null);
      if (selectedStudent || data.studentId) {
        // if we just added for a specific student, select them to see result
        if (!selectedStudent && data.studentId) setSelectedStudent(data.studentId);
        fetchProgress(selectedStudent || data.studentId);
      }
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const confirmDelete = async () => {
    try {
      await deleteDailyProgress(deleteTarget.id);
      showToast('Record deleted');
      setDeleteTarget(null);
      fetchProgress(selectedStudent);
    } catch (err) { showToast(handleApiError(err), 'error'); }
  };

  const getGradeVariant = (grade) => {
    const g = grade?.toLowerCase() || '';
    if (g === 'excellent') return 'success';
    if (g === 'good') return 'info';
    if (g === 'poor') return 'danger';
    return 'warning'; // average
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Sabaq Tracker" subtitle="Manage daily sabaq, sabqi & manzil" 
        actionLabel="Log Daily Sabaq" onAction={() => { setEditRecord(null); setShowModal(true); }} />

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 sm:p-6 mb-6">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Select Student</label>
        <select value={selectedStudent} onChange={handleStudentChange} 
          className="w-full sm:max-w-xs rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B4D8]/40 outline-none">
          <option value="">-- Choose a student --</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : selectedStudent && progressData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-8 text-center text-[#4A5568]">
          <span className="text-4xl block mb-2">📝</span>
          <p>No daily progress logged for this student yet.</p>
        </div>
      ) : selectedStudent && progressData.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F8FAFC] text-[#4A5568] font-medium border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Sabaq (Surah/Ayat)</th>
                  <th className="px-6 py-4">Grades (Sabaq/Sabqi/Manzil)</th>
                  <th className="px-6 py-4">Notes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {progressData.map((record) => (
                  <tr key={record.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#1A1A2E]">{formatDate(record.date)}</td>
                    <td className="px-6 py-4">
                      {record.sabaqSurah || '-'} 
                      {record.sabaqAyatFrom || record.sabaqAyatTo ? ` (${record.sabaqAyatFrom || '*'} to ${record.sabaqAyatTo || '*'})` : ''}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <AppBadge variant={getGradeVariant(record.sabaqGrade)} size="sm">Sab: {record.sabaqGrade || '-'}</AppBadge>
                        <AppBadge variant={getGradeVariant(record.sabqiGrade)} size="sm">Sqi: {record.sabqiGrade || '-'}</AppBadge>
                        <AppBadge variant={getGradeVariant(record.manzilGrade)} size="sm">Man: {record.manzilGrade || '-'}</AppBadge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#4A5568] truncate max-w-[200px]" title={record.notes}>{record.notes || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => { setEditRecord(record); setShowModal(true); }} className="text-[#00B4D8] hover:text-[#1B3A5C] transition-colors cursor-pointer">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(record)} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <DailySabaqModal show={showModal} onClose={() => { setShowModal(false); setEditRecord(null); }}
        record={editRecord} students={students} onSubmit={handleSubmit} loading={saving} />

      <AppModal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" size="sm">
        <p className="text-sm text-[#4A5568] mb-6">Delete this daily progress record?</p>
        <div className="flex justify-end gap-3">
          <AppButton variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</AppButton>
          <AppButton variant="danger" onClick={confirmDelete}>Delete</AppButton>
        </div>
      </AppModal>
    </div>
  );
};

export default DailyProgressPage;
