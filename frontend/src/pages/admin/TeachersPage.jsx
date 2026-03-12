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
import { useSearch } from '../../hooks/useSearch';
import SearchInput from '../../components/common/SearchInput';
import AppPagination from '../../components/common/AppPagination';
import TableSkeleton from '../../components/common/TableSkeleton';

const TeachersPage = () => {
  const { 
    data: teachers, 
    loading, 
    total, 
    page, 
    setPage, 
    pageSize, 
    setPageSize, 
    search, 
    setSearch, 
    setFilters,
    refresh 
  } = useSearch(getAllTeachers);

  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast } = useToast();

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editTeacher) { await updateTeacher(editTeacher.id, data); showToast('Teacher updated'); }
      else { await addTeacher({ ...data, role: 'teacher' }); showToast('Teacher added'); }
      setShowModal(false); setEditTeacher(null); refresh();
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const confirmDelete = async () => {
    try { await deleteTeacher(deleteTarget.id); showToast('Teacher deleted'); setDeleteTarget(null); refresh(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };


  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Teachers" subtitle={`${total} total teachers`}
        actionLabel="Add Teacher" onAction={() => { setEditTeacher(null); setShowModal(true); }} />
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Search by name or email..." 
          className="flex-1"
        />
        <select 
          onChange={(e) => setFilters({ status: e.target.value })}
          className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {loading ? (
          <TableSkeleton rows={pageSize} cols={5} />
        ) : (
          <TeacherTable 
            teachers={teachers} 
            loading={loading} 
            onEdit={(t) => { setEditTeacher(t); setShowModal(true); }} 
            onDelete={(t) => setDeleteTarget(t)} 
          />
        )}
      </div>

      <AppPagination 
        total={total} 
        page={page} 
        pageSize={pageSize} 
        onPageChange={setPage} 
        onPageSizeChange={setPageSize} 
      />
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
