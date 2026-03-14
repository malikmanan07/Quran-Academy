import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import ScheduleFilters from '../../components/teacher/schedule/ScheduleFilters';
import ScheduleTable from '../../components/teacher/schedule/ScheduleTable';
import ScheduleClassModal from '../../components/teacher/ScheduleClassModal';
import { getClassesByTeacher, updateClassStatus, teacherScheduleClass, teacherRescheduleClass } from '../../features/classes/api';
import { getAllStudents } from '../../features/students/api';
import handleApiError from '../../utils/handleApiError';

const SchedulePage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]); // for scheduling
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const [resClasses, resStudents] = await Promise.all([
        getClassesByTeacher(),
        getAllStudents({ limit: 100 }) // Fetch teacher's students
      ]);
      setClasses(resClasses.data?.data?.classes || resClasses.data?.classes || []);
      setStudents(resStudents.data?.data?.students || resStudents.data?.students || []);
    } catch (err) {
      console.error('SchedulePage fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.id) fetch(); }, [user]);

  const filtered = useMemo(() => {
    let list = classes;
    if (search) list = list.filter(c => c.studentName?.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter) list = list.filter(c => c.status === statusFilter);
    return list;
  }, [classes, search, statusFilter]);

  const onMarkComplete = async (c) => {
    try { await updateClassStatus(c.id, { status: 'completed' }); showToast('Class marked as completed', 'success'); fetch(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };

  const onReschedule = (c) => {
    setEditClass(c);
    setShowModal(true);
  };

  const onSubmitSchedule = async (data) => {
    setSaving(true);
    try {
      if (editClass) {
        await teacherRescheduleClass(editClass.id, data);
        showToast('Class rescheduled successfully', 'success');
      } else {
        await teacherScheduleClass(data);
        showToast('Class scheduled successfully', 'success');
      }
      setShowModal(false);
      fetch();
    } catch (err) {
      showToast(handleApiError(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const onCancel = async (c) => {
    try { await updateClassStatus(c.id, { status: 'cancelled' }); showToast('Class cancelled'); fetch(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader 
        title="My Schedule" 
        subtitle={`${classes.length} total classes`} 
        actionLabel="Schedule New Class"
        onAction={() => { setEditClass(null); setShowModal(true); }}
      />
      <ScheduleFilters search={search} onSearchChange={setSearch}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        onReset={() => { setSearch(''); setStatusFilter(''); }} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <ScheduleTable classes={filtered} loading={loading} onMarkComplete={onMarkComplete} onCancel={onCancel} onReschedule={onReschedule} />
      </div>

      {showModal && (
        <ScheduleClassModal 
          show={showModal} 
          onClose={() => setShowModal(false)}
          students={students}
          onSubmit={onSubmitSchedule}
          loading={saving}
          initialData={editClass}
        />
      )}
    </div>
  );
};

export default SchedulePage;
