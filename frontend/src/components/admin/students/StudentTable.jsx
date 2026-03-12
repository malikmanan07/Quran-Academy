import AppTable from '../../common/AppTable';
import AppBadge from '../../common/AppBadge';
import { formatDate } from '../../../utils/formatDate';

const StudentTable = ({ students, loading, onEdit, onDelete }) => {
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
    { key: 'isActive', label: 'Status', render: (r) => (
      <AppBadge status={r.isActive !== false ? 'Active' : 'Inactive'} />
    )},
    { key: 'createdAt', label: 'Enrolled', render: (r) => formatDate(r.createdAt) },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(r)} className="p-1.5 rounded-lg hover:bg-[#00B4D8]/10 text-[#00B4D8] transition-colors cursor-pointer" title="Edit">
          ✏️
        </button>
        <button onClick={() => onDelete(r)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors cursor-pointer" title="Delete">
          🗑️
        </button>
      </div>
    )},
  ];

  return <AppTable columns={columns} data={students} loading={loading} emptyMessage="No students found" />;
};

export default StudentTable;
