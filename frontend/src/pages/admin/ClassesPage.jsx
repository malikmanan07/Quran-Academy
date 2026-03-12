import { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import ClassFilters from '../../components/admin/classes/ClassFilters';
import ClassTable from '../../components/admin/classes/ClassTable';
import ClassModal from '../../components/admin/classes/ClassModal';
import AppModal from '../../components/common/AppModal';
import AppButton from '../../components/common/AppButton';
import { getAllClasses, addClass, updateClass, deleteClass } from '../../features/classes/api';
import { getAllStudents } from '../../features/students/api';
import { getAllTeachers } from '../../features/teachers/api';
import { getAllCourses } from '../../features/courses/api';
import handleApiError from '../../utils/handleApiError';
import { useSearch } from '../../hooks/useSearch';
import SearchInput from '../../components/common/SearchInput';
import AppPagination from '../../components/common/AppPagination';
import TableSkeleton from '../../components/common/TableSkeleton';

const ClassesPage = () => {
  const { 
    data: classes, 
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
  } = useSearch(getAllClasses);

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [depsLoading, setDepsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast } = useToast();

  const fetchDeps = async () => {
    setDepsLoading(true);
    try {
      const [s, t, co] = await Promise.all([
        getAllStudents({ limit: 1000 }), 
        getAllTeachers({ limit: 1000 }), 
        getAllCourses({ limit: 1000 }),
      ]);
      setStudents(s.data.students || []);
      setTeachers(t.data.teachers || []);
      setCourses(co.data.courses || []);
    } catch { /* silent */ }
    setDepsLoading(false);
  };


  useEffect(() => { fetchDeps(); }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editClass) { await updateClass(editClass.id, data); showToast('Class updated'); }
      else { await addClass(data); showToast('Class scheduled'); }
      setShowModal(false); setEditClass(null); refresh();
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const confirmDelete = async () => {
    try { await deleteClass(deleteTarget.id); showToast('Class deleted'); setDeleteTarget(null); refresh(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };


  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Classes" subtitle={`${total} total classes`}
        actionLabel="Schedule Class" onAction={() => { setEditClass(null); setShowModal(true); }} />
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Search by student, teacher or course..." 
          className="flex-1"
        />
        <select 
          onChange={(e) => setFilters({ status: e.target.value })}
          className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {loading ? (
          <TableSkeleton rows={pageSize} cols={6} />
        ) : (
          <ClassTable 
            classes={classes} 
            loading={loading} 
            onEdit={(c) => { setEditClass(c); setShowModal(true); }} 
            onDelete={setDeleteTarget} 
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
      <ClassModal show={showModal} onClose={() => { setShowModal(false); setEditClass(null); }}
        classData={editClass} onSubmit={onSubmit} loading={saving}
        students={students} teachers={teachers} courses={courses} />
      <AppModal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" size="sm">
        <p className="text-sm text-[#4A5568] mb-6">Delete this class? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <AppButton variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</AppButton>
          <AppButton variant="danger" onClick={confirmDelete}>Delete</AppButton>
        </div>
      </AppModal>
    </div>
  );
};

export default ClassesPage;
