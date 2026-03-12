import { useNavigate } from 'react-router-dom';
import AppButton from '../../components/common/AppButton';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden text-center p-8 border border-[#E2E8F0]">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-red-500 font-bold">403</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1A1A2E] mb-3">Unauthorized</h1>
        
        <p className="text-[#4A5568] mb-8">
          You don't have permission to access this page.
        </p>

        <AppButton variant="primary" fullWidth onClick={() => navigate(-1)}>
          Go Back
        </AppButton>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
