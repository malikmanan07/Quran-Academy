import PageHeader from '../../components/common/PageHeader';
import TeacherProfileForm from '../../components/teacher/profile/TeacherProfileForm';
import TeacherChangePassword from '../../components/teacher/profile/TeacherChangePassword';

const TeacherProfilePage = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your teacher profile information and account security"
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <TeacherProfileForm />
        <div className="xl:-mt-6">
          <TeacherChangePassword />
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
