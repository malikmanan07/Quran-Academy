import { useNavigate } from 'react-router-dom';
import AppButton from '../../components/common/AppButton';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden text-center p-8 border border-[#E2E8F0]">
        <h1 className="text-6xl font-extrabold text-[#1B3A5C] mb-4">404</h1>
        
        <h2 className="text-2xl font-bold text-[#1A1A2E] mb-3">Page Not Found</h2>
        
        <p className="text-[#4A5568] mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <AppButton variant="primary" fullWidth onClick={() => navigate('/')}>
          Back to Home
        </AppButton>
      </div>
    </div>
  );
};

export default NotFoundPage;
