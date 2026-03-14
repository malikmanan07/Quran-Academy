import { useState, useEffect } from 'react';
import AppModal from '../common/AppModal';
import AppSelect from '../common/AppSelect';
import AppButton from '../common/AppButton';
import Toast, { useToast } from '../common/Toast';
import http from '../../services/http';

const GRADES = [
  { value: 'excellent', label: 'Excellent 🌟' },
  { value: 'good', label: 'Good 👍' },
  { value: 'needs-improvement', label: 'Needs Improvement ⚠️' },
  { value: 'poor', label: 'Poor ❌' },
];

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(0, i).toLocaleString('default', { month: 'long' }),
}));

const textareaClass = "w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] resize-none";
const labelClass = "block text-sm font-medium text-[#1A1A2E] mb-1.5";

const FeedbackModal = ({ isOpen, onClose, student, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useToast();
  const today = new Date();
  const [formData, setFormData] = useState({
    studentId: student?.id,
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    overallGrade: 'good',
    sabaqProgress: '',
    tajweedProgress: '',
    behavior: '',
    recommendations: '',
  });

  // Sync studentId when student or modal changes
  useEffect(() => {
    if (isOpen && student?.id) {
      setFormData(prev => ({ ...prev, studentId: student.id }));
    }
  }, [isOpen, student]);

  const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await http.post('feedback/create', formData);
      showToast('Monthly report submitted successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit report', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal show={isOpen} onClose={onClose} title={`Monthly Report - ${student?.name}`}>
      <Toast toast={toast} />
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 max-h-[65vh] overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-4">
          <AppSelect
            label="Month"
            value={formData.month}
            onChange={(e) => setFormData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
            options={MONTHS}
            required
          />
          <AppSelect
            label="Year"
            value={formData.year}
            onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            options={[today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map(y => ({ value: y, label: y.toString() }))}
            required
          />
        </div>

        <AppSelect
          label="Overall Grade"
          value={formData.overallGrade}
          onChange={(e) => setFormData(prev => ({ ...prev, overallGrade: e.target.value }))}
          options={GRADES}
          required
        />

        <div className="mb-4">
          <label className={labelClass}>Sabaq Progress *</label>
          <textarea placeholder="How is the student's lesson progress?" value={formData.sabaqProgress} onChange={set('sabaqProgress')} rows={3} className={textareaClass} required />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Tajweed & Quality</label>
          <textarea placeholder="Fluency, pronunciation, and rules..." value={formData.tajweedProgress} onChange={set('tajweedProgress')} rows={3} className={textareaClass} />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Behavior & Discipline</label>
          <textarea placeholder="Punctuality, focus, and attitude..." value={formData.behavior} onChange={set('behavior')} rows={2} className={textareaClass} />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Recommendations</label>
          <textarea placeholder="What should the student work on next?" value={formData.recommendations} onChange={set('recommendations')} rows={3} className={textareaClass} />
        </div>

        <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white pb-2">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </AppButton>
          <AppButton type="submit" variant="primary" loading={loading}>
            Post Report
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};

export default FeedbackModal;
