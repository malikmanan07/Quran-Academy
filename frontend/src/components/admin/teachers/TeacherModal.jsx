import AppModal from '../../common/AppModal';
import TeacherForm from './TeacherForm';

const TeacherModal = ({ show, onClose, teacher, onSubmit, loading }) => (
  <AppModal show={show} onClose={onClose} title={teacher ? 'Edit Teacher' : 'Add New Teacher'}>
    <TeacherForm defaultValues={teacher || undefined} onSubmit={onSubmit} loading={loading} isEdit={!!teacher} />
  </AppModal>
);

export default TeacherModal;
