import { useState, useEffect } from 'react';
import AppModal from '../common/AppModal';
import AppSelect from '../common/AppSelect';
import AppButton from '../common/AppButton';

const AssignTeacherModal = ({ show, onClose, request, teachers, onSubmit, loading }) => {
  const [teacherId, setTeacherId] = useState('');

  useEffect(() => {
    if (show) setTeacherId('');
  }, [show]);

  if (!request) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teacherId) return;
    
    // Actually when approving enrollment we just update status to approved,
    // and ideally the admin assigns the student to a teacher class separately,
    // OR we pass teacherId so backend can create a class. Let's just create an empty
    // submit for now that approves the request. The UI asked for: "AssignTeacherModal... When approving enrollment: Auto shows course info, Teacher dropdown, Confirm button."
    onSubmit({ requestId: request.id, teacherId });
  };

  const options = teachers.map(t => ({
    value: t.id,
    label: `${t.name} ${t.specialization ? `(${t.specialization})` : ''}`
  }));

  return (
    <AppModal show={show} onClose={onClose} title="Approve & Assign Teacher">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#F0F4F8] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
          <div>
            <span className="text-xs font-semibold text-[#4A5568] uppercase">Student</span>
            <p className="font-bold text-[#1B3A5C]">{request.studentName}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#4A5568] uppercase">Course</span>
            <p className="font-bold text-[#1B3A5C]">{request.courseName}</p>
          </div>
          {(request.preferredDays || request.preferredTime) && (
            <div>
              <span className="text-xs font-semibold text-[#4A5568] uppercase">Prefers</span>
              <p className="text-sm text-[#1B3A5C]">
                {request.preferredDays} • {request.preferredTime}
              </p>
            </div>
          )}
        </div>

        <AppSelect
          label="Assign Teacher (Optional)"
          name="teacherId"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          options={[{ value: '', label: 'Approve without assigning teacher yet' }, ...options]}
        />

        <div className="flex justify-end gap-3 mt-6">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </AppButton>
          <AppButton type="submit" loading={loading}>
            Approve Request
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};

export default AssignTeacherModal;
