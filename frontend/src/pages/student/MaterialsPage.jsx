import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import MaterialGrid from '../../components/teacher/materials/MaterialGrid';
import GridSkeleton from '../../components/common/GridSkeleton';
import { getMaterialsByStudent } from '../../features/materials/api';
import Toast, { useToast } from '../../components/common/Toast';
import handleApiError from '../../utils/handleApiError';

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await getMaterialsByStudent();
      const body = response.data || response;
      const list = body.data?.materials || body.materials || body.data || [];
      setMaterials(Array.isArray(list) ? list : []);
    } catch (err) {
      showToast(handleApiError(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <Toast toast={toast} />
      <PageHeader 
        title="📄 Study Materials" 
        subtitle="Access your course content, books, and references"
      />
      
      {loading ? (
        <GridSkeleton items={4} />
      ) : materials.length > 0 ? (
        <MaterialGrid materials={materials} loading={loading} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-12 text-center">
          <EmptyState 
            icon="📚" 
            title="No Materials Assigned" 
            message="Once your teacher uploads study materials for your courses, they will appear here."
          />
        </div>
      )}
    </div>
  );
};

export default MaterialsPage;
