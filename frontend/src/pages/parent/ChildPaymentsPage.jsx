import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import TableSkeleton from '../../components/common/TableSkeleton';
import EmptyState from '../../components/common/EmptyState';
import AppBadge from '../../components/common/AppBadge';
import AppButton from '../../components/common/AppButton';
import PaymentSubmitModal from '../../components/student/PaymentSubmitModal';
import { useCurrency } from '../../hooks/useCurrency';
import { getChildPayments } from '../../features/parent/api';

const getStatusProps = (status) => {
  if (status === 'verified' || status === 'Paid') return { status: 'Active', label: 'Verified' };
  if (status === 'submitted') return { status: 'Info', label: 'Verifying' };
  if (status === 'rejected') return { status: 'Danger', label: 'Rejected' };
  return { status: 'Warning', label: status || 'Unpaid' };
};

const ChildPaymentsPage = () => {
  const { formatCurrency } = useCurrency();
  const { id } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await getChildPayments(id);
      setPayments(res.data?.data?.payments || []);
    } catch {
      setPayments([]);
    }
  };

  useEffect(() => {
    fetchPayments().finally(() => setLoading(false));
  }, [id]);

  const handleOpenModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  return (
    <div>
      <PageHeader title="💰 Child's Payments" subtitle="Payment history and submission" />
      <Link to="/parent/dashboard" className="text-sm text-[#00B4D8] hover:underline mb-4 inline-block">← Back to Dashboard</Link>

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : payments.length === 0 ? (
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
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {payments.map(p => {
                  const badgeProps = getStatusProps(p.status);
                  return (
                    <tr key={p.id} className="hover:bg-[#F0F4F8]/50">
                      <td className="px-4 py-3 font-medium text-[#1A1A2E]">{p.month}</td>
                      <td className="px-4 py-3 text-[#4A5568]">{formatCurrency(p.amount)}</td>
                      <td className="px-4 py-3">
                        <AppBadge status={badgeProps.status}>{badgeProps.label}</AppBadge>
                      </td>
                      <td className="px-4 py-3 text-[#4A5568] hidden sm:table-cell">{p.dueDate || '—'}</td>
                      <td className="px-4 py-3">
                        {(p.status === 'Unpaid' || p.status === 'rejected' || !p.status) && (
                          <AppButton variant="primary" size="sm" onClick={() => handleOpenModal(p)}>
                            Pay Now
                          </AppButton>
                        )}
                        {(p.status === 'verified' || p.status === 'Paid') && (
                          <span className="text-xs text-green-600 font-medium">✓ Completed</span>
                        )}
                        {p.status === 'submitted' && (
                          <span className="text-xs text-blue-600 font-medium">⏳ Pending Review</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPayment && (
        <PaymentSubmitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          studentId={id}
          month={selectedPayment.month}
          amount={selectedPayment.amount}
          onSuccess={fetchPayments}
        />
      )}
    </div>
  );
};

export default ChildPaymentsPage;
