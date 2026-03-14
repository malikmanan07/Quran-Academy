import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../../features/auth/validation';
import { useRegister } from '../../features/auth/hooks';
import { ROUTES } from '../../constants/routes';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';

const BrandPanel = () => (
  <div className="hidden lg:flex relative flex-col items-center justify-center bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] text-white p-12 overflow-hidden">
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }} />
    <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#00B4D8]/15 rounded-full blur-[100px]" />
    <div className="relative text-center">
      <span className="text-6xl block mb-6">📖</span>
      <h2 className="text-3xl font-extrabold mb-3">Quran Academy</h2>
      <p className="text-white/70 text-lg mb-10">Begin your Quranic journey today</p>
      <div className="space-y-4 text-left max-w-xs mx-auto">
        {[
          { icon: '🎯', text: 'Personalized learning for all ages' },
          { icon: '📊', text: 'Track your progress in real-time' },
          { icon: '🏆', text: 'Earn certificates on completion' },
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

const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'parent', label: 'Parent' },
];

const SignupPage = () => {
  const navigate = useNavigate();
  const { handleRegister, loading, error } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '', role: '', terms: false },
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, terms, ...payload } = data;
      await handleRegister(payload);
      navigate(ROUTES.LOGIN);
    } catch { /* handled */ }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <BrandPanel />
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-6">
            <span className="text-4xl block mb-2">📖</span>
            <h2 className="text-xl font-bold text-[#1A1A2E]">Quran Academy</h2>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-1">Create Account</h1>
          <p className="text-sm text-[#4A5568] mb-6">Join Quran Academy and start learning</p>

          {error && (
            <div className="mb-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <AppInput label="Full Name" placeholder="Your full name"
              icon={<span className="text-xs">👤</span>} required
              error={errors.name?.message} {...register('name')} />

            <AppInput label="Email Address" type="email" placeholder="you@example.com"
              icon={<span className="text-xs">✉️</span>} required
              error={errors.email?.message} {...register('email')} />

            <AppInput label="Phone Number" type="tel" placeholder="03XX XXXXXXX"
              icon={<span className="text-xs">📞</span>} required
              error={errors.phone?.message} {...register('phone')} />

            <div className="relative">
              <AppInput label="Password" type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 chars, uppercase + number" required
                error={errors.password?.message} {...register('password')} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-[#4A5568] text-xs hover:text-[#1A1A2E] cursor-pointer">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <AppInput label="Confirm Password" type="password"
              placeholder="Re-enter password" required
              error={errors.confirmPassword?.message} {...register('confirmPassword')} />

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">
                Role <span className="text-red-500 ml-0.5">*</span>
              </label>
              <select {...register('role')}
                className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#1A1A2E] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] ${errors.role ? 'border-red-500' : 'border-[#E2E8F0]'}`}>
                <option value="">Select role</option>
                {roleOptions.map(o => <option key={`${o.value}-${o.label}`} value={o.value}>{o.label}</option>)}
              </select>
              {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
            </div>

            <label className="flex items-start gap-2.5 mb-6 cursor-pointer">
              <input type="checkbox" {...register('terms')}
                className="mt-0.5 w-4 h-4 rounded border-[#E2E8F0] text-[#00B4D8] focus:ring-[#00B4D8]" />
              <span className="text-xs text-[#4A5568]">
                I agree to the <a href="#" className="text-[#00B4D8] hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-[#00B4D8] hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p className="-mt-4 mb-4 text-xs text-red-500">{errors.terms.message}</p>}

            <AppButton type="submit" variant="accent" loading={loading} fullWidth size="lg">
              Create Account
            </AppButton>
          </form>

          <p className="text-center text-sm text-[#4A5568] mt-6">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-[#00B4D8] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
