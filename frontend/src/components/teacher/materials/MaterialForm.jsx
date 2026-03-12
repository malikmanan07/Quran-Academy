import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AppInput from '../../common/AppInput';
import AppButton from '../../common/AppButton';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  courseId: z.string().optional(),
  url: z.string().optional(),
  visibleToStudents: z.boolean().optional(),
});

const sel = "w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40";

const MaterialForm = ({ defaultValues, onSubmit, loading, isEdit, courses }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { title: '', description: '', type: '', courseId: '', url: '', visibleToStudents: true },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AppInput label="Title" placeholder="Material title" required error={errors.title?.message} {...register('title')} />
      <AppInput label="Description" placeholder="Brief description" error={errors.description?.message} {...register('description')} />
      <div className="grid grid-cols-2 gap-3">
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Type *</label>
          <select {...register('type')} className={`${sel} ${errors.type ? '!border-red-500' : ''}`}>
            <option value="">Select type</option>
            <option value="PDF">PDF</option>
            <option value="Video">Video</option>
            <option value="Audio">Audio</option>
            <option value="Link">Link</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Course</label>
          <select {...register('courseId')} className={sel}>
            <option value="">Select course</option>
            {(courses || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <AppInput label="URL / Link" placeholder="https://..." error={errors.url?.message} {...register('url')} />
      <label className="flex items-center gap-2 text-sm text-[#4A5568] mb-4 cursor-pointer">
        <input type="checkbox" {...register('visibleToStudents')} className="w-4 h-4 rounded border-[#E2E8F0] text-[#00B4D8]" />
        Visible to students
      </label>
      <div className="flex justify-end gap-3">
        <AppButton type="submit" variant="primary" loading={loading}>{isEdit ? 'Update' : 'Add Material'}</AppButton>
      </div>
    </form>
  );
};

export default MaterialForm;
