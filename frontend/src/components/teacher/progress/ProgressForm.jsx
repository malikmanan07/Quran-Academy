import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AppInput from '../../common/AppInput';
import AppButton from '../../common/AppButton';

const schema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  lesson: z.string().min(1, 'Lesson title is required'),
  lessonCovered: z.string().optional(),
  tajweedNotes: z.string().optional(),
  homework: z.string().optional(),
  rating: z.string().min(1, 'Rating is required'),
  remarks: z.string().optional(),
});

const sel = "w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40";
const ta = `${sel} resize-none`;

const ProgressForm = ({ defaultValues, onSubmit, loading, isEdit, students }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { studentId: '', lesson: '', lessonCovered: '', tajweedNotes: '', homework: '', rating: '', remarks: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Student *</label>
        <select {...register('studentId')} className={`${sel} mb-0 ${errors.studentId ? '!border-red-500' : ''}`}>
          <option value="">Select student</option>
          {(students || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {errors.studentId && <p className="mt-1 text-xs text-red-500">{errors.studentId.message}</p>}
      </div>
      <AppInput label="Lesson Title" placeholder="e.g. Surah Al-Baqarah" required
        error={errors.lesson?.message} {...register('lesson')} />
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Lesson Covered</label>
        <textarea {...register('lessonCovered')} rows={2} placeholder="Details of lesson..." className={ta} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Tajweed Notes</label>
        <textarea {...register('tajweedNotes')} rows={2} placeholder="Tajweed observations..." className={ta} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Homework</label>
        <textarea {...register('homework')} rows={2} placeholder="Homework for student..." className={ta} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Performance Rating *</label>
        <select {...register('rating')} className={`${sel} ${errors.rating ? '!border-red-500' : ''}`}>
          <option value="">Select rating</option>
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{'⭐'.repeat(n)} ({n}/5)</option>)}
        </select>
        {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Remarks</label>
        <textarea {...register('remarks')} rows={2} placeholder="Additional remarks..." className={ta} />
      </div>
      <div className="flex justify-end gap-3 mt-2">
        <AppButton type="submit" variant="primary" loading={loading}>{isEdit ? 'Update' : 'Add Report'}</AppButton>
      </div>
    </form>
  );
};

export default ProgressForm;
