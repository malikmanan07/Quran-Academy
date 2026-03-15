import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import AppBadge from '../../components/common/AppBadge';
import { getMyAttendance, getAttendanceStats } from '../../features/attendance/api';
import { cachedRequest, getCache } from '../../services/apiCache';
import StatCardSkeleton from '../../components/common/StatCardSkeleton';
import TableSkeleton from '../../components/common/TableSkeleton';

const StudentAttendancePage = () => {
  const { user } = useAuth();
  const cacheKey = `student:attendance:${user?.id}`;
  const initialCache = getCache(cacheKey);
  
  const [attendance, setAttendance] = useState(initialCache?.attendance || []);
  const [stats, setStats] = useState(initialCache?.stats || null);
  const [loading, setLoading] = useState(!initialCache);
  const { toast } = useToast();

  const fetch = async () => {
    if (!initialCache) setLoading(true);
    try {
      const data = await cachedRequest(cacheKey, async () => {
        const [attRes, statRes] = await Promise.all([
          getMyAttendance(),
          getAttendanceStats(user.id)
        ]);
        return {
          attendance: attRes.data?.data?.attendance || attRes.data?.attendance || [],
          stats: statRes.data?.data?.stats || statRes.data?.stats || null
        };
      }, 300); // 5 min cache
      
      setAttendance(data.attendance);
      setStats(data.stats);
    } catch (err) { }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.id) fetch(); }, [user?.id]);

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader 
        title="My Attendance" 
        subtitle={stats ? `Overall Attendance: ${stats.percentage}%` : 'View your daily attendance records'} 
      />

      {loading && !stats ? (
        <StatCardSkeleton items={3} />
      ) : stats ? (
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200">
            <h3 className="text-sm font-semibold text-[#4A5568] uppercase">Present</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.present}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200">
            <h3 className="text-sm font-semibold text-[#4A5568] uppercase">Absent</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">{stats.absent}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-200">
            <h3 className="text-sm font-semibold text-[#4A5568] uppercase">Late</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.late}</p>
          </div>
        </div>
      ) : null}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E2E8F0]">
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-6">Recent Records</h3>
        
        {loading && attendance.length === 0 ? (
          <TableSkeleton rows={5} />
        ) : attendance.length === 0 ? (
          <p className="text-center text-[#4A5568] py-8">No attendance records found.</p>
        ) : (
          <div className="space-y-4">
            {attendance.map((rec, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-xl hover:bg-[#F0F4F8]/30 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-[#1A1A2E]">{new Date(rec.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    <AppBadge 
                      type={rec.status === 'present' ? 'success' : rec.status === 'absent' ? 'error' : 'warning'} 
                      text={rec.status.charAt(0).toUpperCase() + rec.status.slice(1)} 
                    />
                  </div>
                  <p className="text-sm text-[#4A5568]">Teacher: {rec.teacherName}</p>
                  {rec.notes && <p className="text-sm text-gray-500 mt-1 italic">"{rec.notes}"</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendancePage;
