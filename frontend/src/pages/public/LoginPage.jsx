import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../features/auth/validation';
import { useLogin } from '../../features/auth/hooks';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';

const BrandPanel = () => (
  <div className="hidden lg:flex relative flex-col items-center justify-center bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] text-white p-12 overflow-hidden">
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }} />
    <div className="absolute top-10 left-10 w-60 h-60 bg-[#00B4D8]/15 rounded-full blur-[100px]" />
    <div className="relative text-center">
      <span className="text-6xl block mb-6">📖</span>
      <h2 className="text-3xl font-extrabold mb-3">Quran Academy</h2>
      <p className="text-white/70 text-lg mb-10">Your journey to Quran begins here</p>
      <div className="space-y-4 text-left max-w-xs mx-auto">
        {[
          { icon: '🎓', text: 'One-on-one personalized classes' },
          { icon: '👨‍🏫', text: '50+ certified expert teachers' },
          { icon: '⭐', text: '4.9 rating from 500+ students' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-white/80">
            <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-base flex-shrink-0">{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin, loading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const result = await handleLogin(data);
      const user = result.user;
      
      if (!user) return;

      if (user.status === 'pending') {
        navigate('/pending-approval');
        return;
      }
      if (user.status === 'rejected') {
        throw new Error('Your account has been rejected. Contact support.');
      }

      const role = user.role;
      if (role === ROLES.ADMIN) navigate(ROUTES.ADMIN_DASHBOARD);
      else if (role === ROLES.TEACHER) navigate(ROUTES.TEACHER_DASHBOARD);
      else navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (err) {
      if (err?.response?.data?.message === 'Your account is pending approval') {
        navigate('/pending-approval');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <BrandPanel />
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <span className="text-4xl block mb-2">📖</span>
            <h2 className="text-xl font-bold text-[#1A1A2E]">Quran Academy</h2>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-1">Welcome Back</h1>
          <p className="text-sm text-[#4A5568] mb-8">Sign in to continue your learning journey</p>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <AppInput
              label="Email Address" type="email" placeholder="you@example.com"
              icon={<span className="text-xs">✉️</span>} required
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <AppInput
                label="Password" type={showPassword ? 'text' : 'password'}
                placeholder="••••••••" required
                error={errors.password?.message}
                {...register('password')}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-[#4A5568] text-xs hover:text-[#1A1A2E] cursor-pointer">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm text-[#4A5568] cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[#E2E8F0] text-[#00B4D8] focus:ring-[#00B4D8]" />
                Remember me
              </label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-[#00B4D8] font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>

            <AppButton type="submit" variant="primary" loading={loading} fullWidth size="lg">
              Sign In
            </AppButton>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#4A5568]">or</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          <p className="text-center text-sm text-[#4A5568]">
            Don't have an account?{' '}
            <Link to={ROUTES.SIGNUP} className="text-[#00B4D8] font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
