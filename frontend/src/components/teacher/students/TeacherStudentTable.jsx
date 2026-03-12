import AppTable from '../../common/AppTable';
import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';

const TeacherStudentTable = ({ students, loading, onViewProgress }) => {
  const columns = [
    { key: 'name', label: 'Student', render: (r) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#00B4D8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {r.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <span className="font-medium text-[#1A1A2E]">{r.name}</span>
      </div>
    )},
    { key: 'email', label: 'Email' },
    { key: 'courseName', label: 'Course', render: (r) => r.courseName || '—' },
    { key: 'progress', label: 'Progress', render: (r) => (
      <div className="w-20">
        <div className="flex justify-between text-xs text-[#4A5568] mb-1"><span>{r.progress || 0}%</span></div>
        <div className="w-full bg-[#E2E8F0] rounded-full h-1.5">
          <div className="bg-[#00B4D8] h-1.5 rounded-full" style={{ width: `${r.progress || 0}%` }} />
        </div>
      </div>
    )},
    { key: 'isActive', label: 'Status', render: (r) => <AppBadge status={r.isActive !== false ? 'Active' : 'Inactive'} /> },
    { key: 'actions', label: 'Actions', render: (r) => (
      <AppButton variant="outline" size="sm" onClick={() => onViewProgress(r)}>View Progress</AppButton>
    )},
  ];

  return <AppTable columns={columns} data={students} loading={loading} emptyMessage="No students assigned" />;
};

export default TeacherStudentTable;
