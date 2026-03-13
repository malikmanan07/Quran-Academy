import { useState, useEffect } from 'react';
import AppModal from '../common/AppModal';
import AppInput from '../common/AppInput';
import AppButton from '../common/AppButton';
import { bookTrial } from '../../features/trial/api';
import { getAllCourses } from '../../features/courses/api';

const timeSlots = ['Morning (8AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-10PM)'];

const TrialBookingModal = ({ show, onClose }) => {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', country: '', timezone: '', courseId: '', preferredTime: '', message: '',
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setForm(prev => ({ ...prev, timezone: tz }));
      getAllCourses({ limit: 50 }).then(res => {
        const list = res.data?.data?.courses || res.data?.courses || [];
        setCourses(list);
      }).catch(() => {});
    }
  }, [show]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await bookTrial({ ...form, courseId: form.courseId ? parseInt(form.courseId) : null });
      setSuccess(true);
    } catch { setErrors({ form: 'Booking failed. Please try again.' }); }
    setLoading(false);
  };

  const handleClose = () => { setSuccess(false); setForm({ fullName: '', email: '', phone: '', country: '', timezone: '', courseId: '', preferredTime: '', message: '' }); setErrors({}); onClose(); };
  const onChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  if (success) {
    return (
      <AppModal show={show} onClose={handleClose} title="Trial Booked! 🎉" size="sm">
        <div className="text-center py-6">
          <span className="text-5xl block mb-4">✅</span>
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Thank You!</h3>
          <p className="text-sm text-[#4A5568] mb-6">We&apos;ll contact you within 24 hours!</p>
          <AppButton variant="accent" onClick={handleClose}>Close</AppButton>
        </div>
      </AppModal>
    );
  }

  return (
    <AppModal show={show} onClose={handleClose} title="📖 Book Free Trial Class" size="md">
      <form onSubmit={handleSubmit} className="space-y-3">
        {errors.form && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{errors.form}</p>}
        <AppInput label="Full Name" value={form.fullName} onChange={onChange('fullName')} error={errors.fullName} required />
        <AppInput label="Email" type="email" value={form.email} onChange={onChange('email')} error={errors.email} required />
        <AppInput label="Phone" type="tel" value={form.phone} onChange={onChange('phone')} error={errors.phone} required placeholder="+92 300 1234567" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Country</label>
            <select value={form.country} onChange={onChange('country')} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] outline-none">
              <option value="">Select country</option>
              {['Pakistan','USA','UK','Saudi Arabia','UAE','Canada','Australia','Germany','France','Turkey','Malaysia','Indonesia','Bangladesh','India','Egypt'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Timezone</label>
            <input value={form.timezone} readOnly className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm bg-gray-50 text-[#4A5568]" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Preferred Course</label>
            <select value={form.courseId} onChange={onChange('courseId')} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] outline-none">
              <option value="">Select course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Preferred Time</label>
            <select value={form.preferredTime} onChange={onChange('preferredTime')} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] outline-none">
              <option value="">Select time</option>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Message (Optional)</label>
          <textarea value={form.message} onChange={onChange('message')} rows={2} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] outline-none resize-none" placeholder="Any specific requirements..." />
        </div>
        <AppButton type="submit" variant="accent" fullWidth size="lg" loading={loading}>Book Free Trial</AppButton>
      </form>
    </AppModal>
  );
};

export default TrialBookingModal;
