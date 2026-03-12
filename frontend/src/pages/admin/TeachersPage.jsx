import { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import TeacherFilters from '../../components/admin/teachers/TeacherFilters';
import TeacherTable from '../../components/admin/teachers/TeacherTable';
import TeacherModal from '../../components/admin/teachers/TeacherModal';
import AppModal from '../../components/common/AppModal';
import AppButton from '../../components/common/AppButton';
import { getAllTeachers, addTeacher, updateTeacher, deleteTeacher } from '../../features/teachers/api';
import handleApiError from '../../utils/handleApiError';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await getAllTeachers(); setTeachers(data.teachers || []); }
    catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    let list = teachers;
    if (search) list = list.filter(t =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter === 'active') list = list.filter(t => t.isActive !== false);
    if (statusFilter === 'inactive') list = list.filter(t => t.isActive === false);
    return list;
  }, [teachers, search, statusFilter]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editTeacher) { await updateTeacher(editTeacher.id, data); showToast('Teacher updated'); }
      else { await addTeacher({ ...data, role: 'teacher' }); showToast('Teacher added'); }
      setShowModal(false); setEditTeacher(null); fetch();
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const onEdit = (t) => { setEditTeacher(t); setShowModal(true); };
  const onDelete = (t) => setDeleteTarget(t);

  const confirmDelete = async () => {
    try { await deleteTeacher(deleteTarget.id); showToast('Teacher deleted'); setDeleteTarget(null); fetch(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Teachers" subtitle={`${teachers.length} total teachers`}
        actionLabel="Add Teacher" onAction={() => { setEditTeacher(null); setShowModal(true); }} />
      <TeacherFilters search={search} onSearchChange={setSearch}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        onReset={() => { setSearch(''); setStatusFilter(''); }} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <TeacherTable teachers={filtered} loading={loading} onEdit={onEdit} onDelete={onDelete} />
      </div>
      <TeacherModal show={showModal} onClose={() => { setShowModal(false); setEditTeacher(null); }}
        teacher={editTeacher} onSubmit={onSubmit} loading={saving} />
      <AppModal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" size="sm">
        <p className="text-sm text-[#4A5568] mb-6">
          Are you sure you want to delete <strong className="text-[#1A1A2E]">{deleteTarget?.name}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <AppButton variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</AppButton>
          <AppButton variant="danger" onClick={confirmDelete}>Delete</AppButton>
        </div>
      </AppModal>
    </div>
  );
};

export default TeachersPage;
