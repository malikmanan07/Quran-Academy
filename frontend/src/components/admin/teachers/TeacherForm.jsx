import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AppInput from '../../common/AppInput';
import AppButton from '../../common/AppButton';

const schema = z.object({
  name: z.string().min(1, 'Name is required').min(3, 'Min 3 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  password: z.string().optional(),
});

const TeacherForm = ({ defaultValues, onSubmit, loading, isEdit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(
      isEdit ? schema : schema.extend({ password: z.string().min(6, 'Min 6 characters') })
    ),
    defaultValues: defaultValues || { name: '', email: '', phone: '', specialization: '', password: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AppInput label="Full Name" placeholder="Teacher name" required
        error={errors.name?.message} {...register('name')} />
      <AppInput label="Email" type="email" placeholder="teacher@email.com" required
        error={errors.email?.message} {...register('email')} />
      <AppInput label="Phone" type="tel" placeholder="03XX XXXXXXX"
        error={errors.phone?.message} {...register('phone')} />
      <AppInput label="Specialization" placeholder="e.g. Tajweed, Hifz"
        error={errors.specialization?.message} {...register('specialization')} />
      {!isEdit && (
        <AppInput label="Password" type="password" placeholder="Min 6 chars" required
          error={errors.password?.message} {...register('password')} />
      )}
      <div className="flex justify-end gap-3 mt-4">
        <AppButton type="submit" variant="primary" loading={loading}>
          {isEdit ? 'Update' : 'Add Teacher'}
        </AppButton>
      </div>
    </form>
  );
};

export default TeacherForm;
