import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import CourseGrid from '../../components/admin/courses/CourseGrid';
import CourseModal from '../../components/admin/courses/CourseModal';
import AppModal from '../../components/common/AppModal';
import AppButton from '../../components/common/AppButton';
import { getAllCourses, addCourse, updateCourse, deleteCourse } from '../../features/courses/api';
import handleApiError from '../../utils/handleApiError';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await getAllCourses(); setCourses(data.courses || []); }
    catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editCourse) { await updateCourse(editCourse.id, data); showToast('Course updated'); }
      else { await addCourse(data); showToast('Course added'); }
      setShowModal(false); setEditCourse(null); fetch();
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const onEdit = (c) => { setEditCourse(c); setShowModal(true); };
  const confirmDelete = async () => {
    try { await deleteCourse(deleteTarget.id); showToast('Course deleted'); setDeleteTarget(null); fetch(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Courses" subtitle={`${courses.length} total courses`}
        actionLabel="Add Course" onAction={() => { setEditCourse(null); setShowModal(true); }} />
      <CourseGrid courses={courses} loading={loading} onEdit={onEdit} onDelete={setDeleteTarget} />
      <CourseModal show={showModal} onClose={() => { setShowModal(false); setEditCourse(null); }}
        course={editCourse} onSubmit={onSubmit} loading={saving} />
      <AppModal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" size="sm">
        <p className="text-sm text-[#4A5568] mb-6">Delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <AppButton variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</AppButton>
          <AppButton variant="danger" onClick={confirmDelete}>Delete</AppButton>
        </div>
      </AppModal>
    </div>
  );
};

export default CoursesPage;
