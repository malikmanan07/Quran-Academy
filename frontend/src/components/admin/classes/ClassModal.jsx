import AppModal from '../../common/AppModal';
import ClassForm from './ClassForm';

const ClassModal = ({ show, onClose, classData, onSubmit, loading, students, teachers, courses }) => (
  <AppModal show={show} onClose={onClose} title={classData ? 'Edit Class' : 'Schedule New Class'} size="lg">
    <ClassForm
      defaultValues={classData || undefined}
      onSubmit={onSubmit}
      loading={loading}
      isEdit={!!classData}
      students={students}
      teachers={teachers}
      courses={courses}
    />
  </AppModal>
);

export default ClassModal;
