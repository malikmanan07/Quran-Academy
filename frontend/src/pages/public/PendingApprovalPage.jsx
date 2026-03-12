import { useNavigate } from 'react-router-dom';
import AppButton from '../../components/common/AppButton';
import { useAuth } from '../../context/AuthContext';

const PendingApprovalPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden text-center p-8 border border-[#E2E8F0]">
        <div className="w-20 h-20 bg-[#00B4D8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⏳</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1A1A2E] mb-3">Account Under Review</h1>
        
        <p className="text-[#4A5568] mb-4">
          Thank you for signing up! Your account is currently being reviewed by our administrative team. You will be notified once approved.
        </p>
        
        <div className="bg-amber-50 text-amber-700 p-3 rounded-lg text-sm font-medium mb-8">
          This process usually takes 24-48 hours.
        </div>

        <AppButton variant="outline" fullWidth onClick={handleLogout}>
          Logout
        </AppButton>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
