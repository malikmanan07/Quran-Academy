import AppTable from '../../common/AppTable';
import { formatDate } from '../../../utils/formatDate';

const stars = (n) => '⭐'.repeat(Math.min(n || 0, 5));

const ProgressTable = ({ progress, loading, onEdit, onDelete }) => {
  const columns = [
    { key: 'studentName', label: 'Student', render: (r) => r.studentName || '—' },
    { key: 'lesson', label: 'Lesson', render: (r) => r.lesson || r.title || '—' },
    { key: 'rating', label: 'Rating', render: (r) => <span className="text-sm">{stars(r.rating)}</span> },
    { key: 'createdAt', label: 'Date', render: (r) => formatDate(r.createdAt) },
    { key: 'remarks', label: 'Remarks', render: (r) => (
      <p className="text-xs text-[#4A5568] max-w-[200px] truncate">{r.remarks || '—'}</p>
    )},
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(r)} className="p-1.5 rounded-lg hover:bg-[#00B4D8]/10 text-[#00B4D8] transition-colors cursor-pointer">✏️</button>
        <button onClick={() => onDelete(r)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors cursor-pointer">🗑️</button>
      </div>
    )},
  ];

  return <AppTable columns={columns} data={progress} loading={loading} emptyMessage="No progress reports" />;
};

export default ProgressTable;
