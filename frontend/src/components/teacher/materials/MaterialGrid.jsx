import MaterialCard from './MaterialCard';
import EmptyState from '../../common/EmptyState';
import Loader from '../../common/Loader';

const MaterialGrid = ({ materials, loading, onEdit, onDelete }) => {
  if (loading) return <Loader />;
  if (!materials.length) return <EmptyState title="No Materials" message="Upload your first course material." />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {materials.map((m) => <MaterialCard key={m.id} material={m} onEdit={onEdit} onDelete={onDelete} />)}
    </div>
  );
};

export default MaterialGrid;
