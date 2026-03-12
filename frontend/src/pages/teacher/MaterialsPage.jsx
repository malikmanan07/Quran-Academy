import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import MaterialGrid from '../../components/teacher/materials/MaterialGrid';
import MaterialModal from '../../components/teacher/materials/MaterialModal';
import AppModal from '../../components/common/AppModal';
import AppButton from '../../components/common/AppButton';
import { getAllMaterials, createMaterial, updateMaterial, deleteMaterial } from '../../features/materials/api';
import { getAllCourses } from '../../features/courses/api';
import handleApiError from '../../utils/handleApiError';

const MaterialsPage = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMaterial, setEditMaterial] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const [m, c] = await Promise.all([getAllMaterials(), getAllCourses()]);
      setMaterials(m.data.materials || m.data || []);
      setCourses(c.data.courses || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editMaterial) { await updateMaterial(editMaterial.id, data); showToast('Material updated'); }
      else { await createMaterial({ ...data, uploadedBy: user?.id }); showToast('Material added'); }
      setShowModal(false); setEditMaterial(null); fetch();
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  const confirmDelete = async () => {
    try { await deleteMaterial(deleteTarget.id); showToast('Material deleted'); setDeleteTarget(null); fetch(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Course Materials" subtitle={`${materials.length} materials`}
        actionLabel="Add Material" onAction={() => { setEditMaterial(null); setShowModal(true); }} />
      <MaterialGrid materials={materials} loading={loading}
        onEdit={(m) => { setEditMaterial(m); setShowModal(true); }} onDelete={setDeleteTarget} />
      <MaterialModal show={showModal} onClose={() => { setShowModal(false); setEditMaterial(null); }}
        material={editMaterial} onSubmit={onSubmit} loading={saving} courses={courses} />
      <AppModal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" size="sm">
        <p className="text-sm text-[#4A5568] mb-6">Delete <strong>{deleteTarget?.title}</strong>?</p>
        <div className="flex justify-end gap-3">
          <AppButton variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</AppButton>
          <AppButton variant="danger" onClick={confirmDelete}>Delete</AppButton>
        </div>
      </AppModal>
    </div>
  );
};

export default MaterialsPage;
