import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../context/AuthContext';
import AppInput from '../../common/AppInput';
import AppButton from '../../common/AppButton';
import { useToast } from '../../common/Toast';
import http from '../../../services/http';

const profileSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  phone: z.string().optional(),
});

const ProfileForm = () => {
  const { user, login, token } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name, phone: user?.phone || '' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: response } = await http.put('/auth/profile', data);
      login(response.user, token);
      showToast('success', 'Profile updated successfully');
    } catch {
      showToast('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0]">
        <h2 className="text-xl font-bold text-[#1A1A2E]">Profile Information</h2>
        <p className="text-sm text-[#4A5568]">Update your personal details here.</p>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] flex items-center justify-center text-white text-3xl font-bold">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user?.name}</h3>
            <p className="text-[#4A5568]">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <AppInput label="Email Address" type="email" value={user?.email} disabled />
          
          <AppInput 
            label="Full Name" 
            {...register('name')} 
            error={errors.name?.message} 
          />
          
          <AppInput 
            label="Phone Number" 
            {...register('phone')} 
            error={errors.phone?.message} 
          />

          <div className="pt-4">
            <AppButton type="submit" variant="primary" loading={loading}>
              Save Changes
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
