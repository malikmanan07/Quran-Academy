import PageHeader from '../../components/common/PageHeader';
import StudentProfileForm from '../../components/student/profile/StudentProfileForm';
import StudentChangePassword from '../../components/student/profile/StudentChangePassword';

const StudentProfilePage = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your student account information and security."
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <StudentProfileForm />
        <div className="xl:-mt-6">
          <StudentChangePassword />
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
