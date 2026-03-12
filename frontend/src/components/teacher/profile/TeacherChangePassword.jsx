// Teacher and Admin change password logic is identical, so we can inherit the Admin one just by reusing it
// For semantic clarity, wrapping it.
import ChangePasswordForm from '../../admin/settings/ChangePasswordForm';

const TeacherChangePassword = () => {
  return <ChangePasswordForm />;
};

export default TeacherChangePassword;
