import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AppInput from '../../common/AppInput';
import AppButton from '../../common/AppButton';

const schema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  courseId: z.string().min(1, 'Course is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.string().optional(),
  meetingPlatform: z.string().optional().default('other'),
  meetingLink: z.string().optional(),
  meetingId: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
});

const ClassForm = ({ defaultValues, onSubmit, loading, isEdit, students, teachers, courses }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { studentId: '', teacherId: '', courseId: '', date: '', time: '', duration: '45min', meetingPlatform: 'other', meetingLink: '', meetingId: '', notes: '', status: 'scheduled' },
  });

  const sel = "w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 mb-4";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Student *</label>
        <select {...register('studentId')} className={`${sel} ${errors.studentId ? '!border-red-500' : ''}`}>
          <option value="">Select student</option>
          {(students || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Teacher *</label>
        <select {...register('teacherId')} className={`${sel} ${errors.teacherId ? '!border-red-500' : ''}`}>
          <option value="">Select teacher</option>
          {(teachers || []).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Course *</label>
        <select {...register('courseId')} className={`${sel} ${errors.courseId ? '!border-red-500' : ''}`}>
          <option value="">Select course</option>
          {(courses || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <AppInput label="Date" type="date" required error={errors.date?.message} {...register('date')} />
        <AppInput label="Time" type="time" required error={errors.time?.message} {...register('time')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Duration</label>
          <select {...register('duration')} className={sel}>
            <option value="30min">30 Minutes</option>
            <option value="45min">45 Minutes</option>
            <option value="1hr">1 Hour</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Status</label>
          <select {...register('status')} className={sel}>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Platform</label>
          <select {...register('meetingPlatform')} className={sel}>
            <option value="zoom">🎥 Zoom</option>
            <option value="meet">📹 Google Meet</option>
            <option value="teams">🔵 Microsoft Teams</option>
            <option value="whereby">🟣 Whereby</option>
            <option value="other">📞 Other</option>
          </select>
        </div>
        <AppInput label="Meeting Link" placeholder="https://..." {...register('meetingLink')} />
      </div>
      <div className="mb-4">
        <AppInput label="Meeting ID / Passcode (Optional)" placeholder="e.g. 123 456 7890" {...register('meetingId')} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Notes</label>
        <textarea {...register('notes')} rows={3} placeholder="Additional notes..."
          className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 resize-none" />
      </div>
      <div className="flex justify-end gap-3 mt-2">
        <AppButton type="submit" variant="primary" loading={loading}>
          {isEdit ? 'Update' : 'Schedule Class'}
        </AppButton>
      </div>
    </form>
  );
};

export default ClassForm;
