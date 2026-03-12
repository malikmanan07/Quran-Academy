import AppTable from '../../common/AppTable';
import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import { formatPKR } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

const PaymentTable = ({ payments, loading, onMarkPaid }) => {
  const columns = [
    { key: 'studentName', label: 'Student', render: (r) => r.studentName || '—' },
    { key: 'month', label: 'Month' },
    { key: 'amount', label: 'Amount', render: (r) => (
      <span className="font-semibold text-[#1A1A2E]">{formatPKR(r.amount)}</span>
    )},
    { key: 'paidAt', label: 'Paid Date', render: (r) => r.paidAt ? formatDate(r.paidAt) : '—' },
    { key: 'status', label: 'Status', render: (r) => <AppBadge status={r.status} /> },
    { key: 'actions', label: 'Actions', render: (r) => (
      r.status !== 'Paid' ? (
        <AppButton variant="accent" size="sm" onClick={() => onMarkPaid(r)}>Mark Paid</AppButton>
      ) : <span className="text-xs text-[#4A5568]">—</span>
    )},
  ];

  return <AppTable columns={columns} data={payments} loading={loading} emptyMessage="No payments found" />;
};

export default PaymentTable;
