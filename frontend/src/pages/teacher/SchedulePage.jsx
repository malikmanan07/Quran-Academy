import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import ScheduleFilters from '../../components/teacher/schedule/ScheduleFilters';
import ScheduleTable from '../../components/teacher/schedule/ScheduleTable';
import { getClassesByTeacher, updateClassStatus } from '../../features/classes/api';
import handleApiError from '../../utils/handleApiError';

const SchedulePage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toast, showToast } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getClassesByTeacher();
      // Extract from response.data (axios) -> .data (backend) -> .classes
      const list = res.data?.data?.classes || res.data?.classes || [];
      setClasses(list);
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
    try { await updateClassStatus(c.id, { status: 'completed' }); showToast('Class marked as completed'); fetch(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };

  const onCancel = async (c) => {
    try { await updateClassStatus(c.id, { status: 'cancelled' }); showToast('Class cancelled'); fetch(); }
    catch (err) { showToast(handleApiError(err), 'error'); }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="My Schedule" subtitle={`${classes.length} total classes`} />
      <ScheduleFilters search={search} onSearchChange={setSearch}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        onReset={() => { setSearch(''); setStatusFilter(''); }} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <ScheduleTable classes={filtered} loading={loading} onMarkComplete={onMarkComplete} onCancel={onCancel} />
      </div>
    </div>
  );
};

export default SchedulePage;
