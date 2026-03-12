import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AppInput from '../../common/AppInput';
import AppButton from '../../common/AppButton';

const schema = z.object({
  name: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  price: z.string().optional(),
  duration: z.string().optional(),
  level: z.string().optional(),
});

const CourseForm = ({ defaultValues, onSubmit, loading, isEdit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { name: '', description: '', price: '', duration: '', level: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AppInput label="Course Name" placeholder="e.g. Tajweed ul Quran" required
        error={errors.name?.message} {...register('name')} />
      <AppInput label="Description" placeholder="Course description"
        error={errors.description?.message} {...register('description')} />
      <div className="grid grid-cols-2 gap-3">
        <AppInput label="Price (PKR)" type="number" placeholder="2500"
          error={errors.price?.message} {...register('price')} />
        <AppInput label="Duration" placeholder="e.g. 6 Months"
          error={errors.duration?.message} {...register('duration')} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Level</label>
        <select {...register('level')}
          className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40">
          <option value="">Select level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="All Levels">All Levels</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <AppButton type="submit" variant="primary" loading={loading}>
          {isEdit ? 'Update' : 'Add Course'}
        </AppButton>
      </div>
    </form>
  );
};

export default CourseForm;
