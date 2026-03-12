import { Link } from 'react-router-dom';
import AppTable from '../../common/AppTable';
import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import { ROUTES } from '../../../constants/routes';
import { formatDate } from '../../../utils/formatDate';

const columns = [
  { key: 'name', label: 'Name', render: (r) => (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {r.name?.charAt(0)?.toUpperCase() || '?'}
      </div>
      <span className="font-medium text-[#1A1A2E]">{r.name}</span>
    </div>
  )},
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone', render: (r) => r.phone || '—' },
  { key: 'isActive', label: 'Status', render: (r) => <AppBadge status={r.isActive !== false ? 'Active' : 'Inactive'} /> },
  { key: 'createdAt', label: 'Enrolled', render: (r) => formatDate(r.createdAt) },
];

const RecentStudents = ({ students, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
    <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
      <h3 className="text-base font-semibold text-[#1A1A2E]">Recent Students</h3>
      <Link to={ROUTES.ADMIN_STUDENTS}>
        <AppButton variant="outline" size="sm">View All</AppButton>
      </Link>
    </div>
    <AppTable columns={columns} data={(students || []).slice(0, 5)} loading={loading} emptyMessage="No students yet" />
  </div>
);

export default RecentStudents;
