import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../../features/auth/validation';
import { forgotPassword } from '../../features/auth/api';
import { ROUTES } from '../../constants/routes';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import handleApiError from '../../utils/handleApiError';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-[#F0F4F8]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-[#E2E8F0]">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">📖</span>
            <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">Forgot Password?</h1>
            <p className="text-sm text-[#4A5568]">
              Enter your email and we'll send you reset instructions
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
              <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">Check Your Email</h3>
              <p className="text-sm text-[#4A5568] mb-6">
                We've sent password reset instructions to your email address.
              </p>
              <Link to={ROUTES.LOGIN}>
                <AppButton variant="primary" fullWidth>Back to Login</AppButton>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <AppInput
                  label="Email Address" type="email"
                  placeholder="you@example.com"
                  icon={<span className="text-xs">✉️</span>} required
                  error={errors.email?.message}
                  {...register('email')}
                />
                <AppButton type="submit" variant="primary" loading={loading} fullWidth size="lg" className="mt-2">
                  Send Reset Link
                </AppButton>
              </form>

              <div className="text-center mt-6">
                <Link to={ROUTES.LOGIN} className="text-sm text-[#00B4D8] font-medium hover:underline inline-flex items-center gap-1">
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
