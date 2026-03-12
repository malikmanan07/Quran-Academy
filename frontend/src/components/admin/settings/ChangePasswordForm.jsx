import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AppInput from '../../common/AppInput';
import AppButton from '../../common/AppButton';
import { useToast } from '../../common/Toast';
import http from '../../../services/http';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string().min(1, 'Confirm your new password')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

const ChangePasswordForm = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await http.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      showToast('success', 'Password changed successfully');
      reset();
    } catch {
      showToast('error', 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden mt-6">
      <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#1A1A2E]">Change Password</h2>
          <p className="text-sm text-[#4A5568]">Ensure your account is using a long, random password to stay secure.</p>
        </div>
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xl">
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <AppInput 
            label="Current Password" 
            type={showPassword ? 'text' : 'password'} 
            {...register('currentPassword')} 
            error={errors.currentPassword?.message} 
          />
          
          <AppInput 
            label="New Password" 
            type={showPassword ? 'text' : 'password'} 
            {...register('newPassword')} 
            error={errors.newPassword?.message} 
          />
          
          <AppInput 
            label="Confirm New Password" 
            type={showPassword ? 'text' : 'password'} 
            {...register('confirmPassword')} 
            error={errors.confirmPassword?.message} 
          />

          <div className="pt-4">
            <AppButton type="submit" variant="primary" loading={loading}>
              Update Password
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
