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
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
});

const StudentProfileForm = () => {
  const { user, login, token } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { 
      name: user?.name, 
      phone: user?.phone || '',
      guardianName: user?.guardianName || '',
      guardianPhone: user?.guardianPhone || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: response } = await http.put('/auth/profile', data);
      login(response.user, token);
      showToast('success', 'Profile updated successfully');
    } catch { showToast('error', 'Failed to update profile'); }
    finally { setLoading(false); }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#00B4D8] flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {initials}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">{user?.name}</h2>
          <p className="text-sm text-[#4A5568] capitalize">Student Account</p>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <AppInput label="Email Address" type="email" value={user?.email} disabled />
          
          <AppInput label="Full Name" {...register('name')} error={errors.name?.message} />
          <AppInput label="Student Phone" {...register('phone')} error={errors.phone?.message} />
          
          <hr className="my-6 border-[#E2E8F0] border-t-2 border-dashed" />
          <h3 className="font-semibold text-lg text-[#1A1A2E] mb-2">Guardian Contact</h3>
          
          <AppInput label="Guardian Name" {...register('guardianName')} error={errors.guardianName?.message} />
          <AppInput label="Guardian Phone" {...register('guardianPhone')} error={errors.guardianPhone?.message} />

          <div className="pt-4">
            <AppButton type="submit" variant="primary" loading={loading}>Save My Details</AppButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfileForm;
