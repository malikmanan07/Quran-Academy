import AppModal from '../../common/AppModal';
import ProgressForm from './ProgressForm';

const ProgressModal = ({ show, onClose, report, onSubmit, loading, students }) => (
  <AppModal show={show} onClose={onClose} title={report ? 'Edit Report' : 'Add Progress Report'} size="lg">
    <ProgressForm defaultValues={report || undefined} onSubmit={onSubmit} loading={loading} isEdit={!!report} students={students} />
  </AppModal>
);

export default ProgressModal;
