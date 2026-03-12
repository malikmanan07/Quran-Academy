import AppTable from '../../common/AppTable';
import AppBadge from '../../common/AppBadge';
import { formatDate } from '../../../utils/formatDate';

const ClassTable = ({ classes, loading, onEdit, onDelete }) => {
  const columns = [
    { key: 'studentName', label: 'Student', render: (r) => r.studentName || '—' },
    { key: 'teacherName', label: 'Teacher', render: (r) => r.teacherName || '—' },
    { key: 'courseName', label: 'Course', render: (r) => r.courseName || '—' },
    { key: 'date', label: 'Date & Time', render: (r) => (
      <div>
        <p className="text-sm font-medium">{formatDate(r.date)}</p>
        <p className="text-xs text-[#4A5568]">{r.time || '—'}</p>
      </div>
    )},
    { key: 'duration', label: 'Duration', render: (r) => r.duration || '—' },
    { key: 'status', label: 'Status', render: (r) => (
      <AppBadge status={r.status === 'scheduled' ? 'Pending' : r.status === 'completed' ? 'Active' : 'Inactive'} />
    )},
    { key: 'meetingLink', label: 'Link', render: (r) => r.meetingLink ? (
      <a href={r.meetingLink} target="_blank" rel="noopener noreferrer"
        className="text-[#00B4D8] text-xs hover:underline">Join</a>
    ) : '—' },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(r)} className="p-1.5 rounded-lg hover:bg-[#00B4D8]/10 text-[#00B4D8] transition-colors cursor-pointer">✏️</button>
        <button onClick={() => onDelete(r)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors cursor-pointer">🗑️</button>
      </div>
    )},
  ];

  return <AppTable columns={columns} data={classes} loading={loading} emptyMessage="No classes scheduled" />;
};

export default ClassTable;
