import { Link } from 'react-router-dom';
import AppTable from '../../common/AppTable';
import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import { ROUTES } from '../../../constants/routes';
import { formatPKR } from '../../../utils/formatCurrency';

const columns = [
  { key: 'studentName', label: 'Student', render: (r) => r.studentName || '—' },
  { key: 'amount', label: 'Amount', render: (r) => (
    <span className="font-semibold text-[#1A1A2E]">{formatPKR(r.amount)}</span>
  )},
  { key: 'month', label: 'Month' },
  { key: 'status', label: 'Status', render: (r) => <AppBadge status={r.status} /> },
];

const RecentPayments = ({ payments, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
    <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
      <h3 className="text-base font-semibold text-[#1A1A2E]">Recent Payments</h3>
      <Link to={ROUTES.ADMIN_PAYMENTS}>
        <AppButton variant="outline" size="sm">View All</AppButton>
      </Link>
    </div>
    <AppTable columns={columns} data={(payments || []).slice(0, 5)} loading={loading} emptyMessage="No payments yet" />
  </div>
);

export default RecentPayments;
