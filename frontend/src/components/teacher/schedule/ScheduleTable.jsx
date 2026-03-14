import AppTable from '../../common/AppTable';
import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import SmartJoinButton from '../../common/SmartJoinButton';
import { formatDate } from '../../../utils/formatDate';

const ScheduleTable = ({ classes, loading, onMarkComplete, onCancel, onReschedule }) => {
  const columns = [
    { key: 'studentName', label: 'Student', render: (r) => r.studentName || '—' },
    { key: 'courseName', label: 'Course', render: (r) => r.courseName || '—' },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'time', label: 'Time', render: (r) => r.time || '—' },
    { key: 'duration', label: 'Duration', render: (r) => r.duration || '45min' },
    { key: 'meetingLink', label: 'Link', render: (r) => (
      <SmartJoinButton meetingLink={r.meetingLink} meetingPlatform={r.meetingPlatform} date={r.date} time={r.time} status={r.status} />
    ) },
    { key: 'status', label: 'Status', render: (r) => (
      <AppBadge status={r.status === 'completed' ? 'Completed' : r.status === 'cancelled' ? 'Cancelled' : 'Pending'} />
    )},
    { key: 'actions', label: 'Actions', render: (r) => r.status === 'scheduled' ? (
      <div className="flex items-center gap-1.5">
        <AppButton variant="primary" size="sm" onClick={() => onMarkComplete(r)}>✓</AppButton>
        <AppButton variant="outline" size="sm" onClick={() => onReschedule && onReschedule(r)}>Reschedule</AppButton>
        <AppButton variant="danger" size="sm" onClick={() => onCancel(r)}>✕</AppButton>
      </div>
    ) : <span className="text-xs text-[#4A5568]">—</span> },
  ];

  return <AppTable columns={columns} data={classes} loading={loading} emptyMessage="No classes found" />;
};

export default ScheduleTable;
