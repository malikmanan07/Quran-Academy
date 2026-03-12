import AppTable from '../../common/AppTable';
import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import { formatPKR } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

const PaymentHistoryTable = ({ payments, loading }) => {
  const columns = [
    { key: 'month', label: 'Month', render: (r) => r.month || '—' },
    { key: 'amount', label: 'Amount', render: (r) => (
      <span className="font-semibold text-[#1A1A2E]">{formatPKR(r.amount)}</span>
    )},
    { key: 'dueDate', label: 'Due Date', render: (r) => r.dueDate || '—' },
    { key: 'paidAt', label: 'Paid Date', render: (r) => r.paidAt ? formatDate(r.paidAt) : '—' },
    { key: 'status', label: 'Status', render: (r) => <AppBadge status={r.status} /> },
    { key: 'receipt', label: 'Receipt', render: (r) => r.status === 'Paid' ? (
      <AppButton variant="outline" size="sm">📄 Receipt</AppButton>
    ) : <span className="text-xs text-[#4A5568]">—</span> },
  ];

  return <AppTable columns={columns} data={payments} loading={loading} emptyMessage="No payment records" />;
};

export default PaymentHistoryTable;
