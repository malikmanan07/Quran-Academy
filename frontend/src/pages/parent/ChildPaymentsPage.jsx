import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import AppBadge from '../../components/common/AppBadge';
import { getChildPayments } from '../../features/parent/api';

const statusMap = { Paid: 'success', paid: 'success', Unpaid: 'warning', unpaid: 'warning' };

const ChildPaymentsPage = () => {
  const { id } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getChildPayments(id);
        setPayments(res.data?.data?.payments || []);
      } catch { setPayments([]); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHeader title="💰 Child's Payments" subtitle="Payment history" />
      <Link to="/parent/dashboard" className="text-sm text-[#00B4D8] hover:underline mb-4 inline-block">← Back to Dashboard</Link>
      {payments.length === 0 ? (
        <EmptyState icon="💰" title="No Payments" message="Payment records will appear here" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F0F4F8] text-[#4A5568]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Month</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-[#F0F4F8]/50">
                    <td className="px-4 py-3 font-medium text-[#1A1A2E]">{p.month}</td>
                    <td className="px-4 py-3 text-[#4A5568]">PKR {p.amount?.toLocaleString()}</td>
                    <td className="px-4 py-3"><AppBadge variant={statusMap[p.status] || 'default'}>{p.status}</AppBadge></td>
                    <td className="px-4 py-3 text-[#4A5568] hidden sm:table-cell">{p.dueDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildPaymentsPage;
