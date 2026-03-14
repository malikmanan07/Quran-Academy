import { useState, useEffect } from 'react';
import AppModal from '../common/AppModal';
import AppInput from '../common/AppInput';
import AppButton from '../common/AppButton';

const grades = [
  { value: 'Excellent', label: 'Excellent 🌟' },
  { value: 'Good', label: 'Good 👍' },
  { value: 'Average', label: 'Average 😐' },
  { value: 'Poor', label: 'Poor 👎' },
];

const DailySabaqModal = ({ show, onClose, onSubmit, record, loading, students }) => {
  const [form, setForm] = useState({
    studentId: '', date: new Date().toISOString().split('T')[0],
    sabaqSurah: '', sabaqAyatFrom: '', sabaqAyatTo: '',
    sabaqGrade: 'Good', sabqiGrade: 'Good', manzilGrade: 'Good', notes: ''
  });

  useEffect(() => {
    if (show) setForm(record ? { ...record, date: record.date.split('T')[0] } : {
      studentId: '', date: new Date().toISOString().split('T')[0],
      sabaqSurah: '', sabaqAyatFrom: '', sabaqAyatTo: '',
      sabaqGrade: 'Good', sabqiGrade: 'Good', manzilGrade: 'Good', notes: ''
    });
  }, [record, show]);

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
  const onChange = (f) => (e) => setForm(o => ({ ...o, [f]: e.target.value }));

  return (
    <AppModal show={show} onClose={onClose} title={record ? 'Edit Daily Sabaq' : 'Add Daily Sabaq'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!record && (
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Student</label>
            <select value={form.studentId} onChange={onChange('studentId')} required
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B4D8]/40 outline-none">
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}
        <AppInput label="Date" type="date" value={form.date} onChange={onChange('date')} required max={new Date().toISOString().split('T')[0]} />

        <div className="bg-[#F0F4F8] p-3 rounded-lg border border-[#E2E8F0]">
          <h4 className="text-sm font-bold text-[#1A1A2E] mb-3">📖 Sabaq (New Lesson)</h4>
          <AppInput label="Surah/Para" value={form.sabaqSurah} onChange={onChange('sabaqSurah')} placeholder="e.g. Al-Baqarah" />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <AppInput label="From Ayat" value={form.sabaqAyatFrom} onChange={onChange('sabaqAyatFrom')} placeholder="e.g. 1" />
            <AppInput label="To Ayat" value={form.sabaqAyatTo} onChange={onChange('sabaqAyatTo')} placeholder="e.g. 10" />
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Sabaq Grade</label>
            <select value={form.sabaqGrade} onChange={onChange('sabaqGrade')} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm">
              {grades.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Sabqi Grade</label>
            <select value={form.sabqiGrade} onChange={onChange('sabqiGrade')} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm">
              {grades.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
            <p className="text-[10px] text-[#4A5568] mt-1">Recent revision</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Manzil Grade</label>
            <select value={form.manzilGrade} onChange={onChange('manzilGrade')} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm">
              {grades.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
            <p className="text-[10px] text-[#4A5568] mt-1">Old revision target</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Teacher Notes</label>
          <textarea value={form.notes} onChange={onChange('notes')} rows={2} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm resize-none" placeholder="Any comments..." />
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <AppButton type="button" variant="outline" onClick={onClose}>Cancel</AppButton>
          <AppButton type="submit" variant="primary" loading={loading}>Save</AppButton>
        </div>
      </form>
    </AppModal>
  );
};

export default DailySabaqModal;
