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
  specialization: z.string().optional(),
  qualification: z.string().optional(),
  bio: z.string().optional(),
});

const TeacherProfileForm = () => {
  const { user, login, token } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { 
      name: user?.name, 
      phone: user?.phone || '',
      specialization: user?.specialization || '',
      qualification: user?.qualification || '',
      bio: user?.bio || ''
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

  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TR';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00B4D8] to-[#1B3A5C] flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {initials}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">{user?.name}</h2>
          <p className="text-sm text-[#4A5568] capitalize">Instructor ({user?.role})</p>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <AppInput label="Email Address" type="email" value={user?.email} disabled />
          
          <AppInput label="Full Name" {...register('name')} error={errors.name?.message} />
          <AppInput label="Phone Number" {...register('phone')} error={errors.phone?.message} />
          <AppInput label="Specialization" {...register('specialization')} error={errors.specialization?.message} />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1A1A2E]">Qualification</label>
            <textarea 
              {...register('qualification')} 
              className={`w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:outline-none transition-shadow ${
                errors.qualification ? 'border-red-400 focus:ring-red-100' : 'border-[#E2E8F0] focus:border-[#00B4D8] focus:ring-[#00B4D8]/10'
              }`}
              rows={3} 
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1A1A2E]">Short Bio</label>
            <textarea 
              {...register('bio')} 
              className={`w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:outline-none transition-shadow ${
                errors.bio ? 'border-red-400 focus:ring-red-100' : 'border-[#E2E8F0] focus:border-[#00B4D8] focus:ring-[#00B4D8]/10'
              }`}
              rows={3} 
            />
          </div>

          <div className="pt-4">
            <AppButton type="submit" variant="primary" loading={loading}>Save Teacher Details</AppButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherProfileForm;
