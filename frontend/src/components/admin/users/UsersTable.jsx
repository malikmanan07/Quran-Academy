import AppTable from '../../common/AppTable';
import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import { formatDate } from '../../../utils/formatDate';

const UsersTable = ({ users, loading, onApprove, onReject }) => {
  const columns = [
    {
      header: 'User',
      accessor: (user) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] flex items-center justify-center text-white font-medium">
              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium text-[#1A1A2E]">{user.name}</div>
            <div className="text-sm text-[#4A5568]">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: (user) => (
        <AppBadge variant={user.role === 'teacher' ? 'accent' : 'warning'} size="sm">
          {user.role}
        </AppBadge>
      )
    },
    {
      header: 'Status',
      accessor: (user) => {
        const variants = { active: 'success', pending: 'warning', rejected: 'danger' };
        return <AppBadge variant={variants[user.status]} size="sm">{user.status}</AppBadge>;
      }
    },
    {
      header: 'Joined',
      accessor: (user) => formatDate(user.createdAt)
    },
    {
      header: 'Actions',
      accessor: (user) => {
        if (user.status === 'pending') {
          return (
            <div className="flex items-center gap-2">
              <AppButton variant="outline" size="sm" onClick={() => onApprove(user.id)} className="!text-green-600 hover:!bg-green-50 hover:!border-green-200 !px-2">✓</AppButton>
              <AppButton variant="outline" size="sm" onClick={() => onReject(user.id)} className="!text-red-500 hover:!bg-red-50 hover:!border-red-200 !px-2">✕</AppButton>
            </div>
          );
        }
        return <span className="text-xs text-[#A0AEC0] italic px-2">Processed</span>;
      }
    }
  ];

  return <AppTable columns={columns} data={users} loading={loading} emptyMessage="No users found" />;
};

export default UsersTable;
