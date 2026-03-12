import { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import StudentFilters from '../../components/admin/students/StudentFilters';
import StudentTable from '../../components/admin/students/StudentTable';
import StudentModal from '../../components/admin/students/StudentModal';
import AppModal from '../../components/common/AppModal';
import AppButton from '../../components/common/AppButton';
import { getAllStudents, addStudent, updateStudent, deleteStudent } from '../../features/students/api';
import handleApiError from '../../utils/handleApiError';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await getAllStudents(); setStudents(data.students || []); }
    catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    let list = students;
    if (search) list = list.filter(s =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter === 'active') list = list.filter(s => s.isActive !== false);
    if (statusFilter === 'inactive') list = list.filter(s => s.isActive === false);
    return list;
  }, [students, search, statusFilter]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editStudent) { await updateStudent(editStudent.id, data); showToast('Student updated'); }
      else { await addStudent({ ...data, role: 'student' }); showToast('Student added'); }
      setShowModal(false); setEditStudent(null); fetch();
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const onEdit = (s) => { setEditStudent(s); setShowModal(true); };
  const onDelete = (s) => setDeleteTarget(s);

  const confirmDelete = async () => {
    try { await deleteStudent(deleteTarget.id); showToast('Student deleted'); setDeleteTarget(null); fetch(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Students" subtitle={`${students.length} total students`}
        actionLabel="Add Student" onAction={() => { setEditStudent(null); setShowModal(true); }} />
      <StudentFilters search={search} onSearchChange={setSearch}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        onReset={() => { setSearch(''); setStatusFilter(''); }} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <StudentTable students={filtered} loading={loading} onEdit={onEdit} onDelete={onDelete} />
      </div>
      <StudentModal show={showModal} onClose={() => { setShowModal(false); setEditStudent(null); }}
        student={editStudent} onSubmit={onSubmit} loading={saving} />
      <AppModal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" size="sm">
        <p className="text-sm text-[#4A5568] mb-6">
          Are you sure you want to delete <strong className="text-[#1A1A2E]">{deleteTarget?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <AppButton variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</AppButton>
          <AppButton variant="danger" onClick={confirmDelete}>Delete</AppButton>
        </div>
      </AppModal>
    </div>
  );
};

export default StudentsPage;
