import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import AppButton from '../../components/common/AppButton';
import AppModal from '../../components/common/AppModal';
import Toast, { useToast } from '../../components/common/Toast';
import EmptyState from '../../components/common/EmptyState';
import TableSkeleton from '../../components/common/TableSkeleton';
import { getAllParents, linkParent } from '../../features/parent/api';
import { getAllStudents } from '../../features/students/api';
import handleApiError from '../../utils/handleApiError';

const ParentsPage = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLink, setShowLink] = useState(false);
  const [form, setForm] = useState({ parentId: '', studentId: '' });
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        getAllParents(), getAllStudents({ limit: 1000 }),
      ]);
      setParents(pRes.data?.data?.parents || []);
      setStudents(sRes.data?.students || sRes.data?.data?.students || []);
    } catch { setParents([]); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleLink = async (e) => {
    e.preventDefault();
    if (!form.parentId || !form.studentId) return;
    setSaving(true);
    try {
      await linkParent({ parentId: parseInt(form.parentId), studentId: parseInt(form.studentId) });
      showToast('Parent linked to student!');
      setShowLink(false);
      setForm({ parentId: '', studentId: '' });
    } catch (err) { showToast(handleApiError(err), 'error'); }
    setSaving(false);
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="👨‍👩‍👧 Parents" subtitle={`${parents.length} parents`} actionLabel="Link Parent" onAction={() => setShowLink(true)} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {loading ? <TableSkeleton rows={5} cols={4} /> : parents.length === 0 ? (
          <EmptyState icon="👨‍👩‍👧" title="No Parents" message="Parents will appear here after signup" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F0F4F8] text-[#4A5568]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {parents.map(p => (
                  <tr key={p.id} className="hover:bg-[#F0F4F8]/50">
                    <td className="px-4 py-3 font-medium text-[#1A1A2E]">{p.name}</td>
                    <td className="px-4 py-3 text-[#4A5568]">{p.email}</td>
                    <td className="px-4 py-3 text-[#4A5568] hidden sm:table-cell">{p.phone || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AppModal show={showLink} onClose={() => setShowLink(false)} title="Link Parent to Student" size="sm">
        <form onSubmit={handleLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Parent</label>
            <select value={form.parentId} onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#00B4D8]/40 outline-none">
              <option value="">Select parent</option>
              {parents.map(p => <option key={p.id} value={p.id}>{p.name} ({p.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Student</label>
            <select value={form.studentId} onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))} className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#00B4D8]/40 outline-none">
              <option value="">Select student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
            </select>
          </div>
          <AppButton type="submit" variant="accent" fullWidth loading={saving}>Link</AppButton>
        </form>
      </AppModal>
    </div>
  );
};

export default ParentsPage;
