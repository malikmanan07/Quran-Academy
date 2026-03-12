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

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const [c, s, t, co] = await Promise.all([
        getAllClasses(), getAllStudents(), getAllTeachers(), getAllCourses(),
      ]);
      setClasses(c.data.classes || []);
      setStudents(s.data.students || []);
      setTeachers(t.data.teachers || []);
      setCourses(co.data.courses || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    let list = classes;
    if (search) list = list.filter(c =>
      c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      c.teacherName?.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter) list = list.filter(c => c.status === statusFilter);
    return list;
  }, [classes, search, statusFilter]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editClass) { await updateClass(editClass.id, data); showToast('Class updated'); }
      else { await addClass(data); showToast('Class scheduled'); }
      setShowModal(false); setEditClass(null); fetch();
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const onEdit = (c) => { setEditClass(c); setShowModal(true); };
  const confirmDelete = async () => {
    try { await deleteClass(deleteTarget.id); showToast('Class deleted'); setDeleteTarget(null); fetch(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Classes" subtitle={`${classes.length} total classes`}
        actionLabel="Schedule Class" onAction={() => { setEditClass(null); setShowModal(true); }} />
      <ClassFilters search={search} onSearchChange={setSearch}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        onReset={() => { setSearch(''); setStatusFilter(''); }} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <ClassTable classes={filtered} loading={loading} onEdit={onEdit} onDelete={setDeleteTarget} />
      </div>
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
