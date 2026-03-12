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
import { useSearch } from '../../hooks/useSearch';
import SearchInput from '../../components/common/SearchInput';
import AppPagination from '../../components/common/AppPagination';
import TableSkeleton from '../../components/common/TableSkeleton';

const StudentsPage = () => {
  const { 
    data: students, 
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
  } = useSearch(getAllStudents);

  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast } = useToast();

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editStudent) { await updateStudent(editStudent.id, data); showToast('Student updated'); }
      else { await addStudent({ ...data, role: 'student' }); showToast('Student added'); }
      setShowModal(false); setEditStudent(null); refresh();
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const confirmDelete = async () => {
    try { await deleteStudent(deleteTarget.id); showToast('Student deleted'); setDeleteTarget(null); refresh(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };


  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Students" subtitle={`${total} total students`}
        actionLabel="Add Student" onAction={() => { setEditStudent(null); setShowModal(true); }} />
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
          <StudentTable 
            students={students} 
            loading={loading} 
            onEdit={(s) => { setEditStudent(s); setShowModal(true); }} 
            onDelete={(s) => setDeleteTarget(s)} 
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
