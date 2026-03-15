import { useAuth } from '../../context/AuthContext';
import { useSearch } from '../../hooks/useSearch';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import MaterialGrid from '../../components/teacher/materials/MaterialGrid';
import GridSkeleton from '../../components/common/GridSkeleton';
import SearchInput from '../../components/common/SearchInput';
import AppPagination from '../../components/common/AppPagination';
import { getMaterialsByStudent } from '../../features/materials/api';
import Toast, { useToast } from '../../components/common/Toast';

const MaterialsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { 
    data: materials, 
    loading, 
    total, 
    page, 
    setPage, 
    pageSize, 
    setPageSize, 
    search, 
    setSearch 
  } = useSearch(getMaterialsByStudent, { 
    cacheKey: `student:materials_list:${user?.id}`,
    pageSize: 8
  });

  return (
    <div className="animate-fade-in space-y-6">
      <Toast toast={toast} />
      <PageHeader 
        title="📄 Study Materials" 
        subtitle={`${total} materials available for your courses`}
      />
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Search materials..." 
          className="w-full md:w-80"
        />
      </div>

      {loading && materials.length === 0 ? (
        <GridSkeleton items={pageSize} />
      ) : materials.length > 0 ? (
        <div className="space-y-6">
          <MaterialGrid materials={materials} loading={loading} />
          <AppPagination 
            total={total} 
            page={page} 
            pageSize={pageSize} 
            onPageChange={setPage} 
            onPageSizeChange={setPageSize} 
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-12 text-center">
          <EmptyState 
            icon="📚" 
            title={search ? "No matches found" : "No Materials Assigned"} 
            message={search ? "Try a different search term" : "Once your teacher uploads study materials for your courses, they will appear here."}
          />
        </div>
      )}
    </div>
  );
};

export default MaterialsPage;
