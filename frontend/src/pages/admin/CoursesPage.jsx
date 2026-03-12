import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import CourseGrid from '../../components/admin/courses/CourseGrid';
import CourseModal from '../../components/admin/courses/CourseModal';
import AppModal from '../../components/common/AppModal';
import AppButton from '../../components/common/AppButton';
import { getAllCourses, addCourse, updateCourse, deleteCourse } from '../../features/courses/api';
import handleApiError from '../../utils/handleApiError';
import { useSearch } from '../../hooks/useSearch';
import SearchInput from '../../components/common/SearchInput';
import AppPagination from '../../components/common/AppPagination';

const CoursesPage = () => {
  const { 
    data: courses, 
    loading, 
    total, 
    page, 
    setPage, 
    pageSize, 
    setPageSize, 
    search, 
    setSearch, 
    refresh 
  } = useSearch(getAllCourses);

  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast } = useToast();

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editCourse) { await updateCourse(editCourse.id, data); showToast('Course updated'); }
      else { await addCourse(data); showToast('Course added'); }
      setShowModal(false); setEditCourse(null); refresh();
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const confirmDelete = async () => {
    try { await deleteCourse(deleteTarget.id); showToast('Course deleted'); setDeleteTarget(null); refresh(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };


  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Courses" subtitle={`${total} total courses`}
        actionLabel="Add Course" onAction={() => { setEditCourse(null); setShowModal(true); }} />
      <div className="mb-6">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Search courses..." 
          className="w-full md:w-96"
        />
      </div>
      <CourseGrid courses={courses} loading={loading} onEdit={(c) => { setEditCourse(c); setShowModal(true); }} onDelete={setDeleteTarget} />
      <AppPagination 
        total={total} 
        page={page} 
        pageSize={pageSize} 
        onPageChange={setPage} 
        onPageSizeChange={setPageSize} 
      />
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
