import { useState, useEffect } from 'react';
import AppModal from '../common/AppModal';
import AppInput from '../common/AppInput';
import AppButton from '../common/AppButton';

const EnrollmentRequestModal = ({ show, onClose, course, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    preferredDays: [],
    preferredTime: 'Morning',
    message: ''
  });

  useEffect(() => {
    if (show) setFormData({ preferredDays: [], preferredTime: 'Morning', message: '' });
  }, [show]);

  if (!course) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      courseId: course.id,
      preferredDays: formData.preferredDays.join(', '),
      preferredTime: formData.preferredTime,
      message: formData.message
    });
  };

  return (
    <AppModal show={show} onClose={onClose} title="Request Enrollment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#F0F4F8] p-3 rounded-xl border border-[#E2E8F0]">
          <p className="text-sm text-[#4A5568]">Course</p>
          <p className="font-bold text-[#1B3A5C]">{course.name}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">Preferred Days</label>
          <div className="flex flex-wrap gap-2">
            {days.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                  formData.preferredDays.includes(day)
                    ? 'bg-[#00B4D8] text-white border-[#00B4D8]'
                    : 'bg-white text-[#4A5568] border-[#E2E8F0] hover:border-[#00B4D8]'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">Preferred Time</label>
          <select
            value={formData.preferredTime}
            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
            className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
            required
          >
            <option value="Morning">Morning (8AM - 12PM)</option>
            <option value="Afternoon">Afternoon (12PM - 4PM)</option>
            <option value="Evening">Evening (4PM - 8PM)</option>
            <option value="Night">Night (8PM - 12AM)</option>
          </select>
        </div>

        <AppInput
          label="Message to Admin (Optional)"
          name="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          multiline
          rows={3}
          placeholder="Any specific requests or requirements..."
        />

        <div className="flex justify-end gap-3 mt-6">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </AppButton>
          <AppButton type="submit" loading={loading} disabled={formData.preferredDays.length === 0}>
            Submit Request
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};

export default EnrollmentRequestModal;
