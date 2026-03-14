import AppTable from '../../common/AppTable';
import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import { useCurrency } from '../../../hooks/useCurrency';
import { formatDate } from '../../../utils/formatDate';

const PaymentTable = ({ payments, loading, onMarkPaid, onVerify, onReject }) => {
  const { formatCurrency } = useCurrency();
  const columns = [
    { key: 'studentName', label: 'Student', render: (r) => r.studentName || '—' },
    { key: 'month', label: 'Month' },
    { key: 'amount', label: 'Amount', render: (r) => (
      <span className="font-semibold text-[#1A1A2E]">{formatCurrency(r.amount)}</span>
    )},
    { key: 'details', label: 'Method / ID', render: (r) => r.paymentMethod ? (
      <div className="text-xs">
        <p className="font-medium">{r.paymentMethod}</p>
        <p className="text-[#4A5568]">{r.transactionId}</p>
      </div>
    ) : '—' },
    { key: 'submittedAt', label: 'Submitted', render: (r) => r.submittedAt ? formatDate(r.submittedAt) : '—' },
    { key: 'status', label: 'Status', render: (r) => {
      let variant = 'cancelled';
      let text = 'Unpaid';
      if (r.status === 'verified' || r.status === 'Paid') { variant = 'success'; text = 'Verified ✓'; }
      else if (r.status === 'submitted') { variant = 'pending'; text = 'Verification Pending'; }
      else if (r.status === 'rejected') { variant = 'danger'; text = 'Rejected'; }
      
      return <AppBadge variant={variant}>{text}</AppBadge>;
    } },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-2">
        {r.status === 'submitted' && (
          <>
            <AppButton variant="primary" size="sm" onClick={() => onVerify(r)}>Verify</AppButton>
            <AppButton variant="danger" size="sm" onClick={() => onReject(r)}>Reject</AppButton>
          </>
        )}
        {(r.status === 'Unpaid' || r.status === 'rejected') && (
          <AppButton variant="accent" size="sm" onClick={() => onMarkPaid(r)}>Mark Paid</AppButton>
        )}
      </div>
    )},
  ];

  return <AppTable columns={columns} data={payments} loading={loading} emptyMessage="No payments found" />;
};

export default PaymentTable;
