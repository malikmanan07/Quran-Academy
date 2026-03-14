import AppTable from '../../common/AppTable';
import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import { formatPKR } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

const PaymentHistoryTable = ({ payments, loading, onSubmitProof }) => {
  const columns = [
    { key: 'month', label: 'Month', render: (r) => r.month || '—' },
    { key: 'amount', label: 'Amount', render: (r) => (
      <span className="font-semibold text-[#1A1A2E]">{formatPKR(r.amount)}</span>
    )},
    { key: 'dueDate', label: 'Due Date', render: (r) => r.dueDate || '—' },
    { key: 'paidAt', label: 'Paid Date', render: (r) => r.paidAt ? formatDate(r.paidAt) : '—' },
    { key: 'status', label: 'Status', render: (r) => {
      let variant = 'cancelled'; // gray for pending/unpaid
      let text = 'Pending';
      if (r.status === 'verified' || r.status === 'Paid') { variant = 'success'; text = 'Verified ✓'; }
      else if (r.status === 'submitted') { variant = 'pending'; text = 'Verification Pending'; }
      else if (r.status === 'rejected') { variant = 'danger'; text = 'Rejected'; }
      
      return <AppBadge variant={variant}>{text}</AppBadge>;
    } },
    { key: 'actions', label: 'Action', render: (r) => (
      <div className="flex items-center gap-2">
        {(r.status === 'Unpaid' || r.status === 'rejected') && (
          <AppButton variant="primary" size="sm" onClick={() => onSubmitProof(r)}>
            Submit Proof
          </AppButton>
        )}
        {(r.status === 'verified' || r.status === 'Paid') && (
          <AppButton variant="outline" size="sm">📄 Receipt</AppButton>
        )}
      </div>
    )},
  ];

  return <AppTable columns={columns} data={payments} loading={loading} emptyMessage="No payment records" />;
};

export default PaymentHistoryTable;
