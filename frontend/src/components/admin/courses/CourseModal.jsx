import AppModal from '../../common/AppModal';
import CourseForm from './CourseForm';

const CourseModal = ({ show, onClose, course, onSubmit, loading }) => (
  <AppModal show={show} onClose={onClose} title={course ? 'Edit Course' : 'Add New Course'}>
    <CourseForm defaultValues={course || undefined} onSubmit={onSubmit} loading={loading} isEdit={!!course} />
  </AppModal>
);

export default CourseModal;
