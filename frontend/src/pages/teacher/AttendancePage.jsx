import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import AppTable from '../../components/common/AppTable';
import AppBadge from '../../components/common/AppBadge';
import AppButton from '../../components/common/AppButton';
import AttendanceModal from '../../components/teacher/AttendanceModal';
import { getClassesByTeacher } from '../../features/classes/api';
import { markAttendance } from '../../features/attendance/api';

const TeacherAttendancePage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingClass, setSavingClass] = useState(null);
  const [markLoading, setMarkLoading] = useState(false);
  const { toast, showToast } = useToast();

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { data } = await getClassesByTeacher();
      // Filters for classes from today or past that haven't been marked or just list all
      const list = data?.data?.classes || data?.classes || [];
      // Let's sort by date descending so recent classes are at the top
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
      setClasses(list);
    } catch (err) {
      showToast('Failed to limit classes', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { if (user?.id) fetchClasses(); }, [user]);

  const handleMarkAttendance = async (data) => {
    setMarkLoading(true);
    try {
      await markAttendance(data);
      showToast('Attendance recorded successfully', 'success');
      setSavingClass(null);
      // In a real app we'd mark this class as 'attendance logged' to prevent duplicate or update UI state
      fetchClasses();
    } catch (err) {
      showToast('Failed to mark attendance', 'error');
    }
    setMarkLoading(false);
  };

  const columns = [
    { key: 'date', label: 'Date', render: r => <span className="font-semibold">{r.date}</span> },
    { key: 'time', label: 'Time', render: r => r.time },
    { key: 'studentName', label: 'Student', render: r => r.studentName },
    { key: 'courseName', label: 'Course', render: r => r.courseName },
    { key: 'actions', label: 'Actions', render: r => (
      <AppButton variant="outline" size="sm" onClick={() => setSavingClass(r)}>
        Mark Attendance
      </AppButton>
    )}
  ];

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Class Attendance" subtitle="Mark and view student attendance." />
      
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <AppTable columns={columns} data={classes} loading={loading} emptyMessage="No classes found." />
      </div>

      {savingClass && (
        <AttendanceModal 
          show={!!savingClass}
          onClose={() => setSavingClass(null)}
          classData={savingClass}
          onSubmit={handleMarkAttendance}
          loading={markLoading}
        />
      )}
    </div>
  );
};

export default TeacherAttendancePage;
