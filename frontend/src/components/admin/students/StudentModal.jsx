import AppModal from '../../common/AppModal';
import StudentForm from './StudentForm';

const StudentModal = ({ show, onClose, student, onSubmit, loading }) => (
  <AppModal show={show} onClose={onClose} title={student ? 'Edit Student' : 'Add New Student'}>
    <StudentForm
      defaultValues={student || undefined}
      onSubmit={onSubmit}
      loading={loading}
      isEdit={!!student}
    />
  </AppModal>
);

export default StudentModal;
