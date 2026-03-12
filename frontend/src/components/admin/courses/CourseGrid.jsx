import CourseCard from './CourseCard';
import EmptyState from '../../common/EmptyState';
import Loader from '../../common/Loader';

const CourseGrid = ({ courses, loading, onEdit, onDelete }) => {
  if (loading) return <Loader />;
  if (!courses.length) return <EmptyState title="No Courses" message="Create your first course to get started." />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default CourseGrid;
