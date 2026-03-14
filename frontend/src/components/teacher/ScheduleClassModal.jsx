import { useState, useEffect } from 'react';
import AppModal from '../common/AppModal';
import AppInput from '../common/AppInput';
import AppSelect from '../common/AppSelect';
import AppButton from '../common/AppButton';

const ScheduleClassModal = ({ show, onClose, students, onSubmit, loading, initialData = null }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    date: '',
    time: '',
    duration: '30 mins',
    meetingPlatform: 'other',
    meetingLink: '',
    meetingId: '',
    notes: ''
  });

  useEffect(() => {
    if (show) {
      if (initialData) {
        setFormData({
          studentId: initialData.studentId || '',
          courseId: initialData.courseId || '',
          date: initialData.date || '',
          time: initialData.time || '',
          duration: initialData.duration || '30 mins',
          meetingPlatform: initialData.meetingPlatform || 'other',
          meetingLink: initialData.meetingLink || '',
          meetingId: initialData.meetingId || '',
          notes: initialData.notes || ''
        });
      } else {
        setFormData({
          studentId: '', courseId: '', date: '', time: '',
          duration: '30 mins', meetingPlatform: 'other', meetingLink: '',
          meetingId: '', notes: ''
        });
      }
    }
  }, [show, initialData]);

  // When student changes, auto-select their course if possible.
  // In a real scenario, you might fetch student's active courses here.
  // We'll rely on the parent or backend to validate/fill or just leave it for the user to pick if multiple.
  const handleStudentChange = (e) => {
    const sId = e.target.value;
    const student = students.find(s => s.id === parseInt(sId));
    setFormData({ ...formData, studentId: sId, courseId: student?.courseId || '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      studentId: parseInt(formData.studentId),
      courseId: parseInt(formData.courseId) || undefined
    });
  };

  const uniqueStudents = students.filter((s, i, self) => i === self.findIndex(x => x.id === s.id));
  const studentOptions = uniqueStudents.map(s => ({ value: String(s.id), label: s.name }));
  
  const platformOptions = [
    { value: 'zoom', label: '🎥 Zoom' },
    { value: 'meet', label: '📹 Google Meet' },
    { value: 'teams', label: '🔵 Microsoft Teams' },
    { value: 'whereby', label: '🟣 Whereby' },
    { value: 'other', label: '📞 Other' }
  ];

  const durationOptions = [
    { value: '30 mins', label: '30 Minutes' },
    { value: '45 mins', label: '45 Minutes' },
    { value: '60 mins', label: '1 Hour' },
    { value: '90 mins', label: '1.5 Hours' }
  ];

  return (
    <AppModal show={show} onClose={onClose} title={initialData ? "Reschedule Class" : "Schedule New Class"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AppSelect
          label="Student"
          name="studentId"
          value={String(formData.studentId)}
          onChange={handleStudentChange}
          options={studentOptions}
          required
          disabled={!!initialData} // Don't allow changing student when rescheduling
        />

        <div className="grid grid-cols-2 gap-4">
          <AppInput label="Date" type="date" name="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          <AppInput label="Time" type="time" name="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
        </div>

        <AppSelect label="Duration" name="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} options={durationOptions} required />

        <div className="border-t border-[#E2E8F0] pt-4 mt-4">
          <h4 className="text-sm font-bold text-[#1A1A2E] mb-3">Meeting Details</h4>
          <AppSelect label="Platform" name="meetingPlatform" value={formData.meetingPlatform} onChange={(e) => setFormData({ ...formData, meetingPlatform: e.target.value })} options={platformOptions} required />
          <AppInput label="Meeting Link" type="url" name="meetingLink" value={formData.meetingLink} onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })} placeholder="https://..." required />
          <AppInput label="Meeting ID / Passcode (Optional)" name="meetingId" value={formData.meetingId} onChange={(e) => setFormData({ ...formData, meetingId: e.target.value })} />
        </div>

        <AppInput label="Notes for Student (Optional)" name="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} multiline rows={2} />

        <div className="flex justify-end gap-3 mt-6">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</AppButton>
          <AppButton type="submit" loading={loading}>{initialData ? "Save Changes" : "Schedule Class"}</AppButton>
        </div>
      </form>
    </AppModal>
  );
};

export default ScheduleClassModal;
