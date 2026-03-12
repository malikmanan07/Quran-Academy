import { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import PaymentStats from '../../components/admin/payments/PaymentStats';
import PaymentFilters from '../../components/admin/payments/PaymentFilters';
import PaymentTable from '../../components/admin/payments/PaymentTable';
import { getAllPayments, updatePaymentStatus } from '../../features/payments/api';
import handleApiError from '../../utils/handleApiError';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await getAllPayments(); setPayments(data.payments || []); }
    catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    let list = payments;
    if (search) list = list.filter(p => p.studentName?.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter) list = list.filter(p => p.status === statusFilter);
    return list;
  }, [payments, search, statusFilter]);

  const onMarkPaid = async (payment) => {
    try {
      await updatePaymentStatus(payment.id, { status: 'Paid' });
      showToast('Payment marked as paid');
      fetch();
    } catch (err) { showToast(handleApiError(err), 'error'); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Payments" subtitle="View and manage payment records" />
      <PaymentStats payments={payments} />
      <PaymentFilters search={search} onSearchChange={setSearch}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        onReset={() => { setSearch(''); setStatusFilter(''); }} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <PaymentTable payments={filtered} loading={loading} onMarkPaid={onMarkPaid} />
      </div>
    </div>
  );
};

export default PaymentsPage;
