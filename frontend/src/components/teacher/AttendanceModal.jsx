import { useState, useEffect } from 'react';
import AppModal from '../common/AppModal';
import AppButton from '../common/AppButton';

const AttendanceModal = ({ show, onClose, classData, onSubmit, loading }) => {
  const [attendance, setAttendance] = useState({
    status: 'present',
    notes: ''
  });

  useEffect(() => {
    if (show && classData) {
      setAttendance({ status: 'present', notes: '' });
    }
  }, [show, classData]);

  if (!classData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      classId: classData.id,
      studentId: classData.studentId,
      status: attendance.status,
      date: classData.date,
      notes: attendance.notes
    });
  };

  const statuses = [
    { value: 'present', label: 'Present', color: 'bg-green-100 text-green-800 border-green-200 focus:ring-green-500' },
    { value: 'absent', label: 'Absent', color: 'bg-red-100 text-red-800 border-red-200 focus:ring-red-500' },
    { value: 'late', label: 'Late', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 focus:ring-yellow-500' }
  ];

  return (
    <AppModal show={show} onClose={onClose} title="Mark Attendance">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#F0F4F8] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
          <div className="flex justify-between">
            <span className="text-xs font-semibold text-[#4A5568] uppercase">Date</span>
            <span className="text-sm font-bold text-[#1B3A5C]">{classData.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-semibold text-[#4A5568] uppercase">Student</span>
            <span className="text-sm font-bold text-[#1B3A5C]">{classData.studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-semibold text-[#4A5568] uppercase">Course</span>
            <span className="text-sm text-[#1B3A5C]">{classData.courseName}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-3">Status *</label>
          <div className="grid grid-cols-3 gap-3">
            {statuses.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => setAttendance({ ...attendance, status: s.value })}
                className={`py-3 px-2 rounded-xl border-2 text-sm font-bold transition-all ${
                  attendance.status === s.value 
                    ? `${s.color} border-current ring-2 ring-offset-2 scale-105` 
                    : 'bg-white text-[#4A5568] border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Notes (Optional)</label>
           <textarea 
             value={attendance.notes}
             onChange={(e) => setAttendance({ ...attendance, notes: e.target.value })}
             rows={3}
             placeholder="Any comments about the student's attendance..."
             className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
           />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </AppButton>
          <AppButton type="submit" loading={loading}>
            Save Attendance
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};

export default AttendanceModal;
