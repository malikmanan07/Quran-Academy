import AppModal from '../../common/AppModal';
import MaterialForm from './MaterialForm';

const MaterialModal = ({ show, onClose, material, onSubmit, loading, courses }) => (
  <AppModal show={show} onClose={onClose} title={material ? 'Edit Material' : 'Add Course Material'}>
    <MaterialForm defaultValues={material || undefined} onSubmit={onSubmit} loading={loading} isEdit={!!material} courses={courses} />
  </AppModal>
);

export default MaterialModal;
