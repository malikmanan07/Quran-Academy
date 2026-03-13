import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import AppBadge from '../../components/common/AppBadge';
import AppButton from '../../components/common/AppButton';
import Toast, { useToast } from '../../components/common/Toast';
import EmptyState from '../../components/common/EmptyState';
import TableSkeleton from '../../components/common/TableSkeleton';
import { getTrialRequests, updateTrialStatus } from '../../features/trial/api';
import handleApiError from '../../utils/handleApiError';

const statusMap = { pending: 'warning', approved: 'success', rejected: 'danger' };

const TrialRequestsPage = () => {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getTrialRequests();
      setTrials(res.data?.data?.trials || []);
    } catch { setTrials([]); }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateTrialStatus(id, status);
      showToast(`Trial ${status}`);
      fetch();
    } catch (err) { showToast(handleApiError(err), 'error'); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="🎯 Trial Requests" subtitle={`${trials.length} requests`} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {loading ? <TableSkeleton rows={5} cols={6} /> : trials.length === 0 ? (
          <EmptyState icon="🎯" title="No Trial Requests" message="Trial requests will appear here" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F0F4F8] text-[#4A5568]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Phone</th>
                  <th className="px-4 py-3 font-semibold hidden lg:table-cell">Course</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {trials.map(t => (
                  <tr key={t.id} className="hover:bg-[#F0F4F8]/50">
                    <td className="px-4 py-3 font-medium text-[#1A1A2E]">{t.fullName}</td>
                    <td className="px-4 py-3 text-[#4A5568]">{t.email}</td>
                    <td className="px-4 py-3 text-[#4A5568] hidden md:table-cell">{t.phone}</td>
                    <td className="px-4 py-3 text-[#4A5568] hidden lg:table-cell">{t.courseName || '—'}</td>
                    <td className="px-4 py-3"><AppBadge variant={statusMap[t.status]}>{t.status}</AppBadge></td>
                    <td className="px-4 py-3">
                      {t.status === 'pending' && (
                        <div className="flex gap-2">
                          <AppButton variant="secondary" size="sm" onClick={() => handleStatus(t.id, 'approved')}>✓</AppButton>
                          <AppButton variant="danger" size="sm" onClick={() => handleStatus(t.id, 'rejected')}>✕</AppButton>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialRequestsPage;
